// src/components/dashboard/ChatInput.tsx

'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface ChatInputProps {
  onSend: (message: string) => void;
  isSending: boolean;
}

const ChatInput = ({ onSend, isSending }: ChatInputProps) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useLanguage();

  const handleSend = () => {
    if (!text.trim() || isSending) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={t('typeMessageHint')}
            rows={1}
            disabled={isSending}
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100 max-h-[200px]"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!text.trim() || isSending}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSending ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">
        {t('chatDisclaimer')}
      </p>
    </div>
  );
};

export default ChatInput;
