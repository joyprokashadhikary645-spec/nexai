// src/app/dashboard/tools/image-generator/page.tsx

'use client';

import { Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

const STYLE_SUGGESTIONS = [
  'photorealistic',
  'digital art',
  'anime style',
  'oil painting',
  '3D render',
  'watercolor',
];

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('photorealistic');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe the image you want');
      return;
    }

    setLoading(true);
    setImage('');
    try {
      const fullPrompt = `${prompt}, ${style}, high quality, detailed`;
      const { data } = await axios.post(
        '/api/ai/image-generator',
        { prompt: fullPrompt },
        { headers: { Authorization: `Bearer ${getToken()}` }, timeout: 60000 }
      );
      setImage(data.data.image);
      toast.success('Image generated!');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Image generation failed, please try again'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = 'nexai-generated-image.png';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <ImageIcon className="w-10 h-10 text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
        <div>
          <h1 className="text-2xl font-bold">Image Generator</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Describe it, and let AI create the image
          </p>
        </div>
      </div>

      {/* ইনপুট */}
      <div className="card-md mb-4">
        <label className="block text-sm font-medium mb-2">Describe the image</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Sunset over mountains, a calm lake, peaceful atmosphere"
          rows={3}
          className="input resize-none mb-3"
        />

        <label className="block text-sm font-medium mb-2">Style</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {STYLE_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                style === s
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <Button onClick={handleGenerate} isLoading={loading} fullWidth size="lg">
          Generate Image
        </Button>

        {loading && (
          <p className="text-xs text-center text-gray-400 mt-2">
            The model may take an extra 20-30 seconds to load on the first try
          </p>
        )}
      </div>

      {/* ফলাফল */}
      {(image || loading) && (
        <div className="card-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Result</h3>
            {image && (
              <button
                onClick={handleDownload}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Download
              </button>
            )}
          </div>

          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl aspect-square flex items-center justify-center overflow-hidden">
            {loading ? (
              <span className="text-gray-400">Generating image...</span>
            ) : (
              <img src={image} alt="Generated image" className="w-full h-full object-cover" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
