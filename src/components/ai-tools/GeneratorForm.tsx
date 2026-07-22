// src/components/ai-tools/GeneratorForm.tsx

'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ToolConfig } from '@/lib/toolConfig';
import { TONE_STYLES, SUPPORTED_LANGUAGES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/common/Button';
import { TOOL_ICONS, TONE_ICONS } from '@/lib/icons';
import { MessageSquare, Copy, Hash, Smile as SmileIcon } from 'lucide-react';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

interface GeneratorFormProps {
  config: ToolConfig;
}

const GeneratorForm = ({ config }: GeneratorFormProps) => {
  const { user } = useAuth();
  const { t, tTool } = useLanguage();

  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [includeHashtags, setIncludeHashtags] = useState(false);
  const [includeEmojis, setIncludeEmojis] = useState(false);
  const [saveContent, setSaveContent] = useState(true);

  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error(`${config.topicLabel} is required`);
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const { data } = await axios.post(
        '/api/ai/generate',
        {
          toolType: config.id,
          topic,
          description,
          tone,
          language,
          includeHashtags,
          includeEmojis,
          saveContent,
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setResult(data.data.content);
      toast.success(t('generatedSuccess'));
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('generationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast.success(t('copiedToast'));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* হেডার */}
      <div className="flex items-center gap-3 mb-6">
        {(() => {
          const Icon = TOOL_ICONS[config.id] || MessageSquare;
          return <Icon className="w-9 h-9 text-primary-600 dark:text-primary-400" strokeWidth={1.75} />;
        })()}
        <div>
          <h1 className="text-2xl font-bold">{tTool(config.id, 'name', config.title)}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{tTool(config.id, 'desc', config.description)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ইনপুট সেকশন */}
        <div className="card-md space-y-4">
          {/* মূল টপিক/টেক্সট */}
          <div>
            <label className="block text-sm font-medium mb-1.5">{config.topicLabel}</label>
            {config.isTextArea ? (
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={config.topicPlaceholder}
                rows={8}
                className="input resize-none"
              />
            ) : (
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={config.topicPlaceholder}
                className="input"
              />
            )}
          </div>

          {/* ঐচ্ছিক বিবরণ */}
          {config.showDescription && (
            <div>
              <label className="block text-sm font-medium mb-1.5">{config.descriptionLabel}</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={config.descriptionPlaceholder}
                className="input"
              />
            </div>
          )}

          {/* Tone নির্বাচন */}
          {config.showTone && (
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('toneLabel')}</label>
              <div className="flex flex-wrap gap-2">
                {TONE_STYLES.map((toneItem) => {
                  const ToneIcon = TONE_ICONS[toneItem.id] || SmileIcon;
                  return (
                    <button
                      key={toneItem.id}
                      onClick={() => setTone(toneItem.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        tone === toneItem.id
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <ToneIcon className="w-3.5 h-3.5" strokeWidth={1.75} /> {toneItem.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ভাষা নির্বাচন */}
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('languageLabel')}</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input">
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                <option key={code} value={code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hashtag এবং Emoji অপশন */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
              />
              <span className="text-sm flex items-center gap-1"><Hash className="w-3.5 h-3.5" strokeWidth={1.75} /> {t('addHashtags')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEmojis}
                onChange={(e) => setIncludeEmojis(e.target.checked)}
              />
              <span className="text-sm flex items-center gap-1"><SmileIcon className="w-3.5 h-3.5" strokeWidth={1.75} /> {t('addEmojis')}</span>
            </label>
          </div>

          <Button onClick={handleGenerate} isLoading={isLoading} fullWidth size="lg">
            {config.submitLabel}
          </Button>
        </div>

        {/* আউটপুট সেকশন */}
        <div className="card-md flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">{t('yourResult')}</h3>
            {result && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                <Copy className="w-3.5 h-3.5" strokeWidth={1.75} /> {t('copyButton')}
              </button>
            )}
          </div>

          <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-y-auto min-h-[300px] whitespace-pre-wrap text-sm">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                {t('generatingButton')}
              </div>
            ) : result ? (
              result
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-center">
                {t('resultPlaceholder')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorForm;
