// src/app/dashboard/tools/code-generator/page.tsx

'use client';

import { Code2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
  { id: 'python', name: 'Python' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'php', name: 'PHP' },
  { id: 'sql', name: 'SQL' },
  { id: 'java', name: 'Java' },
];

export default function CodeGeneratorPage() {
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error('Please describe what code you need');
      return;
    }

    setLoading(true);
    setCode('');
    try {
      const { data } = await axios.post(
        '/api/ai/code-generator',
        { description, language, saveContent: true },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setCode(data.data.content);
      toast.success('Code generated!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Code generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <Code2 className="w-10 h-10 text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
        <div>
          <h1 className="text-2xl font-bold">Code Generator</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Generate code in JavaScript, HTML, CSS, Python, and more
          </p>
        </div>
      </div>

      {/* ভাষা নির্বাচন */}
      <div className="flex flex-wrap gap-2 mb-4">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setLanguage(lang.id)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
              language === lang.id
                ? 'bg-primary-600 text-white border-primary-600'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>

      {/* বিবরণ ইনপুট */}
      <div className="card-md mb-4">
        <label className="block text-sm font-medium mb-2">Describe what code you need</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. A function that adds two numbers, or a responsive navigation bar"
          rows={4}
          className="input resize-none"
        />
        <Button onClick={handleGenerate} isLoading={loading} className="mt-3" fullWidth>
          Generate Code
        </Button>
      </div>

      {/* কোড আউটপুট */}
      <div className="card-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Generated Code</h3>
          {code && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                toast.success('Code copied!');
              }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Copy
            </button>
          )}
        </div>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm min-h-[200px]">
          <code>
            {loading ? 'Generating code...' : code || '// Your code will appear here'}
          </code>
        </pre>
      </div>
    </div>
  );
}
