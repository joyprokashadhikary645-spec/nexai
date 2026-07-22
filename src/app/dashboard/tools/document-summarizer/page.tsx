// src/app/dashboard/tools/document-summarizer/page.tsx

'use client';

import { File, FileText, UploadCloud } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

export default function DocumentSummarizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validTypes = ['.pdf', '.docx', '.doc', '.txt'];

  const handleFileSelect = (selectedFile: File) => {
    const ext = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(ext)) {
      toast.error('Only PDF, DOCX, and TXT files are supported');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Keep it under 5MB.');
      return;
    }
    setFile(selectedFile);
    setSummary('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await axios.post('/api/documents/upload', formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSummary(data.data.summary);
      toast.success('Summary generated!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'File processing failed');
    } finally {
      setLoading(false);
    }
  };

  const fileIcon = (name: string) => {
    if (name.endsWith('.pdf')) return <FileText className="w-10 h-10 mx-auto text-red-500" strokeWidth={1.5} />;
    if (name.endsWith('.docx') || name.endsWith('.doc')) return <FileText className="w-10 h-10 mx-auto text-blue-500" strokeWidth={1.5} />;
    return <File className="w-10 h-10 mx-auto text-gray-400" strokeWidth={1.5} />;
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <File className="w-10 h-10 text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
        <div>
          <h1 className="text-2xl font-bold">Document Summarizer</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Upload a PDF, DOCX, or TXT file to get an instant summary
          </p>
        </div>
      </div>

      {/* আপলোড এরিয়া */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`card-lg border-2 border-dashed cursor-pointer text-center transition-colors ${
          dragOver
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-700'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />

        {file ? (
          <div>
            <div className="text-4xl mb-3">{fileIcon(file.name)}</div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div>
            <UploadCloud className="w-10 h-10 mb-3 mx-auto text-gray-300 dark:text-gray-700" strokeWidth={1.5} />
            <p className="font-medium mb-1">Drag & drop a file, or click to browse</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              PDF, DOCX, TXT (max 5MB)
            </p>
          </div>
        )}
      </div>

      <Button onClick={handleUpload} isLoading={loading} fullWidth size="lg" className="mt-4">
        Generate Summary
      </Button>

      {/* সারাংশ ফলাফল */}
      {summary && (
        <div className="card-md mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Summary</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(summary);
                toast.success('Copied to clipboard!');
              }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Copy
            </button>
          </div>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  );
}
