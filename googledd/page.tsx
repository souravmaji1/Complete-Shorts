'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { Clock, Download, RotateCcw, ImagePlus, Trash2, Film, Camera } from 'lucide-react';

/* ---------- Supabase ---------- */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!,
  process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!
);

/* ---------- PiAPI client (unchanged) ---------- */
class PiAPIClient {
  constructor(private apiKey: string) {}
  private client = axios.create({
    baseURL: 'https://api.piapi.ai/api/v1',
    headers: { 'X-API-Key': this.apiKey, 'Content-Type': 'application/json' },
    timeout: 30000,
  });

  async generateImage(prompt: string, imageUrls: string[] = [], numImages = 1, outputFormat: 'jpeg' | 'png' = 'jpeg') {
    let taskId: string | null = null;
    try {
      const { data: createRes } = await this.client.post('/task', {
        model: 'gemini',
        task_type: 'gemini-2.5-flash-image',
        input: { prompt, image_urls: imageUrls, num_images: numImages, output_format: outputFormat },
      });
      if (createRes.code !== 200) throw new Error(createRes.message);
      taskId = createRes.data.task_id;
      const result = await this.poll(taskId);
      return { success: true, imageUrls: result.imageUrls };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  private async poll(taskId: string, max = 40, delay = 2000) {
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
      if (['failed', 'Failed'].includes(status)) throw new Error('Image task failed');
      await new Promise((r) => setTimeout(r, delay));
    }
    throw new Error('Timeout');
  }
}

/* ---------- Progress helper ---------- */
type Stage = 'idle' | 'uploading' | 'image' | 'video' | 'done' | 'error';

export default function OneClickPage() {
  /* ---------- IMAGE STATE ---------- */
  const [uploaded, setUploaded] = useState<{ name: string; url: string; path: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- PROMPTS ---------- */
  const [imagePrompt, setImagePrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '4:3' | '1:1'>('16:9');

  /* ---------- FLOW ---------- */
  const [stage, setStage] = useState<Stage>('idle');
  const [manipulatedUrl, setManipulatedUrl] = useState<string | null>(null);
  const [opName, setOpName] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  /* ---------- UPLOAD ---------- */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setStage('uploading');
    const promises = Array.from(files).map(async (file) => {
      const ext = file.name.split('.').pop();
      const name = `${crypto.randomUUID()}.${ext}`;
      const path = `public/${name}`;
      const { error } = await supabase.storage.from('fgfg').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('fgfg').getPublicUrl(path);
      return { name: file.name, url: data.publicUrl, path };
    });
    try {
      const res = await Promise.all(promises);
      setUploaded((u) => [...u, ...res]);
      setStage('idle');
    } catch (err: any) {
      setError('Upload: ' + err.message);
      setStage('error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index: number) => {
    const target = uploaded[index];
    await supabase.storage.from('fgfg').remove([target.path]);
    setUploaded((u) => u.filter((_, i) => i !== index));
  };

  /* ---------- SINGLE BUTTON ---------- */
  const canRun = useMemo(
    () => imagePrompt.trim() && videoPrompt.trim() && uploaded.length > 0 && stage === 'idle',
    [imagePrompt, videoPrompt, uploaded, stage]
  );

  const run = async () => {
    setError('');
    setVideoUrl(null);
    setManipulatedUrl(null);

    /* ---- 1. IMAGE ---- */
    setStage('image');
    const imgClient = new PiAPIClient(process.env.NEXT_PUBLIC_PIAPI_API_KEY!);
    const imgRes = await imgClient.generateImage(
      imagePrompt,
      uploaded.map((u) => u.url),
      1,
      'jpeg'
    );
    if (!imgRes.success) {
      setError('Image: ' + imgRes.error);
      setStage('error');
      return;
    }
    const imgUrl = imgRes.imageUrls[0];
    setManipulatedUrl(imgUrl);

    /* ---- 2. VIDEO ---- */
    setStage('video');
    const fd = new FormData();
    fd.append('prompt', videoPrompt);
    if (negativePrompt) fd.append('negativePrompt', negativePrompt);
    fd.append('aspectRatio', aspectRatio);
    fd.append('manipulatedUrl', imgUrl);

    try {
      const r = await fetch('/api/proxy-video', { method: 'POST', body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Video start failed');
      setOpName(j.name || null);
    } catch (e: any) {
      setError('Video: ' + e.message);
      setStage('error');
    }
  };

  /* ---- POLL VIDEO ---- */
  useEffect(() => {
    if (!opName || videoUrl) return;
    let t: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const r = await fetch('/api/operation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: opName }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error);
        if (j.done) {
          const uri = j.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
          if (!uri) throw new Error('No video uri');
          const dl = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uri }),
          });
          const blob = await dl.blob();
          setVideoUrl(URL.createObjectURL(blob));
          setStage('done');
          return;
        }
      } catch (e: any) {
        setError('Poll: ' + e.message);
        setStage('error');
        return;
      }
      t = setTimeout(poll, 5000);
    };
    t = setTimeout(poll, 5000);
    return () => clearTimeout(t);
  }, [opName, videoUrl]);

  /* ---- DOWNLOAD ---- */
  const downloadVideo = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'veo3_video.mp4';
    a.click();
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="min-h-screen text-stone-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold">One-click Image → Video</h1>
        <p className="text-sm text-stone-500">Upload images, write prompts, hit Generate once.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-40 space-y-6">
        {/* IMAGES */}
        <div className="border rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-stone-600">1. Upload images</span>
            <button onClick={() => fileInputRef.current?.click()} className="btn btn-sm btn-outline">
              <ImagePlus className="w-4 h-4 mr-1" /> Add
            </button>
            <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleUpload} className="hidden" />
          </div>
          {uploading && <div className="text-sm text-stone-500 mb-2">Uploading…</div>}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {uploaded.map((u, i) => (
              <div key={i} className="relative group">
                <img src={u.url} alt={u.name} className="w-full h-24 object-cover rounded" />
                <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-white/80 rounded p-1 opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PROMPTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4 space-y-3">
            <label className="text-sm text-stone-600">2. Image-manipulation prompt</label>
            <textarea
              className="textarea textarea-bordered w-full text-sm"
              rows={2}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="A futuristic cyberpunk version of…"
            />
          </div>
          <div className="border rounded p-4 space-y-3">
            <label className="text-sm text-stone-600">3. Video prompt</label>
            <textarea
              className="textarea textarea-bordered w-full text-sm"
              rows={2}
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              placeholder="Camera slowly orbits around…"
            />
            <input
              className="input input-bordered w-full text-sm"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Negative prompt (optional)"
            />
            <select
              className="select select-bordered w-full text-sm"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as any)}
            >
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="4:3">4:3</option>
              <option value="1:1">1:1</option>
            </select>
          </div>
        </div>

        {/* BIG BUTTON */}
        <div className="flex items-center gap-4">
          <button className={`btn btn-primary ${stage !== 'idle' ? 'loading' : ''}`} onClick={run} disabled={!canRun}>
            {stage === 'idle' && 'Generate'}
            {stage === 'image' && 'Creating image…'}
            {stage === 'video' && 'Creating video…'}
            {stage === 'done' && 'Done'}
            {stage === 'error' && 'Failed'}
          </button>
          {(stage === 'done' || videoUrl) && (
            <button className="btn btn-sm btn-outline" onClick={downloadVideo}>
              <Download className="w-4 h-4 mr-1" /> Download video
            </button>
          )}
          <button className="btn btn-ghost btn-sm" onClick={() => location.reload()}>
            <RotateCcw className="w-4 h-4 mr-1" /> Start over
          </button>
        </div>

        {/* PREVIEW */}
        {manipulatedUrl && (
          <div className="border rounded p-4">
            <div className="text-sm text-stone-600 mb-2">Manipulated image</div>
            <img src={manipulatedUrl} alt="manipulated" className="w-full md:w-1/2 rounded" />
          </div>
        )}

        {/* PLAYER */}
        {videoUrl && (
          <div className="border rounded p-4">
            <div className="text-sm text-stone-600 mb-2">Generated video</div>
            <video controls className="w-full rounded" src={videoUrl} />
          </div>
        )}

        {/* ERROR */}
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
    </div>
  );
}