
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import cron from 'node-cron';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import { google } from 'googleapis';
import { Readable } from 'stream';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

/* ---------- ENV ---------- */
const SUPABASE_URL      = '';
const SUPABASE_ANON_KEY = ''
const PIAPI_KEY         = '';
const GEMINI_API_KEY    = '';
const PORT              = process.env.PORT || 4000;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !PIAPI_KEY || !GEMINI_API_KEY) {
  console.error('❌ Missing env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('✅ Supabase client created');

/* ---------- YOUTUBE AUTH (hard-coded exactly like your second file) ---------- */
const CLIENT_SECRET = {
  web: {
    client_id:     '',
    client_secret: '',
    redirect_uris: ['http://localhost:3000'],
    token_uri:     'https://oauth2.googleapis.com/token',
    auth_uri:      'https://accounts.google.com/o/oauth2/auth'
  }
};
const REFRESH_TOKEN = '';

const oauth = new google.auth.OAuth2(
  CLIENT_SECRET.web.client_id,
  CLIENT_SECRET.web.client_secret,
  CLIENT_SECRET.web.redirect_uris[0]
);
oauth.setCredentials({ refresh_token: REFRESH_TOKEN });
const yt = google.youtube({ version: 'v3', auth: oauth });

/* ---------- YOUTUBE UPLOAD HELPER ---------- */
async function uploadToYouTube(filePath, meta) {
  const buffer = await fs.readFile(filePath);
  const requestBody = {
    snippet: {
      title: meta.title,
      description: meta.description,
      tags: meta.tags,
    },
    status: { privacyStatus: meta.privacy },
  };
  const res = await yt.videos.insert({
    part: 'snippet,status',
    requestBody,
    media: { body: Readable.from(buffer) },
  });
  return res.data.id;            // YouTube videoId
}

/* ---------- PROXY ROUTES (unchanged) ---------- */
app.post('/api/download', async (req, res) => {
  console.log('[download] URI:', req.body?.uri || req.body?.file?.uri);
  try {
    const uri = req.body?.uri || req.body?.file?.uri;
    if (!uri) return res.status(400).json({ error: 'Missing file uri' });

    const axRes = await axios.get(uri, {
      responseType: 'stream',
      headers: { 'x-goog-api-key': GEMINI_API_KEY },
      maxRedirects: 5,
    });

    res.set({
      'Content-Type': axRes.headers['content-type'] || 'video/mp4',
      'Content-Disposition': 'inline; filename="veo3_video.mp4"',
      'Cache-Control': 'no-store',
    });
    axRes.data.pipe(res);
  } catch (e) {
    console.error('[download] exception', e.message);
    res.status(500).json({ error: 'Download failed' });
  }
});

app.post('/api/proxy-video', multer().any(), async (req, res) => {
  console.log('[proxy-video] prompt:', req.body.prompt, 'manipulatedUrl:', req.body.manipulatedUrl);
  try {
    const manipulatedUrl = req.body.manipulatedUrl;
    const prompt = req.body.prompt;
    const negativePrompt = req.body.negativePrompt;
    const aspectRatio = req.body.aspectRatio;
    if (!manipulatedUrl || !prompt) return res.status(400).json({ error: 'Missing manipulatedUrl or prompt' });

    const imgRes = await fetch(manipulatedUrl, { redirect: 'follow' });
    if (!imgRes.ok) throw new Error('Failed to download manipulated image');
    const imgBlob = await imgRes.blob();

    const fd = new FormData();
    fd.append('prompt', prompt);
    fd.append('model', 'veo-3.0-generate-preview');
    if (negativePrompt) fd.append('negativePrompt', negativePrompt);
    fd.append('aspectRatio', aspectRatio);
    fd.append('imageFile', imgBlob, 'manipulated.jpg');

    const genRes = await fetch(`http://localhost:${PORT}/api/generate-video`, { method: 'POST', body: fd });
    const body = await genRes.json();
    return res.status(genRes.status).json(body);
  } catch (e) {
    console.error('[proxy-video] exception', e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/generate-video', multer().any(), async (req, res) => {
  console.log('[generate-video] prompt:', req.body.prompt);
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const prompt = req.body.prompt;
    const model = req.body.model || 'veo-3.0-generate-preview';
    const negativePrompt = req.body.negativePrompt;
    const aspectRatio = req.body.aspectRatio;

    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    let image;
    const file = req.files?.[0];
    if (file) {
      image = { imageBytes: file.buffer.toString('base64'), mimeType: file.mimetype };
    }

    const op = await ai.models.generateVideos({
      model,
      prompt,
      ...(image ? { image } : {}),
      config: { ...(negativePrompt && { negativePrompt }), ...(aspectRatio && { aspectRatio }) },
    });
    console.log('[generate-video] operation name:', op.name);
    return res.json({ name: op.name });
  } catch (e) {
    console.error('[generate-video] exception', e);
    if (e.status === 429) {
      return res.status(429).json({ error: 'Gemini quota exhausted', details: e.message });
    }
    res.status(500).json({ error: 'Failed to start generation' });
  }
});

app.post('/api/operation', async (req, res) => {
  const name = req.body.name;
  console.log('[operation] poll:', name);
  try {
    if (!name) return res.status(400).json({ error: 'Missing operation name' });

    const url = `https://generativelanguage.googleapis.com/v1beta/${name}?key=${GEMINI_API_KEY}`;
    const upstream = await fetch(url, { method: 'GET' });
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      console.error('[operation] google poll fail', upstream.status, text);
      return res.status(502).json({ error: `Google poll failed`, details: text });
    }
    const payload = await upstream.json();
    console.log('[operation] status:', payload.done ? 'DONE' : 'running');
    return res.json(payload);
  } catch (e) {
    console.error('[operation] exception', e);
    res.status(500).json({ error: 'Poll failed' });
  }
});

/* ---------- UTILS ---------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function downloadViaProxy(uri, outPath) {
  console.log('[downloadViaProxy] uri:', uri, '->', outPath);
  const res = await axios.post(
    `http://localhost:${PORT}/api/download`,
    { uri },
    { responseType: 'stream', headers: { 'x-goog-api-key': GEMINI_API_KEY } }
  );
  const writer = (await fs.open(outPath, 'w')).createWriteStream();
  res.data.pipe(writer);
  return new Promise((res, rej) => {
    writer.on('finish', () => { console.log('[downloadViaProxy] finished'); res(); });
    writer.on('error', rej);
  });
}

class PiAPIClient {
  constructor(apiKey) {
    this.client = axios.create({
      baseURL: 'https://api.piapi.ai/api/v1',
      headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
      timeout: 30000,
    });
  }
  async generateImage(prompt, imageUrls = [], numImages = 1, outputFormat = 'jpeg') {
    console.log('[PiAPI] generateImage prompt:', prompt, 'urls:', imageUrls);
    const { data: createRes } = await this.client.post('/task', {
      model: 'gemini',
      task_type: 'gemini-2.5-flash-image',
      input: { prompt, image_urls: imageUrls, num_images: numImages, output_format: outputFormat },
    });
    if (createRes.code !== 200) throw new Error(createRes.message);
    const taskId = createRes.data.task_id;
    console.log('[PiAPI] taskId:', taskId);
    const result = await this.poll(taskId);
    console.log('[PiAPI] image url:', result.imageUrls[0]);
    return result.imageUrls[0];
  }
  async poll(taskId, max = 40, delay = 2000) {
    for (let i = 0; i < max; i++) {
      const { data } = await this.client.get(`/task/${taskId}`);
      if (data.code !== 200) throw new Error(data.message);
      const status = data.data?.status || data.data?.task_status;
      if (['success', 'completed', 'Completed'].includes(status)) {
        const out = data.data.output || data.data.task_output;
        const urls = out.image_urls || (out.image_url ? [out.image_url] : []);
        if (!urls.length) throw new Error('No image returned');
        return { imageUrls: urls };
      }
      if (['failed', 'Failed'].includes(status)) throw new Error('PiAPI image task failed');
      await sleep(delay);
    }
    throw new Error('PiAPI timeout');
  }
}

async function startVideoGeneration({ prompt, negativePrompt, aspectRatio, manipulatedUrl }) {
  console.log('[startVideoGeneration] prompt:', prompt, 'manipulatedUrl:', manipulatedUrl);
  const tmpManipulated = path.join(__dirname, `.tmp_manipulated_${Date.now()}.jpg`);
  await downloadViaProxy(manipulatedUrl, tmpManipulated);
  const imgBlob = await fs.readFile(tmpManipulated);

  const fd = new FormData();
  fd.append('prompt', prompt);
  fd.append('model', 'veo-3.0-generate-preview');
  if (negativePrompt) fd.append('negativePrompt', negativePrompt);
  fd.append('aspectRatio', aspectRatio);
  fd.append('imageFile', new Blob([imgBlob]), 'manipulated.jpg');

  const genRes = await fetch(`http://localhost:${PORT}/api/generate-video`, { method: 'POST', body: fd });
  const body = await genRes.json();
  if (!genRes.ok) throw new Error(body.error || 'Video start failed');
  console.log('[startVideoGeneration] operation name:', body.name);
  return body.name;
}

async function pollVideoOperation(name) {
  console.log('[pollVideoOperation] name:', name);
  for (let i = 0; i < 200; i++) {
    const { data } = await axios.post(`http://localhost:${PORT}/api/operation`, { name });
    if (data.done) {
      const uri = data.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
      if (!uri) throw new Error('No video uri');
      console.log('[pollVideoOperation] video uri:', uri);
      return uri;
    }
    await sleep(5000);
  }
  throw new Error('Video poll timeout');
}

/* ---------- UPDATED CORE PIPELINE ---------- */
async function runProject(project) {
  console.log('[runProject] START project:', project.id, 'title:', project.title);
  const tmpDir = path.join(__dirname, `.tmp_${project.id}`);
  await fs.mkdir(tmpDir, { recursive: true });

  try {
    const piapi = new PiAPIClient(PIAPI_KEY);
    const sceneVideos = [];

    for (let idx = 0; idx < project.scenes.length; idx++) {
      const s = project.scenes[idx];
      console.log('[runProject] scene:', idx, 'imagePrompt:', s.imagePrompt);

      /* 1.  choose input image ---------------------------------- */
      const sceneImageIdx = project.scene_image_indexes?.[idx] || [];
      const sceneImageUrls = sceneImageIdx
        .map(i => project.raw_image_urls[i])
        .filter(Boolean);
      if (!sceneImageUrls.length) throw new Error(`No valid images for scene ${idx}`);

      let imageUrl;
      if (s.use_manipulated_image) {
        const manipulatedUrl = await piapi.generateImage(
          s.imagePrompt,
          sceneImageUrls,
          1,
          'jpeg'
        );
        imageUrl = manipulatedUrl;
      } else {
        imageUrl = sceneImageUrls[0];
        console.log('[runProject] scene:', idx, 'using raw image, skipping PiAPI');
      }

      /* 2. video generation ------------------------------------- */
      const opName = await startVideoGeneration({
        prompt: s.videoPrompt,
        negativePrompt: s.negativePrompt,
        aspectRatio: s.aspectRatio,
        manipulatedUrl: imageUrl,
      });
      const videoUri = await pollVideoOperation(opName);
      const videoLocal = path.join(tmpDir, `scene_${idx}.mp4`);
      await downloadViaProxy(videoUri, videoLocal);
      sceneVideos.push(videoLocal);
    }

    /* 3. concat */
    const listFile = path.join(tmpDir, 'list.txt');
    await fs.writeFile(listFile, sceneVideos.map((v) => `file '${v}'`).join('\n'));
    console.log('[runProject] concatenating', sceneVideos.length, 'videos');
    const finalOutput = path.join(tmpDir, 'final.mp4');

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(listFile)
        .inputOptions(['-f concat', '-safe 0'])
        .outputOptions(['-c copy'])
        .on('end', () => { console.log('[runProject] concat finished'); resolve(); })
        .on('error', reject)
        .save(finalOutput);
    });

    /* 4. upload to YouTube */
    console.log('[runProject] uploading to YouTube…');
    const youtubeId = await uploadToYouTube(finalOutput, {
      title: project.title || 'Auto generated video',
      description: project.description || 'Auto-uploaded by bot',
      tags: project.tags || [],
      privacy: project.privacy || 'private',
    });
    console.log('[runProject] YouTube videoId:', youtubeId);

    /* 5. update Supabase */
    const { error: upErr } = await supabase
      .from('projects')
      .update({ status: 'uploaded' })
      .eq('id', project.id);
    if (upErr) throw upErr;

    /* 6. cleanup */
    await fs.rm(tmpDir, { recursive: true, force: true });
    console.log(`[runProject] ✅ DONE project:${project.id} youtube:${youtubeId}`);
  } catch (err) {
    console.error(`[runProject] ❌ FAILED project:${project.id}`, err);
    await supabase.from('projects').update({ status: 'failed', error: err.message }).eq('id', project.id);
  }
}

/* ---------- CRON JOB (unchanged) ---------- */
cron.schedule('*/8 * * * *', async () => {
  console.log('[cron] Looking for pending projects…');
  const { data: projects, error } = await supabase.from('projects').select('*').eq('status', 'pending');
  if (error) { console.error('[cron] DB error', error); return; }
  if (!projects.length) { console.log('[cron] Nothing to do'); return; }
  for (const p of projects) await runProject(p);
});

/* ---------- MANUAL ROUTE (unchanged) ---------- */
app.post('/run/:projectId', async (req, res) => {
  const { projectId } = req.params;
  console.log('[manual] run requested for project:', projectId);
  const { data: project, error: pErr } = await supabase.from('projects').select('*').eq('id', projectId).single();
  if (pErr || !project) return res.status(404).json({ error: 'Project not found' });
  if (project.status === 'rendering') return res.json({ msg: 'Already running' });
  await supabase.from('projects').update({ status: 'rendering' }).eq('id', projectId);
  runProject(project).then(() => res.json({ msg: 'Started' }));
});

/* ---------- START ---------- */
app.listen(PORT, () => console.log(`\n🚀 Automation server on ${PORT} – cron + YouTube upload\n`));