
// app/api/operation/route.ts
import { NextResponse } from "next/server";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = body.name as string | undefined;

    if (!name) {
      return NextResponse.json({ error: "Missing operation name" }, { status: 400 });
    }

    // --- manual REST call ---
    const url = `https://generativelanguage.googleapis.com/v1beta/${name}?key=${process.env.GEMINI_API_KEY}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Google poll failed: ${res.status} ${res.statusText}`, details: text },
        { status: 502 }
      );
    }
    const payload = await res.json();

    // shape the SDK would have returned
    return NextResponse.json(payload);
  } catch (err) {
    console.error("Error polling operation:", err);
    return NextResponse.json({ error: "Failed to poll operation" }, { status: 500 });
  }
}