import { NextRequest, NextResponse } from 'next/server';

const REMOTE =
  'https://img.theapi.app/temp/cac22887-b6d7-422d-955c-fd97732ef893.glb';

export async function GET() {
  const res = await fetch(REMOTE, { cache: 'force-cache' });
  const blob = await res.arrayBuffer();

  return new NextResponse(blob, {
    headers: {
      'Content-Type': 'model/gltf-binary',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}