// src/app/dashboard/tools/translator/page.tsx

'use client';

import { Languages } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';
import Button from '@/components/common/Button';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

export default function TranslatorPage() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('bn');
  const [autoDetect, setAutoDetect] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(false);
  const [includeEmojis, setIncludeEmojis] = useState(false);
  const [saveTranslation, setSaveTranslation] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        '/api/ai/translator',
        {
          text: sourceText,
          sourceLanguage,
          targetLanguage,
          autoDetect,
          includeHashtags,
          includeEmojis,
          saveTranslation,
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setTranslatedText(data.data.translatedText);
      toast.success('Translation successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
    setAutoDetect(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <Languages className="w-10 h-10 text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
        <div>
          <h1 className="text-2xl font-bold">Language Translator</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Instantly translate between 25+ languages
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* উৎস */}
        <div className="card-md">
          <div className="flex items-center justify-between mb-3">
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              disabled={autoDetect}
              className="input flex-1 mr-2"
            >
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                <option key={code} value={code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoDetect}
              onChange={(e) => setAutoDetect(e.target.checked)}
            />
            <span className="text-sm">Auto-detect language</span>
          </label>

          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type your text here..."
            rows={10}
            className="input resize-none"
          />
          <div className="text-xs text-gray-400 mt-1">{sourceText.length} characters</div>
        </div>

        {/* লক্ষ্য */}
        <div className="card-md">
          <div className="flex items-center gap-2 mb-3">
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="input flex-1"
            >
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                <option key={code} value={code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <button
              onClick={swapLanguages}
              className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Swap languages"
            >
              ⇄
            </button>
          </div>

          <div className="h-[38px] mb-3" /> {/* Spacer to align with checkbox row */}

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 min-h-[240px] whitespace-pre-wrap text-sm">
            {loading ? (
              <span className="text-gray-400">Translating...</span>
            ) : (
              translatedText || <span className="text-gray-400">Translation will appear here</span>
            )}
          </div>
          {translatedText && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(translatedText);
                toast.success('Copied to clipboard!');
              }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-2"
            >
              Copy
            </button>
          )}
        </div>
      </div>

      {/* অপশন এবং সাবমিট */}
      <div className="flex flex-wrap items-center gap-4 mt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeHashtags}
            onChange={(e) => setIncludeHashtags(e.target.checked)}
          />
          <span className="text-sm">#️⃣ Add Hashtags</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeEmojis}
            onChange={(e) => setIncludeEmojis(e.target.checked)}
          />
          <span className="text-sm">Add Emojis</span>
        </label>

        <Button onClick={handleTranslate} isLoading={loading} className="ml-auto">
          Translate
        </Button>
      </div>
    </div>
  );
}
