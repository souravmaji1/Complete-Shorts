// app/api/proxy-video/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const fd  = await req.formData();
    const manipulatedUrl = fd.get('manipulatedUrl') as string;
    const prompt         = fd.get('prompt') as string;
    const negativePrompt = fd.get('negativePrompt') as string;
    const aspectRatio    = fd.get('aspectRatio') as string;

    /* ---- download the image ---- */
    const imgRes = await fetch(manipulatedUrl, { redirect: 'follow' });
    if (!imgRes.ok) throw new Error('Failed to download manipulated image');
    const imgBlob = await imgRes.blob();

    /* ---- build new form-data for the real endpoint ---- */
    const fwd = new FormData();
    fwd.append('prompt', prompt);
    fwd.append('model', 'veo-3.0-generate-preview');
    if (negativePrompt) fwd.append('negativePrompt', negativePrompt);
    fwd.append('aspectRatio', aspectRatio);
    fwd.append('imageFile', imgBlob, 'manipulated.jpg');

    /* ---- call the existing handler ---- */
    const genRes = await fetch(`http://localhost:3000/api/generate-video`, {
      method: 'POST',
      body: fwd,
    });

    /* ---- return its body unchanged ---- */
    return new Response(genRes.body, { status: genRes.status, statusText: genRes.statusText });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}