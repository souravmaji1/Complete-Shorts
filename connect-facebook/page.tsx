'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setVideoUrl(null);

    const form = e.currentTarget;
    const file = (form.image as any).files[0] as File;
    const prompt = (form.prompt as any).value as string;

    if (!file || !prompt) {
      setMsg('Please select an image and enter a prompt');
      setLoading(false);
      return;
    }

    const fd = new FormData();
    fd.append('image', file);
    fd.append('prompt', prompt);

    try {
      const { data } = await axios.post(
        `http://localhost:4000/generate-video`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setVideoUrl(data.videoUrl);
      setMsg('Video generated!');
    } catch (err: any) {
      setMsg(err.response?.data?.error || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700">Veo Video Generator</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <input name="image" type="file" accept="image/*" required onChange={onImage} 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>

          {preview && <img src={preview} alt="preview" className="mx-auto max-h-60 rounded-lg" />}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
            <textarea name="prompt" required rows={3} placeholder="Describe the video you want..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
            {loading ? 'Generating…' : 'Generate Video'}
          </button>
        </form>

        {msg && <div className={`p-3 rounded-lg ${videoUrl ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{msg}</div>}

        {videoUrl && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Your Video</h2>
            <video src={videoUrl} controls autoPlay loop className="w-full rounded-lg shadow" />
            <a href={videoUrl} download target="_blank" rel="noreferrer"
              className="inline-block w-full text-center py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Download MP4
            </a>
          </div>
        )}
      </div>
    </main>
  );
}