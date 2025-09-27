/*  index.mjs  –  Node 18+  */
/*********************************************************************/
/* 1.  Imports                                                       */
/*********************************************************************/
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/lib-dynamodb";
import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import { mkdir, writeFile, readFile, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";


ffmpeg.setFfmpegPath("/opt/bin/ffmpeg");
ffmpeg.setFfprobePath("/opt/bin/ffprobe");

/*********************************************************************/
/* 2.  Secrets – use env vars or AWS Secrets Manager                 */
/*********************************************************************/
const PIAPI_KEY      = process.env.PIAPI_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CLIENT_ID      = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET  = process.env.YOUTUBE_CLIENT_SECRET;
const REFRESH_TOKEN  = process.env.YOUTUBE_REFRESH_TOKEN;
const TABLE          = "VideoProjects";

const db = new DynamoDBClient({});

/*********************************************************************/
/* 3.  Tiny helpers                                                  */
/*********************************************************************/
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function download(uri, outPath) {
  const res = await axios.get(uri, { responseType: "stream" });
  const writer = (await import("fs")).createWriteStream(outPath);
  res.data.pipe(writer);
  return new Promise((res, rej) => writer.on("finish", res).on("error", rej));
}

/*********************************************************************/
/* 4.  PiAPI client                                                  */
/*********************************************************************/
class PiAPIClient {
  constructor(apiKey) {
    this.client = axios.create({
      baseURL: "https://api.piapi.ai/api/v1",
      headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
      timeout: 30000,
    });
  }
  async generateImage(prompt, imageUrls = [], numImages = 1, outputFormat = "jpeg") {
    const { data } = await this.client.post("/task", {
      model: "gemini",
      task_type: "gemini-2.5-flash-image",
      input: { prompt, image_urls: imageUrls, num_images: numImages, output_format: outputFormat },
    });
    if (data.code !== 200) throw new Error(data.message);
    const taskId = data.data.task_id;
    for (let i = 0; i < 40; i++) {
      const { data: poll } = await this.client.get(`/task/${taskId}`);
      const st = poll.data?.status || poll.data?.task_status;
      if (["success", "completed", "Completed"].includes(st)) {
        const urls = (poll.data.output?.image_urls || poll.data.task_output?.image_url || []).flat();
        if (!urls.length) throw new Error("No image returned");
        return urls[0];
      }
      if (["failed", "Failed"].includes(st)) throw new Error("PiAPI task failed");
      await sleep(2000);
    }
    throw new Error("PiAPI timeout");
  }
}

/*********************************************************************/
/* 5.  Gemini video  ––  100 % REST                                  */
/*********************************************************************/
async function startVideoGeneration({ prompt, negativePrompt, aspectRatio, manipulatedUrl }) {
  const tmpManip = join(tmpdir(), `manip_${Date.now()}.jpg`);
  await download(manipulatedUrl, tmpManip);
  const imageBytes = (await readFile(tmpManip)).toString("base64");

  const payload = {
    instances: [{
      prompt,
      referenceImages: [{
        referenceType: "asset",
        image: { bytesBase64Encoded: imageBytes, mimeType: "image/jpeg" },
      }],
    }],
    parameters: {
      aspectRatio: aspectRatio || "16:9",
      ...(negativePrompt && { negativePrompt }),
      sampleCount: 1,
      durationSeconds: 8,
    },
  };

  const endpoint =
    "https://generativelanguage.googleapis.com/v1beta/models/veo-3.0-generate-001:predictLongRunning";

  const { data } = await axios.post(endpoint, payload, {
    headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY },
  });
  if (!data.name) throw new Error("No operation name returned");
  return data.name; // eg "operations/abc123"
}

async function pollVideoOperation(name) {
  const pollUrl = `https://generativelanguage.googleapis.com/v1beta/${name}?key=${GEMINI_API_KEY}`;
  for (let i = 0; i < 200; i++) {
    const { data } = await axios.get(pollUrl);
    if (data.done === true) {
      const uri = data.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
      if (!uri) throw new Error("Video URI missing in final response");
      return uri;
    }
    await sleep(5000);
  }
  throw new Error("Video poll timeout");
}

/*********************************************************************/
/* 6.  Concat                                                        */
/*********************************************************************/
async function concatVideos(scenePaths, outPath) {
  const listFile = join(tmpdir(), "list.txt");
  await writeFile(listFile, scenePaths.map((p) => `file '${p}'`).join("\n"));
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(listFile)
      .inputOptions(["-f concat", "-safe 0"])
      .outputOptions(["-c copy"])
      .on("end", resolve)
      .on("error", reject)
      .save(outPath);
  });
}

/*********************************************************************/
/* 7.  YouTube upload  ––  REST only                                 */
/*********************************************************************/
async function refreshAccessToken() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: REFRESH_TOKEN,
    grant_type: "refresh_token",
  });
  const { data } = await axios.post("https://oauth2.googleapis.com/token", params);
  return data.access_token;
}

async function uploadToYouTube(filePath, meta) {
  const accessToken = await refreshAccessToken();

  /* 1. resumable upload start */
  const init = await axios.post(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
    {
      snippet: {
        title: meta.title || "Auto generated video",
        description: meta.description || "Auto-uploaded by bot",
        tags: meta.tags || [],
      },
      status: { privacyStatus: meta.privacy || "private" },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Upload-Content-Length": (await readFile(filePath)).length,
        "X-Upload-Content-Type": "video/mp4",
      },
    }
  );
  const uploadUrl = init.headers.location;

  /* 2. upload bytes */
  await axios.put(uploadUrl, await readFile(filePath), {
    headers: { "Content-Type": "video/mp4" },
    maxBodyLength: Infinity,
  });

  /* 3. retrieve id */
  const { data } = await axios.get(uploadUrl.split("?")[0] + "?part=id", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data.id;
}

/*********************************************************************/
/* 8.  Single project runner                                         */
/*********************************************************************/
async function runProject(project) {
  const workDir = join(tmpdir(), `proj_${project.id}`);
  await mkdir(workDir, { recursive: true });
  try {
    const piapi = new PiAPIClient(PIAPI_KEY);
    const sceneVideos = [];

    for (let idx = 0; idx < project.scenes.length; idx++) {
      const s = project.scenes[idx];
      const sceneImageIdx = project.scene_image_indexes?.[idx] || [];
      const sceneImageUrls = sceneImageIdx.map((i) => project.raw_image_urls[i]).filter(Boolean);
      if (!sceneImageUrls.length) throw new Error(`No images for scene ${idx}`);

      const imageUrl = s.use_manipulated_image
        ? await piapi.generateImage(s.imagePrompt, sceneImageUrls, 1, "jpeg")
        : sceneImageUrls[0];

      const opName = await startVideoGeneration({
        prompt: s.videoPrompt,
        negativePrompt: s.negativePrompt,
        aspectRatio: s.aspectRatio,
        manipulatedUrl: imageUrl,
      });
      const videoUri = await pollVideoOperation(opName);
      const localVideo = join(workDir, `scene_${idx}.mp4`);
      await download(videoUri, localVideo);
      sceneVideos.push(localVideo);
    }

    const finalPath = join(workDir, "final.mp4");
    await concatVideos(sceneVideos, finalPath);

    const youtubeId = await uploadToYouTube(finalPath, {
      title: project.title || "Auto generated video",
      description: project.description || "Auto-uploaded by bot",
      tags: project.tags || [],
      privacy: project.privacy || "private",
    });
    console.log(`[runProject] YouTube videoId: ${youtubeId}`);

    const finalVideoUrl = `https://youtu.be/${youtubeId}`;

    await db.send(
      new UpdateItemCommand({
        TableName: TABLE,
        Key: { id: project.id },
        UpdateExpression: "SET #st = :st, final_video_url = :url, youtube_id = :yt",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: {
          ":st": "uploaded",
          ":url": finalVideoUrl,
          ":yt": youtubeId,
        },
      })
    );

    await rm(workDir, { recursive: true, force: true });
    console.log(`✅ project ${project.id} finished → ${finalVideoUrl}  youtube:${youtubeId}`);
  } catch (err) {
    console.error(`❌ project ${project.id} failed`, err);
    await db.send(
      new UpdateItemCommand({
        TableName: TABLE,
        Key: { id: project.id },
        UpdateExpression: "SET #st = :st, #err = :err",
        ExpressionAttributeNames: { "#st": "status", "#err": "error" },
        ExpressionAttributeValues: { ":st": "failed", ":err": err.message },
      })
    );
  }
}

/*********************************************************************/
/* 9.  Lambda entry point                                            */
/*********************************************************************/
export const handler = async () => {
  console.log("[Lambda] looking for pending projects…");
  const { Items: projects } = await db.send(
    new ScanCommand({
      TableName: TABLE,
      FilterExpression: "#st = :pending",
      ExpressionAttributeNames: { "#st": "status" },
      ExpressionAttributeValues: { ":pending": "pending" },
    })
  );

  if (!projects || !projects.length) {
    console.log("[Lambda] nothing to do");
    return;
  }

  for (const p of projects) await runProject(p);
};