'use client';

/* ----------------------------------------------------------
   ONE-CLICK  multi-scene  image→video  +  browser FFmpeg
---------------------------------------------------------- */
import { useState, useRef, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { Clock, Download, RotateCcw, ImagePlus, Trash2, Film, Camera, Plus } from 'lucide-react';

/* ---------- FFmpeg ---------- */
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

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
    try {
      const { data: c } = await this.client.post('/task', {
        model: 'gemini',
        task_type: 'gemini-2.5-flash-image',
        input: { prompt, image_urls: imageUrls, num_images: numImages, output_format: outputFormat },
      });
      if (c.code !== 200) throw new Error(c.message);
      return await this.poll(c.data.task_id);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  private async poll(taskId: string, max = 40, delay = 2000) {
    for (let i = 0; i < max; i++) {
      const { data } = await this.client.get(`/task/${taskId}`);
      if (data.code !== 200) throw new Error(data.message);
      const st = data.data?.status || data.data?.task_status;
      if (['success', 'completed', 'Completed'].includes(st)) {
        const out = data.data.output || data.data.task_output;
        const urls = out.image_urls || (out.image_url ? [out.image_url] : []);
        if (!urls.length) throw new Error('No image returned');
        return { success: true, imageUrls: urls };
      }
      if (['failed', 'Failed'].includes(st)) throw new Error('Task failed');
      await new Promise((r) => setTimeout(r, delay));
    }
    throw new Error('Timeout');
  }
}

/* ---------- types ---------- */
type Scene = {
  id: string;
  images: { name: string; url: string; path: string }[];
  imagePrompt: string;
  videoPrompt: string;
  negativePrompt: string;
  aspectRatio: '16:9' | '9:16' | '4:3' | '1:1';
};

/* ---------- page ---------- */
export default function MultiScenePage() {
  /* ---------- scenes ---------- */
  const [scenes, setScenes] = useState<Scene[]>([
    { id: crypto.randomUUID(), images: [], imagePrompt: '', videoPrompt: '', negativePrompt: '', aspectRatio: '16:9' },
  ]);

  /* ---------- global running state ---------- */
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState<'idle' | 'image' | 'video' | 'merge' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  /* ---------- final outputs ---------- */
  const [sceneVideos, setSceneVideos] = useState<{ sceneId: string; blob: Blob; url: string }[]>([]);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);

  /* ---------- FFmpeg instance ---------- */
  const ffmpegRef = useRef<FFmpeg | null>(null);
  useEffect(() => {
    const loadFF = async () => {
      const ffmpeg = new FFmpeg();
      await ffmpeg.load({ coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js' });
      ffmpegRef.current = ffmpeg;
    };
    loadFF();
  }, []);

  /* ---------- helpers ---------- */
  const addScene = () =>
    setScenes((s) => [
      ...s,
      { id: crypto.randomUUID(), images: [], imagePrompt: '', videoPrompt: '', negativePrompt: '', aspectRatio: '16:9' },
    ]);

  const removeScene = (id: string) => setScenes((s) => s.filter((x) => x.id !== id));

  const updateScene = <K extends keyof Scene>(id: string, key: K, value: Scene[K]) =>
    setScenes((s) => s.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  /* ---------- upload for one scene ---------- */
  const uploadForScene = async (sceneId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const toUpload = Array.from(files).map(async (file) => {
      const ext = file.name.split('.').pop();
      const name = `${crypto.randomUUID()}.${ext}`;
      const path = `public/${name}`;
      const { error } = await supabase.storage.from('fgfg').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('fgfg').getPublicUrl(path);
      return { name: file.name, url: data.publicUrl, path };
    });
    try {
      const ups = await Promise.all(toUpload);
      setScenes((s) => s.map((x) => (x.id === sceneId ? { ...x, images: [...x.images, ...ups] } : x)));
    } catch (err: any) {
      alert('Upload: ' + err.message);
    }
  };

  const removeImage = (sceneId: string, index: number) =>
    setScenes((s) =>
      s.map((x) =>
        x.id === sceneId ? { ...x, images: x.images.filter((_, i) => i !== index) } : x
      )
    );

  /* ---------- can run ---------- */
  const canRun = useMemo(
    () =>
      !running &&
      scenes.every((sc) => sc.images.length > 0 && sc.imagePrompt.trim() && sc.videoPrompt.trim()),
    [running, scenes]
  );

  /* ---------- RUN FULL PIPELINE ---------- */
  const run = async () => {
    setRunning(true);
    setStage('image');
    setError('');
    setSceneVideos([]);
    setFinalUrl(null);

    const imgClient = new PiAPIClient(process.env.NEXT_PUBLIC_PIAPI_API_KEY!);
    const vids: { sceneId: string; blob: Blob; url: string }[] = [];

    /* ---- scene loop ---- */
    for (const sc of scenes) {
      /* 1. image */
      const imgRes = await imgClient.generateImage(
        sc.imagePrompt,
        sc.images.map((i) => i.url),
        1,
        'jpeg'
      );
      if (!imgRes.success) {
        setError(`Scene ${sc.id.slice(0, 6)} image: ${imgRes.error}`);
        setStage('error');
        setRunning(false);
        return;
      }
      const manipulated = imgRes.imageUrls[0];

      /* 2. video */
      setStage('video');
      const fd = new FormData();
      fd.append('prompt', sc.videoPrompt);
      if (sc.negativePrompt) fd.append('negativePrompt', sc.negativePrompt);
      fd.append('aspectRatio', sc.aspectRatio);
      fd.append('manipulatedUrl', manipulated);

      const startRes = await fetch('/api/proxy-video', { method: 'POST', body: fd });
      const startJson = await startRes.json();
      if (!startRes.ok) {
        setError(`Scene ${sc.id.slice(0, 6)} video start: ${startJson.error}`);
        setStage('error');
        setRunning(false);
        return;
      }

      /* 3. poll video */
      let uri: string | null = null;
      for (let i = 0; i < 120; i++) {
        await new Promise((r) => setTimeout(r, 5000));
        const pollRes = await fetch('/api/operation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: startJson.name }),
        });
        const pollJson = await pollRes.json();
        if (!pollRes.ok) continue;
        if (pollJson.done) {
          uri = pollJson.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
          break;
        }
      }
      if (!uri) {
        setError(`Scene ${sc.id.slice(0, 6)} video timeout`);
        setStage('error');
        setRunning(false);
        return;
      }

      /* 4. download blob */
      const dlRes = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri }),
      });
      const blob = await dlRes.blob();
      vids.push({ sceneId: sc.id, blob, url: URL.createObjectURL(blob) });
    }

    setSceneVideos(vids);

    /* ---- merge with FFmpeg ---- */
    setStage('merge');
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg) {
      setError('FFmpeg not loaded');
      setStage('error');
      setRunning(false);
      return;
    }

    /* write each scene */
    for (let i = 0; i < vids.length; i++) {
      await ffmpeg.writeFile(`scene${i}.mp4`, await fetchFile(vids[i].blob));
    }

    /* build concat list */
    const list = vids.map((_, i) => `file scene${i}.mp4`).join('\n');
    await ffmpeg.writeFile('list.txt', list);

    /* run concat */
    await ffmpeg.exec([
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      'list.txt',
      '-c',
      'copy',
      'final.mp4',
    ]);

    /* read result */
    const data = await ffmpeg.readFile('final.mp4');
    const finalBlob = new Blob([data], { type: 'video/mp4' });
    setFinalUrl(URL.createObjectURL(finalBlob));
    setStage('done');
    setRunning(false);
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen text-stone-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold">Multi-scene image → video </h1>
        <p className="text-sm text-stone-500">Add scenes, click once, get one combined reel.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-40 space-y-6">
        {/* scenes */}
        {scenes.map((sc, idx) => (
          <div key={sc.id} className="border rounded p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Scene {idx + 1}</span>
              {scenes.length > 1 && (
                <button className="btn btn-ghost btn-xs" onClick={() => removeScene(sc.id)}>
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* images */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-stone-600">Images</span>
                <label className="btn btn-xs btn-outline">
                  <ImagePlus className="w-4 h-4 mr-1" /> Add
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => uploadForScene(sc.id, e)} />
                </label>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {sc.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img.url} alt={img.name} className="w-full h-20 object-cover rounded" />
                    <button onClick={() => removeImage(sc.id, i)} className="absolute top-1 right-1 bg-white/80 rounded p-1 opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-stone-500">Image prompt</label>
                <textarea
                  className="textarea textarea-bordered w-full text-sm"
                  rows={2}
                  value={sc.imagePrompt}
                  onChange={(e) => updateScene(sc.id, 'imagePrompt', e.target.value)}
                  placeholder="Cyberpunk style…"
                />
              </div>
              <div>
                <label className="text-xs text-stone-500">Video prompt</label>
                <textarea
                  className="textarea textarea-bordered w-full text-sm"
                  rows={2}
                  value={sc.videoPrompt}
                  onChange={(e) => updateScene(sc.id, 'videoPrompt', e.target.value)}
                  placeholder="Camera orbits around…"
                />
                <input
                  className="input input-bordered w-full text-sm mt-2"
                  value={sc.negativePrompt}
                  onChange={(e) => updateScene(sc.id, 'negativePrompt', e.target.value)}
                  placeholder="Negative prompt"
                />
                <select
                  className="select select-bordered w-full text-sm mt-2"
                  value={sc.aspectRatio}
                  onChange={(e) => updateScene(sc.id, 'aspectRatio', e.target.value as any)}
                >
                  <option value="16:9">16:9</option>
                  <option value="9:16">9:16</option>
                  <option value="4:3">4:3</option>
                  <option value="1:1">1:1</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {/* add scene */}
        <button className="btn btn-outline btn-sm" onClick={addScene}>
          <Plus className="w-4 h-4 mr-1" /> Add scene
        </button>

        {/* run */}
        <div className="flex items-center gap-4">
          <button className={`btn btn-primary ${running ? 'loading' : ''}`} onClick={run} disabled={!canRun}>
            {running && stage === 'image' && 'Images…'}
            {running && stage === 'video' && 'Videos…'}
            {running && stage === 'merge' && 'Merging…'}
            {!running && 'Generate reel'}
          </button>
          {finalUrl && (
            <button className="btn btn-sm btn-outline" onClick={() => {
                const a = document.createElement('a');
                a.href = finalUrl;
                a.download = 'reel.mp4';
                a.click();
            }}>
              <Download className="w-4 h-4 mr-1" /> Download reel
            </button>
          )}
          <button className="btn btn-ghost btn-sm" onClick={() => location.reload()}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </button>
        </div>

        {/* scene previews */}
        {sceneVideos.length > 0 && (
          <div className="border rounded p-4">
            <div className="text-sm text-stone-600 mb-2">Scene videos</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sceneVideos.map((v) => (
                <video key={v.sceneId} src={v.url} controls className="w-full rounded" />
              ))}
            </div>
          </div>
        )}

        {/* final reel */}
        {finalUrl && (
          <div className="border rounded p-4">
            <div className="text-sm text-stone-600 mb-2">Final reel</div>
            <video src={finalUrl} controls className="w-full rounded" />
          </div>
        )}

        {/* error */}
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
    </div>
  );
}