import { groq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages, UIMessage, stepCountIs } from 'ai';
import { tool } from 'ai';
import { z } from 'zod';
import axios from 'axios';

export class PiAPIClient {
  private client = axios.create({
    baseURL: 'https://api.piapi.ai/api/v1',
    headers: {
      'X-API-Key': process.env.NEXT_PUBLIC_PIAPI_API_KEY!,
      'Content-Type': 'application/json',
    },
    timeout: 30_000,
  });

  async generateImage(
    prompt: string,
    imageUrls: string[] = [],
    numImages = 1,
    outputFormat: 'jpeg' | 'png' = 'jpeg'
  ) {
    const { data } = await this.client.post('/task', {
      model: 'gemini',
      task_type: 'gemini-2.5-flash-image',
      input: { prompt, image_urls: imageUrls, num_images: numImages, output_format: outputFormat },
    });

    if (data.code !== 200) throw new Error(data.message);

    const taskId = data.data.task_id;
    let status = '';
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 2_000));
      const st = (await this.client.get(`/task/${taskId}`)).data;
      status = st.data.status || st.data.task_status;
      if (status === 'completed' || status === 'success') {
        const urls =
          st.data.output?.image_urls ||
          (st.data.output?.image_url ? [st.data.output.image_url] : []);
        return { success: true, imageUrls: urls };
      }
      if (status === 'failed') throw new Error(st.data.error?.message || 'Generation failed');
    }
    throw new Error('Timeout');
  }

  async generateVideo(prompt: string) {
    const { data } = await this.client.post('/task', {
      model: 'hailuo',
      task_type: 'video_generation',
      input: {
        model: 't2v-01',
        prompt,
        expand_prompt: true
      },
      config: {
        service_mode: 'public'
      }
    });

    if (data.code !== 200) throw new Error(data.message);

    const taskId = data.data.task_id;
    let status = '';
    
    // Wait longer for video generation (up to 3 minutes)
    for (let i = 0; i < 90; i++) {
      await new Promise(r => setTimeout(r, 2_000));
      const st = (await this.client.get(`/task/${taskId}`)).data;
      status = st.data.status || st.data.task_status;
      
      if (status === 'completed' || status === 'success') {
        return {
          success: true,
          videoUrl: st.data.output?.video_url,
          coverUrl: st.data.output?.cover_url,
          description: st.data.output?.desc
        };
      }
      if (status === 'failed') throw new Error(st.data.error?.message || 'Video generation failed');
    }
    throw new Error('Timeout waiting for video generation');
  }

  async generate3DModel(prompt: string, seed = 42) {
    const { data } = await this.client.post('/task', {
      model: 'Qubico/trellis',
      task_type: 'text-to-3d',
      input: {
        prompt,
        seed,
        ss_sampling_steps: 50,
        slat_sampling_steps: 50,
        ss_guidance_strength: 7.5,
        slat_guidance_strength: 3,
      },
    });

    if (data.code !== 200) throw new Error(data.message);

    const taskId = data.data.task_id;
    let status = '';
    
    // Wait for 3D model generation (up to 5 minutes)
    for (let i = 0; i < 150; i++) {
      await new Promise(r => setTimeout(r, 2_000));
      const st = (await this.client.get(`/task/${taskId}`)).data;
      status = st.data.status || st.data.task_status;
      
      if (status === 'completed' || status === 'success') {
        return {
          success: true,
          modelFile: st.data.output?.model_file,
          combinedVideo: st.data.output?.combined_video,
          taskId
        };
      }
      if (status === 'failed') throw new Error(st.data.error?.message || '3D model generation failed');
    }
    throw new Error('Timeout waiting for 3D model generation');
  }

// In the generateSong method, add debugging:
async generateSong(prompt: string, lyricsType: 'generate' | 'user' | 'instrumental' = 'generate', lyrics?: string) {
  console.log('Starting song generation with prompt:', prompt);
  
  const { data } = await this.client.post('/task', {
    model: 'music-u',
    task_type: 'generate_music',
    input: {
      prompt,
      lyrics_type: lyricsType,
      ...(lyrics && { lyrics }),
      gpt_description_prompt: prompt,
    },
  });

  if (data.code !== 200) throw new Error(data.message);

  const taskId = data.data.task_id;
  let status = '';
  
  // Wait for song generation (up to 3 minutes)
  for (let i = 0; i < 90; i++) {
    await new Promise(r => setTimeout(r, 2_000));
    const st = (await this.client.get(`/task/${taskId}`)).data;
    status = st.data.status || st.data.task_status;
    
    if (status === 'completed' || status === 'success') {
      console.log('Song generation completed successfully:', JSON.stringify(st.data, null, 2));
      
      // Extract audio URLs from the songs array
      const songs = st.data.output?.songs;
      let audioUrl = '';
      let imageUrl = '';
      let title = 'Generated Song';

      if (songs && Array.isArray(songs) && songs.length > 0) {
        // Get the first song
        const song = songs[0];
        audioUrl = song.song_path || ''; // Use song_path instead of audio_url
        imageUrl = song.image_path || ''; // Use image_path instead of image_url
        title = song.title || 'Generated Song';
        
        console.log('Found song:', { audioUrl, imageUrl, title });
      }

      return {
        success: true,
        audioUrl,
        imageUrl,
        title,
        taskId
      };
    }
    if (status === 'failed') {
      console.error('Song generation failed:', st.data.error);
      throw new Error(st.data.error?.message || 'Song generation failed');
    }
  }
  throw new Error('Timeout waiting for song generation');
}

}


/* ----------  TOOL: generate an image  ---------- */
const imageGenTool = tool({
  description:
    'Generate or edit an AI image. Call only when the user explicitly asks to create, draw, generate, paint or edit an image.',
  inputSchema: z.object({
    prompt: z.string(),
    imageUrls: z.array(z.string().url()).optional(),
  }),
  execute: async ({ prompt, imageUrls }, { messages }) => {
    // <-- messages is the full converted array
    const lastUser = messages
      .slice()
      .reverse()
      .find((m) => m.role === 'user');

    const urlsFromAttach =
      lastUser?.experimental_attachments?.map((a: any) => a.url) ?? [];

    // merge with what the model may have already put
    const finalUrls = [...(imageUrls ?? []), ...urlsFromAttach];

    const client = new PiAPIClient();
    const { success, imageUrls: outUrls } = await client.generateImage(
      prompt,
      finalUrls,
      1,
      'jpeg'
    );
    if (!success) throw new Error('Image generation failed');
    return { imageUrl: outUrls[0] };
  },
});

/* ----------  TOOL: face-swap  ---------- */
const faceSwapTool = tool({
  description:
    'Swap the face in the first image (target) with the face in the second image (swap). ' +
    'Only invoke when the user explicitly asks to faceswap or face-swap.',
  inputSchema: z.object({
    targetUrl: z.string().url(), // publicly reachable
    swapUrl: z.string().url(),
  }),
  execute: async ({ targetUrl, swapUrl }) => {
    const { data } = await axios.post(
      'https://api.piapi.ai/api/v1/task',
      {
        model: 'Qubico/image-toolkit',
        task_type: 'face-swap',
        input: { target_image: targetUrl, swap_image: swapUrl },
      },
      {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_PIAPI_API_KEY!,
          'Content-Type': 'application/json',
        },
      }
    );

    if (data.code !== 200) throw new Error(data.message);

    const taskId = data.data.task_id;
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 2_000));
      const st = (
        await axios.get(`https://api.piapi.ai/api/v1/task/${taskId}`, {
          headers: { 'x-api-key': process.env.NEXT_PUBLIC_PIAPI_API_KEY! },
        })
      ).data;

      const status = st.data.status;
      if (status === 'completed' || status === 'success')
        return { imageUrl: st.data.output.image_url };
      if (status === 'failed') throw new Error(st.data.error?.message || 'Swap failed');
    }
    throw new Error('Swap timeout');
  },
});

/* ----------  TOOL: generate a video  ---------- */
const videoGenTool = tool({
  description: 'Generate an AI video. Only call when the user explicitly asks to create, generate, or make a video.',
  inputSchema: z.object({
    prompt: z.string().describe('Detailed prompt describing the video scene and action'),
  }),
  execute: async ({ prompt }) => {
    const client = new PiAPIClient();
    const result = await client.generateVideo(prompt);
    
    if (!result.success) throw new Error('Video generation failed');
    
    return {
      videoUrl: result.videoUrl,
      coverUrl: result.coverUrl,
      description: result.description
    };
  },
});

/* ----------  TOOL: generate a 3D model  ---------- */
const model3dGenTool = tool({
  description: 'Generate a 3D model. Only call when the user explicitly asks to create, generate, or make a 3D model, 3D object, or 3D asset.',
  inputSchema: z.object({
    prompt: z.string().describe('Detailed prompt describing the 3D model to generate'),
  }),
  execute: async ({ prompt }) => {
    const client = new PiAPIClient();
    const result = await client.generate3DModel(prompt);
    
    if (!result.success) throw new Error('3D model generation failed');
    
    return {
      modelFileUrl: result.modelFile,
      videoUrl: result.combinedVideo,
      taskId: result.taskId
    };
  },
});

/* ----------  TOOL: generate a song  ---------- */
const songGenTool = tool({
  description: 'Generate a song or music. Only call when the user explicitly asks to create, generate, or make music, song, or audio.',
  inputSchema: z.object({
    prompt: z.string().describe('Detailed prompt describing the song style, genre, mood, or theme'),
  }),
  execute: async ({ prompt }) => {
    const client = new PiAPIClient();
    const result = await client.generateSong(prompt);
    
    if (!result.success) throw new Error('Song generation failed');
    
    return {
      audioUrl: result.audioUrl,
      videoUrl: result.videoUrl,
      imageUrl: result.imageUrl,
      title: result.title,
      taskId: result.taskId
    };
  },
});


/* ----------  TOOL: create an ad campaign  ---------- */

const adCampTool = tool({
  description: 'Create an advertising campaign on IntelliVerse-X. Only call when the user explicitly asks to create, set up, or launch an ad campaign.',
  inputSchema: z.object({
    title: z.string().describe('Campaign title'),
    description: z.string().describe('Campaign description'),
  }),
  execute: async ({ title, description }) => {
    try {
      const CLIENT_ID = '54clc0uaqvr1944qvkas63o0rb';
      const CLIENT_SECRET = '1eb7ooua6ft832nh8dpmi37mos4juqq27svaqvmkt5grc3b7e377';


      // First get the bearer token
      const tokenResponse = await axios.post(
        'https://api.intelli-verse-x.ai/api/admin/oauth/token',
        {
          client_id: '54clc0uaqvr1944qvkas63o0rb',
          client_secret: '1eb7ooua6ft832nh8dpmi37mos4juqq27svaqvmkt5grc3b7e377'
        },
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      const bearerToken = tokenResponse.data.access_token;

      // Hardcoded values for the campaign
      const campaignData = {
        title,
        description,
        machineId: "24", // Hardcoded machine ID
        startDate: "2025-09-18T00:00:00.000Z", // Hardcoded start date
        endDate: "2025-09-26T23:59:59.000Z", // Hardcoded end date
        amount: 9000, // Hardcoded budget amount
        media: [
          {
            mediaType: "video", // Hardcoded media type
            mediaUrl: "https://intelli-verse-x-media.s3.us-east-1.amazonaws.com/ads-video/64a67c18-cbd1-4f3a-aa38-703cf58e98b6-6821-196310296_small.mp4", // Hardcoded media URL
            metadata: {
              size: 696690, // Hardcoded media size
              type: "video/mp4" // Hardcoded media format
            }
          }
        ]
      };

      // Create the campaign
      const response = await axios.post(
        'https://api.intelli-verse-x.ai/api/user/ad-management',
        campaignData,
        {
          headers: {
            'Authorization': `Bearer eyJraWQiOiJ1Wm10SndZWFV0c1l1RGdXMmdmR0w4b3FJZ1RudlwvMXN3ekl6V3YraXE3MD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0NDk4ZjRkOC1hMGYxLTcwZWYtYjI5MC0xNTU0MjgyNWRhMDciLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9NNXF4TjhiNzQiLCJjbGllbnRfaWQiOiI0Y2ZjNjZvcWcxM2MzOWE0dXYzbWE3czcyMyIsIm9yaWdpbl9qdGkiOiJkYWJmYmVjMC0yM2JlLTRhNWQtYjY1OS1iOWNjNzZhNTFkNjEiLCJldmVudF9pZCI6ImIwNzI1Y2Y3LWUxN2EtNDJlMS05ZTliLWMyYzFjYWY4NDFiOCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NTczMjU2NDIsImV4cCI6MTc1NzMzODc0MiwiaWF0IjoxNzU3MzM1MTQyLCJqdGkiOiIxNGIyNmRkNy1jMmUzLTQ4NjUtYWI5Mi0wODA3MGQxY2RmYmQiLCJ1c2VybmFtZSI6IjQ0OThmNGQ4LWEwZjEtNzBlZi1iMjkwLTE1NTQyODI1ZGEwNyJ9.r7nX0e5kleBKr_WcgtSj4XddG2fZvw92k1qLYdh8lQm41xJvHKRavGtfkGFSPwJgGXl24KRot89CtRiOT22MRBn7prYK985rmowsXTmvZ5TxgRlj-pLkT3wiNV3SUKHWQxjutsbdDIG05ZHKVX_mDCPsKFw6NTDDMHVdHqs5mHCvYwz9G4NBZn5aY-YfDyp09VaPWvFnDiSZmlWV6Fg5TFTcyNO1mgD58bvoSLCPOihDrTHq-tak8P7ycikVejqbCRTl58dk76b_ByzR6itokQiEFrCTxTWzkR3lUb_ZTSlQVwDUkgxc_IXrdJxl1_DDF9Rq6gq2MDsn67OYmH4Xjg`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }
      );

      return {
        success: true,
        campaignId: response.data.id,
        message: 'Campaign created successfully'
      };
    } catch (error) {
      console.error('Error creating campaign:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create campaign');
    }
  },
});

const adCampaignTool = tool({
  description:
    'Create an advertising campaign on IntelliVerse-X. ' +
    'The user only needs to supply a title and description. ' +
    'If the user has uploaded a video you may pass its URL as videoUrl, otherwise omit it. ' +
    'Hard-code budget=9000 USD, and use sensible default dates (7-day window starting today) ' +
    'and a default machineId ("24") if the user does not provide his own.',
  inputSchema: z.object({
    title: z.string(),
    description: z.string(),
    machineId: z.string().optional(),
    startDate: z.string().optional(), // ISO-string
    endDate: z.string().optional(),
    budget: z.number().optional(), // we’ll hard-code 9000
    videoUrl: z.string().url().optional(),
  }),
  execute: async ({ title, description, machineId, startDate, endDate, budget, videoUrl }) => {
    try {
      /* ----------  TOKEN  ---------- */
      const tokenRes = await axios.post(
        'https://api.intelli-verse-x.ai/api/admin/oauth/token',
        {
          client_id: '54clc0uaqvr1944qvkas63o0rb',
          client_secret: '1eb7ooua6ft832nh8dpmi37mos4juqq27svaqvmkt5grc3b7e377',
        },
        { headers: { accept: 'application/json', 'Content-Type': 'application/json' } }
      );
      const bearerToken = tokenRes.data.access_token;

      /* ----------  DEFAULT VALUES  ---------- */
      const now = new Date();
      const defaultStart = new Date(now);
      const defaultEnd = new Date(now);
      defaultEnd.setDate(defaultEnd.getDate() + 7);

      const finalBudget = budget ?? 9000;
      const finalMachine = machineId ?? '24';
      const finalStart = startDate ?? defaultStart.toISOString();
      const finalEnd = endDate ?? defaultEnd.toISOString();

      /* ----------  MEDIA  ---------- */
      const media: any[] = [];
      if (videoUrl) {
        media.push({
          mediaType: 'video',
          mediaUrl: videoUrl ?? 'https://intelli-verse-x-media.s3.us-east-1.amazonaws.com/ads-video/64a67c18-cbd1-4f3a-aa38-703cf58e98b6-6821-196310296_small.mp4',
          metadata: { size: 696690, type: 'video/mp4' },
        });
      }

      /* ----------  CREATE  ---------- */
      const campaignData = {
        title,
        description,
        machineId: finalMachine,
        startDate: finalStart,
        endDate: finalEnd,
        amount: finalBudget,
        media,
      };

      const res = await axios.post(
        'https://api.intelli-verse-x.ai/api/user/ad-management',
        campaignData,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        }
      );

      return { success: true, campaignId: res.data.id, message: 'Campaign created' };
    } catch (e: any) {
      console.error(e.response?.data || e.message);
      throw new Error(e.response?.data?.message || 'Campaign creation failed');
    }
  },
});

const tools = { 
  generateImage: imageGenTool,
  generateVideo: videoGenTool,
  generate3DModel: model3dGenTool,
  generateSong: songGenTool,
  createAdCampaign: adCampaignTool,
  faceSwap: faceSwapTool, // <-- NEW
};

export const maxDuration = 300; // Increase for longer generations

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: `You are a helpful assistant. 
    Only invoke the "generateImage" tool when the user explicitly asks to create/draw/generate/paint an image.
    Only invoke the "generateVideo" tool when the user explicitly asks to create/generate/make a video or animation.
    Only invoke the "generate3DModel" tool when the user explicitly asks to create/generate/make a 3D model, 3D object, or 3D asset.
    Only invoke the "generateSong" tool when the user explicitly asks to create/generate/make music, song, or audio.
    Only invoke the "faceSwap" tool when the user explicitly asks to faceswap / face-swap or says something like “put this face on that person”.

    For the "faceSwap" tool:
    - The **first** uploaded image is treated as the **target** (the picture whose face will be replaced).
    - The **second** uploaded image is treated as the **swap** (the face to insert).
    - If fewer than two images are provided, ask the user to upload exactly two images before you call the tool.

    For the "createAdCampaign" tool:
    - Only invoke when the user explicitly asks to create/set up/launch an advertising campaign
    - Before creating the campaign, you MUST ask the user for:
      1. A title for the campaign
      2. A description of the campaign
    - All other campaign details (machine ID, dates, budget, media) will be automatically filled also if user want
    to add this details they can add it as well
    
    Otherwise just reply conversationally.
    
    If the user provides an image, you can use it as a reference for generating a new image by invoking "generateImage" tool or answering questions about it.
    `,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools,
  });

  return result.toUIMessageStreamResponse();
}