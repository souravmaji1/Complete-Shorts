import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PiAPIClient } from './piapi-client';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
  process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!
);

// Initialize PiAPI client
const piApiClient = new PiAPIClient(process.env.NEXT_PUBLIC_PAPI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const prompt = formData.get('prompt') as string;
    const images = formData.getAll('images') as File[];
    const sceneId = formData.get('sceneId') as string;

    if (!prompt || images.length === 0) {
      return NextResponse.json(
        { error: 'Prompt and at least one image are required' },
        { status: 400 }
      );
    }

    // Upload images to Supabase and get URLs
    const imageUrls = await uploadImagesToSupabase(images, sceneId);

    // Generate image using PiAPI
    const result = await piApiClient.generateImage(
      prompt,
      imageUrls,
      1, // numImages
      'png' // outputFormat
    );

    if (!result.success) {
      console.error('PiAPI generation failed:', result);
      return NextResponse.json(
        { 
          error: result.error || 'Image generation failed',
          details: result.details,
          success: false 
        },
        { status: 500 }
      );
    }

    // Format the response to match frontend expectations
    const formattedResults = result.imageUrls.map((imageUrl: string, index: number) => ({
      type: 'image',
      data: imageUrl,
      mimeType: 'image/png'
    }));

    return NextResponse.json({ 
      success: true,
      results: formattedResults, 
      sceneId,
      taskId: result.taskId
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', success: false },
      { status: 500 }
    );
  }
}

async function uploadImagesToSupabase(images: File[], sceneId: string): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (const image of images) {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = image.name.split('.').pop() || 'png';
      const fileName = `scene-${sceneId}-${timestamp}.${fileExtension}`;
      const filePath = `scenes/${fileName}`;

      // Convert File to Buffer
      const buffer = Buffer.from(await image.arrayBuffer());

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('fgfg') // Your bucket name
        .upload(filePath, buffer, {
          contentType: image.type,
          upsert: true
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('fgfg')
        .getPublicUrl(filePath);

      if (urlData.publicUrl) {
        uploadedUrls.push(urlData.publicUrl);
      } else {
        throw new Error('Failed to get public URL for uploaded image');
      }

    } catch (error) {
      console.error('Error uploading image to Supabase:', error);
      throw error;
    }
  }

  return uploadedUrls;
}