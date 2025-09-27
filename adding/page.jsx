'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef } from 'react';

import ModelViewer from '../../components/modelviewer';
import { getContract } from '../../lib/nftContract';
import { BrowserProvider } from 'ethers';
import {
  Send,
  Loader2,
  Bookmark,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Image as ImageIcon,
  Video,
  Box,
  Music,
  Paperclip,
  X
} from 'lucide-react';
import { ScrollArea } from '../../components/ui/scroll-area';
import { createClient } from '@supabase/supabase-js';
import { SaveIcon, SavedGallery } from '../../components/SaveIcon';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
  process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!
);

/* ----------  TYPES  ---------- */
type MintStatus = 'idle' | 'minting' | 'minted' | 'error';
type MintingStates = Record<string, { status: MintStatus; txHash?: string; error?: string }>;

/* ----------  METADATA HELPER  ---------- */
const buildMetadata = (type: string, data: any) => {
  const base: any = {
    name: `${type} Creation`,
    description: `AI-generated ${type}`,
    attributes: [{ trait_type: 'Type', value: type }],
  };
  if (type === 'image') base.image = data.imageUrl;
  if (type === 'video') {
    base.animation_url = data.videoUrl;
    base.image = data.coverUrl || '';
  }
  if (type === '3dmodel') {
    base.animation_url = data.modelFileUrl;
    base.image = data.videoUrl || '';
  }
  if (type === 'song') {
    base.animation_url = data.audioUrl;
    base.image = data.imageUrl || '';
    if (data.title) base.name = data.title;
  }
  return base;
};

/* ----------  HELPER TO EXTRACT IMAGE URL  ---------- */
const extractImageUrl = (text: string): { cleanText: string; imageUrl: string | null } => {
  const imageUrlMatch = text.match(/\(Uploaded image: (.+?)\)/);
  if (imageUrlMatch) {
    const imageUrl = imageUrlMatch[1];
    const cleanText = text.replace(/\(Uploaded image: .+?\)/, '').trim();
    return { cleanText, imageUrl };
  }
  return { cleanText: text, imageUrl: null };
};

/* ----------  MAIN PAGE  ---------- */
export default function Main() {
  const [input, setInput] = useState('');
// NEW
const [files, setFiles] = useState<File[]>([]);
const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [mintingStates, setMintingStates] = useState<MintingStates>({});
  const [started, setStarted] = useState(false);

  const { messages, sendMessage, isLoading } = useChat({
    api: '/api/chat', // your chat endpoint
    onFinish: () => { if (!started) setStarted(true); },
  });

  const [openSaved, setOpenSaved] = useState(false);



  /* ----------  FILE HANDLING  ---------- */
  const onFilfffePick = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newFiles = Array.from(e.target.files || []);
  if (newFiles.length + files.length > 2) {
    alert('You can upload max 2 images for face-swap.');
    return;
  }
  setFiles((prev) => [...prev, ...newFiles]);
  setPreviews((prev) => [
    ...prev,
    ...newFiles.map((f) => URL.createObjectURL(f)),
  ]);
};

const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newFiles = Array.from(e.target.files || []);
  if (files.length + newFiles.length > 2) {
    alert('Max 2 files (images or videos).');
    return;
  }
  setFiles((prev) => [...prev, ...newFiles]);
  setPreviews((prev) => [
    ...prev,
    ...newFiles.map((f) => URL.createObjectURL(f)),
  ]);
};

 const removeFile = (idx: number) => {
  setFiles((prev) => prev.filter((_, i) => i !== idx));
  setPreviews((prev) => prev.filter((_, i) => i !== idx));
  if (fileRef.current) fileRef.current.value = '';
};

  /* ----------  SUPABASE UPLOAD  ---------- */
 

  /* ----------  SEND MESSAGE  ---------- */
 const handleSend = async () => {
  if (!input.trim() && files.length === 0) return;

  let textToSend = input.trim();

  if (files.length > 0) {
    setUploading(true);
    const urls = await Promise.all(
      files.map(async (f) => {
        const fileName = `${Date.now()}-${f.name}`;
        const { data, error } = await supabase.storage
          .from('fgfg')
          .upload(fileName, f, { upsert: false });
        if (error) throw error;
        const { data: publicData } = supabase.storage
          .from('fgfg')
          .getPublicUrl(fileName);
        return publicData.publicUrl;
      })
    );
    // inject both URLs so the model sees them
    textToSend = `${input.trim()}\n\n(Uploaded image: ${urls[0]})\n(Uploaded image: ${urls[1]})`;
    setUploading(false);
    setFiles([]);
    setPreviews([]);
    if (fileRef.current) fileRef.current.value = '';
  }

  sendMessage({ text: textToSend });
  setInput('');
};
  /* ----------  MINTING  ---------- */
  const mintContent = async (
    contentType: 'image' | 'video' | '3dmodel' | 'song',
    contentData: any,
    partIndex: number,
    messageId: string
  ) => {
    const key = `${messageId}-${partIndex}`;
    setMintingStates((p) => ({ ...p, [key]: { status: 'minting' } }));
    try {
      const metadata = buildMetadata(contentType, contentData);
      const res = await fetch('/api/uploadMetadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata),
      });
      if (!res.ok) throw new Error('Upload failed');
      const { uri } = await res.json();

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nft = getContract(signer);
      const tx = await nft.mint(uri);
      await tx.wait();

      setMintingStates((p) => ({ ...p, [key]: { status: 'minted', txHash: tx.hash } }));
    } catch (e: any) {
      setMintingStates((p) => ({ ...p, [key]: { status: 'error', error: e.message } }));
    }
  };

  /* ----------  RENDER TOOL PART  ---------- */
  const renderToolPart = (part: any, i: number, messageId: string) => {
    const key = `${messageId}-${i}`;
    const st = mintingStates[key] ?? { status: 'idle' };

    /* ----- IMAGE ----- */
    if (part.type === 'tool-generateImage') {
      if (part.state === 'input-available')
        return (
          <div className="mt-4 bg-gray-900/60 border border-gray-800/40 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 size={16} className="animate-spin" />
              <ImageIcon size={16} />
              <span className="text-sm font-medium">Generating image…</span>
            </div>
          </div>
        );
      if (part.state === 'output-available')
        return (
          <div className="mt-4 bg-gray-950/95 border border-gray-800/40 rounded-2xl p-4 backdrop-blur-xl shadow-lg">
            <img src={part.output.imageUrl} alt="" className="w-full rounded-xl border border-gray-700/30 shadow-lg" />
           


<div className="absolute top-3 right-3">
  <SaveIcon
    url={part.output.imageUrl}
    type="image"
    meta={part.output}
  />
</div>
            {st.status === 'idle' && (
              <button
                onClick={() => mintContent('image', part.output, i, messageId)}
                className="w-full mt-3 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 py-2 px-4 rounded-xl text-sm font-medium hover:from-gray-500 hover:to-gray-600 transition-all"
              >
                Mint as NFT
              </button>
            )}
            {st.status === 'minting' && (
              <div className="flex items-center justify-center gap-2 text-gray-400 py-2">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Minting…</span>
              </div>
            )}
            {st.status === 'minted' && (
              <div className="bg-green-950/30 border border-green-500/20 rounded-xl p-3 mt-2">
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle size={16} />
                  <span className="font-medium">NFT Minted!</span>
                </div>
                <a
                  href={`https://etherscan.io/tx/${st.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-green-300 hover:text-green-200 mt-1"
                >
                  <ExternalLink size={12} />
                  <span>View transaction</span>
                </a>
              </div>
            )}
            {st.status === 'error' && (
              <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-3 text-sm text-red-400 mt-2">
                <span>Minting failed: {st.error}</span>
              </div>
            )}
          </div>
        );
      if (part.state === 'output-error')
        return (
          <div className="mt-4 bg-red-950/30 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
            <span>Error: {part.errorText}</span>
          </div>
        );
      return null;
    }

    /* ----- FACE-SWAP ----- */
if (part.type === 'tool-faceSwap') {
  if (part.state === 'input-available')
    return (
      <div className="mt-4 bg-gray-900/60 border border-gray-800/40 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          <Sparkles size={16} />
          <span className="text-sm font-medium">Swapping faces…</span>
        </div>
      </div>
    );
  if (part.state === 'output-available')
    return (
      <div className="mt-4 bg-gray-950/95 border border-gray-800/40 rounded-2xl p-4 backdrop-blur-xl shadow-lg">
        <img
          src={part.output.imageUrl}
          alt="face-swapped"
          className="w-full rounded-xl border border-gray-700/30 shadow-lg"
        />
        <div className="absolute top-3 right-3">
  <SaveIcon url={part.output.imageUrl} type="image" meta={part.output} />
</div>
        {st.status === 'idle' && (
          <button
            onClick={() => mintContent('image', part.output, i, messageId)}
            className="w-full mt-3 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 py-2 px-4 rounded-xl text-sm font-medium hover:from-gray-500 hover:to-gray-600 transition-all"
          >
            Mint as NFT
          </button>
        )}
        {/* …rest of minting states identical to generateImage… */}
      </div>
    );
  if (part.state === 'output-error')
    return (
      <div className="mt-4 bg-red-950/30 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
        <span>Face-swap error: {part.errorText}</span>
      </div>
    );
  return null;
}

    /* ----- VIDEO ----- */
    if (part.type === 'tool-generateVideo') {
      if (part.state === 'input-available')
        return (
          <div className="mt-4 bg-gray-900/60 border border-gray-800/40 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 size={16} className="animate-spin" />
              <Video size={16} />
              <span className="text-sm font-medium">Generating video…</span>
            </div>
          </div>
        );
      if (part.state === 'output-available')
        return (
          <div className="mt-4 bg-gray-950/95 border border-gray-800/40 rounded-2xl p-4 backdrop-blur-xl shadow-lg">
            <p className="text-sm text-gray-400 mb-3">{part.output.description}</p>
            {part.output.videoUrl && (
              <>
              <video controls poster={part.output.coverUrl} className="w-full rounded-xl border border-gray-700/30 shadow-lg">
                <source src={part.output.videoUrl} type="video/mp4" />
              </video>
              <div className="absolute top-3 right-3">
  <SaveIcon url={part.output.videoUrl} type="video" meta={part.output} />
</div>
              </>
            )}
            {st.status === 'idle' && (
              <button
                onClick={() => mintContent('video', part.output, i, messageId)}
                className="w-full mt-3 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 py-2 px-4 rounded-xl text-sm font-medium hover:from-gray-500 hover:to-gray-600 transition-all"
              >
                Mint as NFT
              </button>
            )}
            {st.status === 'minting' && (
              <div className="flex items-center justify-center gap-2 text-gray-400 py-2">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Minting…</span>
              </div>
            )}
            {st.status === 'minted' && (
              <div className="bg-green-950/30 border border-green-500/20 rounded-xl p-3 mt-2">
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle size={16} />
                  <span className="font-medium">NFT Minted!</span>
                </div>
                <a
                  href={`https://etherscan.io/tx/${st.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-green-300 hover:text-green-200 mt-1"
                >
                  <ExternalLink size={12} />
                  <span>View transaction</span>
                </a>
              </div>
            )}
            {st.status === 'error' && (
              <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-3 text-sm text-red-400 mt-2">
                <span>Minting failed: {st.error}</span>
              </div>
            )}
          </div>
        );
      if (part.state === 'output-error')
        return (
          <div className="mt-4 bg-red-950/30 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
            <span>Video Error: {part.errorText}</span>
          </div>
        );
      return null;
    }

    // Add this to your renderToolPart function in the Main component
if (part.type === 'tool-createGoogleAdsCampaign') {
  if (part.state === 'input-available')
    return (
      <div className="mt-4 bg-gray-900/60 border border-gray-800/40 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          <Sparkles size={16} />
          <span className="text-sm font-medium">Creating Google Ads campaign…</span>
        </div>
      </div>
    );
  
  if (part.state === 'output-available')
    return (
      <div className="mt-4 bg-gray-950/95 border border-gray-800/40 rounded-2xl p-4 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-2 text-green-400 mb-3">
          <CheckCircle size={16} />
          <span className="text-sm font-semibold">Google Ads Campaign Created</span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex justify-between">
            <span className="text-gray-400">Campaign Name:</span>
            <span className="font-medium">{part.output.campaign.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Channel Type:</span>
            <span className="font-medium">{part.output.campaign.channelType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Budget:</span>
            <span className="font-medium">{part.output.campaign.budget}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Date Range:</span>
            <span className="font-medium">{part.output.campaign.dateRange}</span>
          </div>
        </div>

        <div className="mt-3 p-3 bg-gray-900/50 rounded-xl">
          <p className="text-xs text-gray-400">{part.output.message}</p>
        </div>

        <div className="absolute top-3 right-3">
          <SaveIcon
            url={`https://ads.google.com/aw/campaigns?campaignId=${part.output.campaign.resourceName.split('/').pop()}`}
            type="google-ads"
            meta={part.output}
          />
        </div>
      </div>
    );
  
  if (part.state === 'output-error')
    return (
      <div className="mt-4 bg-red-950/30 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
        <span>Google Ads Error: {part.errorText}</span>
      </div>
    );
  
  return null;
}

    /* ----- 3D MODEL ----- */
   /* ----- 3D MODEL ----- */
if (part.type === 'tool-generate3DModel') {
  if (part.state === 'input-available')
    return (
      <div className="mt-4 bg-gray-900/60 border border-gray-800/40 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          <Box size={16} />
          <span className="text-sm font-medium">Creating 3D model…</span>
        </div>
      </div>
    );

  if (part.state === 'output-available')
    return (
      <div className="mt-4 bg-gray-950/95 border border-gray-800/40 rounded-2xl p-4 backdrop-blur-xl shadow-lg">
        <p className="text-sm text-gray-400 mb-3">{part.output.description || '3D model generated.'}</p>

        {/* 3-D viewer wrapper */}
        {part.output.modelFileUrl && (
          <div className="relative h-96 w-full border border-gray-700/30 rounded-xl mb-3 overflow-hidden bg-gray-900/50">
            <ModelViewer
              modelUrl={part.output.modelFileUrl}
              showControls
              onLoading={console.log}
              onError={console.error}
            />
            {/* Save icon anchored top-right */}
            <div className="absolute top-3 right-3 z-10">
              <SaveIcon
                url={part.output.modelFileUrl}
                type="3dmodel"
                meta={part.output}
              />
            </div>
          </div>
        )}

        {/* Optional preview video */}
        {part.output.videoUrl && (
          <video controls className="w-full rounded-xl border border-gray-700/30 shadow-lg">
            <source src={part.output.videoUrl} type="video/mp4" />
          </video>
        )}

        {/* Minting UI */}
        {st.status === 'idle' && (
          <button
            onClick={() => mintContent('3dmodel', part.output, i, messageId)}
            className="w-full mt-3 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 py-2 px-4 rounded-xl text-sm font-medium hover:from-gray-500 hover:to-gray-600 transition-all"
          >
            Mint as NFT
          </button>
        )}
        {st.status === 'minting' && (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-2">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Minting…</span>
          </div>
        )}
        {st.status === 'minted' && (
          <div className="bg-green-950/30 border border-green-500/20 rounded-xl p-3 mt-2">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle size={16} />
              <span className="font-medium">NFT Minted!</span>
            </div>
            <a
              href={`https://etherscan.io/tx/${st.txHash}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-green-300 hover:text-green-200 mt-1"
            >
              <ExternalLink size={12} />
              <span>View transaction</span>
            </a>
          </div>
        )}
        {st.status === 'error' && (
          <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-3 text-sm text-red-400 mt-2">
            <span>Minting failed: {st.error}</span>
          </div>
        )}
      </div>
    );

  if (part.state === 'output-error')
    return (
      <div className="mt-4 bg-red-950/30 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
        <span>3D Model Error: {part.errorText}</span>
      </div>
    );

  return null;
}

    /* ----- SONG ----- */
    if (part.type === 'tool-generateSong') {
      if (part.state === 'input-available')
        return (
          <div className="mt-4 bg-gray-900/60 border border-gray-800/40 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 size={16} className="animate-spin" />
              <Music size={16} />
              <span className="text-sm font-medium">Creating song…</span>
            </div>
          </div>
        );
      if (part.state === 'output-available')
        return (
          <div className="mt-4 bg-gray-950/95 border border-gray-800/40 rounded-2xl p-4 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <Music size={16} />
              <span className="text-sm font-semibold">{part.output.title || 'Generated Music'}</span>
            </div>
            {part.output.imageUrl && (
              <img
                src={part.output.imageUrl}
                alt="cover"
                className="w-48 h-48 object-cover rounded-xl border border-gray-700/30 shadow-lg mb-3"
              />
            )}
            {part.output.audioUrl ? (
              <div className="mb-3">
                <audio controls className="w-full rounded-xl bg-gray-900/50 border border-gray-700/30">
                  <source src={part.output.audioUrl} type="audio/mpeg" />
                  <source src={part.output.audioUrl} type="audio/wav" />
                </audio>
                <a
                  href={part.output.audioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300 mt-2"
                >
                  <ExternalLink size={12} />
                  <span>Download audio</span>
                </a>
                <div className="absolute top-3 right-3">
  <SaveIcon url={part.output.audioUrl} type="song" meta={part.output} />
</div>
              </div>
            ) : (
              <div className="mb-3 text-sm text-gray-500 italic">Audio is being processed…</div>
            )}
            {part.output.videoUrl && (
              <video controls className="w-full rounded-xl border border-gray-700/30 shadow-lg">
                <source src={part.output.videoUrl} type="video/mp4" />
              </video>
            )}
            {st.status === 'idle' && (
              <button
                onClick={() => mintContent('song', part.output, i, messageId)}
                className="w-full mt-3 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 py-2 px-4 rounded-xl text-sm font-medium hover:from-gray-500 hover:to-gray-600 transition-all"
              >
                Mint as NFT
              </button>
            )}
            {st.status === 'minting' && (
              <div className="flex items-center justify-center gap-2 text-gray-400 py-2">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Minting…</span>
              </div>
            )}
            {st.status === 'minted' && (
              <div className="bg-green-950/30 border border-green-500/20 rounded-xl p-3 mt-2">
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle size={16} />
                  <span className="font-medium">NFT Minted!</span>
                </div>
                <a
                  href={`https://etherscan.io/tx/${st.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-green-300 hover:text-green-200 mt-1"
                >
                  <ExternalLink size={12} />
                  <span>View transaction</span>
                </a>
              </div>
            )}
            {st.status === 'error' && (
              <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-3 text-sm text-red-400 mt-2">
                <span>Minting failed: {st.error}</span>
              </div>
            )}
          </div>
        );
      if (part.state === 'output-error')
        return (
          <div className="mt-4 bg-red-950/30 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
            <span>Song Error: {part.errorText}</span>
          </div>
        );
      return null;
    }

    return null;
  };

  /* ----------  MESSAGE BUBBLE  ---------- */
 /* ----------  MESSAGE BUBBLE  ---------- */
const MessageBubble = ({ msg }: { msg: any }) => {
  const isUser = msg.role === 'user';
  const loadingParts = !isUser
    ? msg.parts.filter((p: any) => p.state === 'input-available' && p.type !== 'text')
    : [];

  /* ---- helper: remove tags + collect ALL urls ---- */
  const extractImageUrls = (text: string): { cleanText: string; imageUrls: string[] } => {
    const matches = Array.from(text.matchAll(/\(Uploaded image: (.+?)\)/g));
    const imageUrls = matches.map((m) => m[1]);
    const cleanText = text.replace(/\(Uploaded image: .+?\)/g, '').trim();
    return { cleanText, imageUrls };
  };

  const textParts = msg.parts.filter((p: any) => p.type === 'text');
  const textContent = textParts.map((p: any) => p.text).join('');

  const { cleanText, imageUrls } = isUser
    ? extractImageUrls(textContent)
    : { cleanText: textContent, imageUrls: [] };

  return (
    <div className={`flex items-start gap-4 group ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-gray-600 to-gray-700'
            : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/30'
        }`}
      >
        {isUser ? (
          <div className="w-6 h-6 rounded-full bg-gray-400" />
        ) : (
          <Sparkles size={18} className="text-gray-300" />
        )}
      </div>

      <div className="max-w-2xl flex flex-col">
        {!isUser &&
          loadingParts.map((part: any, idx: number) => (
            <div key={`load-${idx}`} className="mb-3">
              {renderToolPart(part, idx, msg.id)}
            </div>
          ))}

        {/* ---- text ---- */}
        <div
          className={`rounded-3xl px-6 py-4 shadow-lg ${
            isUser
              ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100'
              : 'bg-gray-950/95 border border-gray-800/40 text-gray-200 backdrop-blur-xl'
          }`}
        >
          <div className="text-sm leading-relaxed">{cleanText}</div>

          {/* ---- ALL user-uploaded images ---- */}
          {isUser &&
            imageUrls.length > 0 &&
            imageUrls.map((u, i) => (
              <div className="mt-3" key={i}>
                <img
                  src={u}
                  alt={`user-img-${i}`}
                  className="rounded-xl border border-gray-700/30 shadow-lg max-w-xs object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', u);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}
        </div>

        <div className="text-xs text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

  /* ----------  START SCREEN  ---------- */
  if (!started)
    return (
      <div className="h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="w-full max-w-2xl px-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-gray-700/20">
              <Sparkles size={32} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-200 mb-2">Create Amazing Content with AI</h2>
            <p className="text-gray-400">Generate images, videos, 3D models, and music. Then mint them as NFTs!</p>
          </div>

          {/* file + input */}
          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything, request an image, video, 3D model, or music…"
              className="w-full bg-gray-900/60 border border-gray-800/40 focus:border-gray-700/60 rounded-3xl px-6 py-4 pr-28 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700/30 transition-all backdrop-blur-sm shadow-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && (input.trim() || file)) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
<div className="absolute right-20 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {previews.map((p, i) => (
  <div key={i} className="relative">
    {files[i]?.type.startsWith('video/') ? (
      <video
        src={p}
        className="w-10 h-10 object-cover rounded-xl border border-gray-700/30"
        muted
        loop
        autoPlay
        playsInline
      />
    ) : (
      <img
        src={p}
        alt={`preview-${i}`}
        className="w-10 h-10 object-cover rounded-xl border border-gray-700/30"
      />
    )}
    <button
      onClick={() => removeFile(i)}
      className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1"
    >
      <X size={12} />
    </button>
  </div>
))}
  <label className="cursor-pointer">
    <Paperclip size={20} className="text-gray-400 hover:text-gray-200" />
    <input
  ref={fileRef}
  type="file"
  accept="image/*,video/*"   // <-- video/* added
  multiple
  onChange={onFilePick}
  className="hidden"
/>
  </label>
</div>
            <button
              onClick={handleSend}
             disabled={!input.trim() && files.length === 0}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all shadow-lg ${
              !input.trim() && files.length === 0
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 hover:from-gray-500 hover:to-gray-600 hover:scale-105'
              }`}
            >
              <Send size={20} />
            </button>
          </div>

          {uploading && (
            <div className="flex items-center gap-2 text-gray-400 text-sm mt-3">
              <Loader2 size={16} className="animate-spin" />
              <span>Uploading image…</span>
            </div>
          )}

          <div className="text-center mt-4 text-xs text-gray-500">Powered by advanced AI • Create & Mint NFTs</div>
        </div>
      </div>
    );

  /* ----------  SPLIT VIEW  ---------- */
  return (
    <div className="h-screen bg-gray-950 text-gray-100 flex overflow-hidden">
      {/* LEFT – FINAL TOOL RESULTS */}
      <ScrollArea className="w-1/2 border-r border-gray-800/30">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
  <h3 className="text-lg font-semibold text-gray-300">Generated Content</h3>
  <button
    onClick={() => setOpenSaved(true)}
    className="text-sm text-gray-400 hover:text-white flex items-center gap-2"
  >
    <Bookmark size={16} />
    Saved
  </button>
</div>
          <div className="space-y-6">
            {messages.map((msg) =>
              msg.parts
                .filter((p: any) => p.type !== 'text' && (p.state === 'output-available' || p.state === 'output-error'))
                .map((part: any, idx: number) => (
                  <div key={`${msg.id}-${idx}`}>{renderToolPart(part, idx, msg.id)}</div>
                ))
            )}
          </div>



{openSaved && <SavedGallery onClose={() => setOpenSaved(false)} />}


        </div>
      </ScrollArea>

      {/* RIGHT – CHAT */}
      <div className="w-1/2 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="space-y-8">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* INPUT BAR */}
        <div className="border-t border-gray-800/30 bg-gray-950/98 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-6 py-6">
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Reply…"
                className="w-full bg-gray-900/60 border border-gray-800/40 focus:border-gray-700/60 rounded-3xl px-6 py-4 pr-28 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700/30 transition-all backdrop-blur-sm shadow-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && (input.trim() || files)) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="absolute right-20 top-1/2 -translate-y-1/2 flex items-center gap-2">
             {previews.map((p, i) => (
  <div key={i} className="relative">
    {files[i]?.type.startsWith('video/') ? (
      <video
        src={p}
        className="w-10 h-10 object-cover rounded-xl border border-gray-700/30"
        muted
        loop
        autoPlay
        playsInline
      />
    ) : (
      <img
        src={p}
        alt={`preview-${i}`}
        className="w-10 h-10 object-cover rounded-xl border border-gray-700/30"
      />
    )}
    <button
      onClick={() => removeFile(i)}
      className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1"
    >
      <X size={12} />
    </button>
  </div>
))}
                <label className="cursor-pointer">
                  <Paperclip size={20} className="text-gray-400 hover:text-gray-200" />
                 <input
  ref={fileRef}
  type="file"
  accept="image/*,video/*"   // <-- video/* added
  multiple
  onChange={onFilePick}
  className="hidden"
/>
                </label>
              </div>
             <button
              onClick={handleSend}
             disabled={!input.trim() && files.length === 0}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all shadow-lg ${
              !input.trim() && files.length === 0
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 hover:from-gray-500 hover:to-gray-600 hover:scale-105'
              }`}
            >
                <Send size={20} />
              </button>
            </div>
            {uploading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-3">
                <Loader2 size={16} className="animate-spin" />
                <span>Uploading image…</span>
              </div>
            )}
            <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>AI Services Active</span>
              </div>
              <span>Create & Mint NFTs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}