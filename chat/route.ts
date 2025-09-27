import { groq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages, UIMessage, stepCountIs } from 'ai';
import { tool } from 'ai';
import { z } from 'zod';
import axios from 'axios';



/* ==================================================================
   GOOGLE-ADS TOOL  –  verbose edition
   ================================================================== */


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

/* ----------  TOOL: create Google Ads campaign (thin proxy) ---------- */
const googleAdsTool = tool({
  description:
    'Create Google Ads campaigns. Only call when the user explicitly asks to create, generate, or make Google Ads, ad campaigns, or advertising campaigns.',
  inputSchema: z.object({
    campaignName: z.string(),
    channelType: z.enum(['SEARCH', 'DISPLAY', 'VIDEO', 'SHOPPING', 'PERFORMANCE_MAX']),
    budgetAmount: z.number(), // dollars-per-day
    startDate: z.string(), // YYYY-MM-DD
    endDate: z.string(),
    headlines: z.array(z.string()).optional(),
    descriptions: z.array(z.string()).optional(),
    finalUrl: z.string().url().optional(),
  }),

  execute: async (payload, { experimental_context }) => {
    const ctx = experimental_context as {
      customerId?: string;
      managerId?: string;
      refreshToken?: string;
    };

    if (!ctx?.customerId) throw new Error('No customerId provided or found in session');
    if (!ctx?.refreshToken) throw new Error('No refreshToken found in session');

    // Build the body expected by /api/create-google-campaign
    const body = {
      customerId: ctx.customerId,
      refreshToken: ctx.refreshToken,
      managerCustomerId: ctx.managerId || undefined,
      campaignDetails: {
        name: payload.campaignName,
        channelType: payload.channelType,
        budgetMicros: Math.round(payload.budgetAmount * 1_000_000),
        startDate: payload.startDate,
        endDate: payload.endDate,
        ...(payload.channelType === 'SEARCH' && {
          adContent: {
            headlines: payload.headlines,
            descriptions: payload.descriptions,
            finalUrl: payload.finalUrl,
          },
        }),
      },
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/createcampaign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Google Ads API call failed');

    // Map the route response back to the shape the chat expects
    return {
      success: true,
      campaign: { resourceName: data.campaign.resourceName, name: payload.campaignName },
      budget: { resourceName: data.budget.resourceName },
      adGroup: data.adGroup ? { resourceName: data.adGroup.resourceName } : null,
      message: data.message,
    };
  },
});

const OBJECTIVE_MAP: Record<string, string> = {
  brand_awareness:  'OUTCOME_AWARENESS',
  awareness:        'OUTCOME_AWARENESS',
  reach:            'OUTCOME_AWARENESS',      // closest
  link_clicks:      'OUTCOME_TRAFFIC',
  traffic:          'OUTCOME_TRAFFIC',
  conversions:      'OUTCOME_SALES',
  sales:            'OUTCOME_SALES',
  leads:            'OUTCOME_LEADS',
  lead_generation:  'OUTCOME_LEADS',
  engagement:       'OUTCOME_ENGAGEMENT',
  app_promotion:    'OUTCOME_APP_PROMOTION',
};

/* ----------  TOOL: create Facebook Ads campaign ---------- */
const facebookAdsTool = tool({
  description:
    'Create Facebook Ads campaigns. Only call when the user explicitly asks to create, generate, or make Facebook Ads, ad campaigns, or advertising campaigns.',
  inputSchema: z.object({
    campaignName: z.string(),
    objective: z.string(),
    budgetAmount: z.number(), // dollars-per-day
    startDate: z.string(), // YYYY-MM-DD
    endDate: z.string(),
    headlines: z.array(z.string()).optional(),
    descriptions: z.array(z.string()).optional(),
    callToAction: z.enum([
      'SHOP_NOW',
      'SIGN_UP',
      'LEARN_MORE',
      'DOWNLOAD',
      'CONTACT_US',
    ]).optional(),
    finalUrl: z.string().url().optional(),
  }),
 execute: async ({ objective, ...rest }, { experimental_context }) => {
  const raw = objective.toLowerCase().replace(/ /g, '_');
  const mapped = OBJECTIVE_MAP[raw];
  if (!mapped) {
    throw new Error(
      `Unknown objective "${objective}". ` +
      `Choose one of: ${Object.keys(OBJECTIVE_MAP).join(', ')}`
    );
  }

  const payload = { ...rest, objective: mapped }; // now guaranteed valid

  const ctx = experimental_context as { adAccountId?: string; accessToken?: string; pageId?: string };
  if (!ctx.adAccountId) throw new Error('No Facebook ad-account ID provided');
  if (!ctx.accessToken) throw new Error('No Facebook access-token provided');

  const body = {
    adAccountId: ctx.adAccountId,
    accessToken: ctx.accessToken,
    campaignDetails: payload,
    pageId: ctx.pageId,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-facebook-campaign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Facebook API call failed');

  return {
    success: true,
    campaign: { id: data.campaignId, name: payload.campaignName },
    adSet:   { id: data.adSetId },
    ad:      data.adId ? { id: data.adId } : null,
    message: data.message,
  };
},
});


/* ----------  TOOL: create YouTube Ads campaign  ---------- */
const youtubeAdsTool = tool({
  description:
    'Create YouTube Ads campaigns. Only call when the user explicitly asks to create, generate, or make YouTube Ads, video campaigns, or video advertising campaigns.',
  inputSchema: z.object({
    campaignName: z.string(),
    budgetAmount: z.number(), // dollars-per-day
    startDate: z.string(), // YYYY-MM-DD
    endDate: z.string(),
    youtubeVideoUrl: z.string().url(), // full YouTube url
    businessName: z.string(), // will be shown in the ad
    headlines: z.array(z.string()).min(3), // at least 3
    longHeadlines: z.array(z.string()).min(1), // at least 1
    descriptions: z.array(z.string()).min(2), // at least 2
    logoImageUrl: z.string().url(), // publicly reachable image used as logo
  }),

  execute: async (payload, { experimental_context }) => {
    const ctx = experimental_context as {
      customerId?: string;
      managerId?: string;
      refreshToken?: string;
    };

    if (!ctx?.customerId) throw new Error('No customerId provided or found in session');
    if (!ctx?.refreshToken) throw new Error('No refreshToken found in session');

    // Build the body expected by /api/createcampaign
    const body = {
      customerId: ctx.customerId,
      refreshToken: ctx.refreshToken,
      managerCustomerId: ctx.managerId || undefined,
      campaignDetails: {
        name: payload.campaignName,
        budgetMicros: Math.round(payload.budgetAmount * 1_000_000),
        startDate: payload.startDate,
        endDate: payload.endDate,
        youtubeVideoUrl: payload.youtubeVideoUrl,
        businessName: payload.businessName,
      },
      adContent: {
        imageUrl: payload.logoImageUrl,
        headlines: payload.headlines,
        longHeadlines: payload.longHeadlines,
        descriptions: payload.descriptions,
      },
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/createyoutubecampaign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'YouTube Ads API call failed');

    return {
      success: true,
      campaign: { resourceName: data.campaignResourceName, name: payload.campaignName },
      budget: { resourceName: data.budgetResourceName },
      adGroup: { resourceName: data.adGroupResourceName },
      ad: { resourceName: data.adResourceName },
      message: data.message,
    };
  },
});

/* ----------  TOOL: create an ad campaign  ---------- */





const tools = { 
  generateImage: imageGenTool,
  generateVideo: videoGenTool,
  generate3DModel: model3dGenTool,
  generateSong: songGenTool,
  createGoogleAdsCampaign: googleAdsTool, // Add this line
  createFacebookAdsCampaign: facebookAdsTool, // <-- 
    createYouTubeAdsCampaign: youtubeAdsTool, // <-- NEW
  faceSwap: faceSwapTool, // <-- NEW
};

export const maxDuration = 300; // Increase for longer generations

export async function POST(req: Request) {
   

  
  const { messages, id, googleAds, facebookAds }: {
    messages: UIMessage[];
    id: string;
    googleAds: any;
    facebookAds: any;
  } = await req.json();

  console.log(googleAds,facebookAds)


  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
   // In your POST function, update the system prompt:
system: `You are a helpful assistant. 
Only invoke the "generateImage" tool when the user explicitly asks to create/draw/generate/paint an image.
Only invoke the "generateVideo" tool when the user explicitly asks to create/generate/make a video or animation.
Only invoke the "generate3DModel" tool when the user explicitly asks to create/generate/make a 3D model, 3D object, or 3D asset.
Only invoke the "generateSong" tool when the user explicitly asks to create/generate/make music, song, or audio.
Only invoke the "faceSwap" tool when the user explicitly asks to faceswap / face-swap or says something like "put this face on that person".
Only invoke the "createGoogleAdsCampaign" tool when the user explicitly asks to create, generate, or make Google Ads, ad campaigns, or advertising campaigns.

For the "faceSwap" tool:
- The **first** uploaded image is treated as the **target** (the picture whose face will be replaced).
- The **second** uploaded image is treated as the **swap** (the face to insert).
- If fewer than two images are provided, ask the user to upload exactly two images before you call the tool.


For the "createGoogleAdsCampaign" tool:
- Required parameters: campaignName, channelType, budgetAmount, startDate, endDate
- For SEARCH campaigns, also provide headlines, descriptions, and finalUrl
- Dates must be in YYYY-MM-DD format
- Budget amount is in dollars per day
- customerId and managerCustomerId are already provided in context – **do NOT ask the user for them**

For the "createFacebookAdsCampaign" tool:                                                                                 // <-- NEW block
- Required parameters: campaignName, objective, budgetAmount, startDate, endDate
- Optional: headlines, descriptions, finalUrl, callToAction
- Dates must be in YYYY-MM-DD format
- Budget amount is in dollars per day
- adAccountId, accessToken and pageId are already provided in context – **do NOT ask the user for them**

Only invoke the "createYouTubeAdsCampaign" tool when the user explicitly asks to create, generate, or make YouTube Ads, video campaigns, or video advertising campaigns.
- Required parameters: campaignName, budgetAmount, startDate, endDate, youtubeVideoUrl, businessName, headlines, longHeadlines, descriptions, logoImageUrl
- Dates must be in YYYY-MM-DD format
- Budget amount is in dollars per day
- customerId and managerCustomerId are already provided in context – **do NOT ask the user for them**

Otherwise just reply conversationally.

If the user provides an image, you can use it as a reference for generating a new image by invoking "generateImage" tool or answering questions about it.
`,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools,
    experimental_context: { ...googleAds, ...facebookAds },
  });

  return result.toUIMessageStreamResponse();
}