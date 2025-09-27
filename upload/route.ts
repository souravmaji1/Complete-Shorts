/* Server-side only – Pinata JWT never reaches the browser */
import { NextRequest, NextResponse } from "next/server";

const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1Y2FhYjY5Yi1kZDcyLTRjODQtYWY3NS00N2E0NWJjNjkyZmUiLCJlbWFpbCI6ImRldndlYnRlc3RpbmcxNTFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQ4NWIzNjIxYTUzOGM4MjI5YzVmIiwic2NvcGVkS2V5U2VjcmV0IjoiMThhNWY2OGI4ODcyMDBlMTY1ZWU4ZTRkMjE2MDEzZWE3MjY4N2RkYzViZjE2MzA2ZDE3ZTg4MDg1ZjBiY2QwMCIsImV4cCI6MTc4ODYyMTk0Nn0.DHJwvKIIo2Ih-NktZYx8XZSvTxJvppRgRWxC33TcZYQ';

/* ---------- helpers ---------- */
async function pinFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: { Authorization: `Bearer ${PINATA_JWT}` },
    body: fd,
  });
  if (!res.ok) throw new Error("pinFile failed");
  const json = await res.json();
  return json.IpfsHash;            // returns CID only
}

async function pinJSON(obj: unknown): Promise<string> {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
  if (!res.ok) throw new Error("pinJSON failed");
  const data = await res.json();
  return data.IpfsHash;            // returns CID only
}

/* ---------- POST /api/upload ---------- */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    // 1. upload media
    const mediaCID = await pinFile(file);
    const mediaIPFS = `ipfs://${mediaCID}/${file.name}`;   // pure IPFS format

    // 2. build metadata JSON
    const metadata = {
      name: file.name.replace(/\.[^.]+$/, ""),
      description: "Minted via Next-14 demo",
      image: mediaIPFS,
      animation_url: mediaIPFS,
      attributes: [{ trait_type: "Type", value: file.type.split("/")[0] }],
    };

    // 3. upload JSON
    const metaCID = await pinJSON(metadata);
    const metaIPFS = `ipfs://${metaCID}`;                 // ← store THIS in contract

    // 4. optional: return gateway URL so frontend can preview instantly
    const gatewayURL = `https://gateway.pinata.cloud/ipfs/${metaCID}`;

    return NextResponse.json({ uri: metaIPFS, gatewayURL });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}