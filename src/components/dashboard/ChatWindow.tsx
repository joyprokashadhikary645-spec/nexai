// src/components/dashboard/ChatWindow.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Message } from '@/hooks/useChat';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  isSending: boolean;
}

const ChatWindow = ({ messages, isSending }: ChatWindowProps) => {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [feedback, setFeedback] = useState<{ [id: string]: 'like' | 'dislike' }>({});
  const { t } = useLanguage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('copiedToast'));
  };

  const handleFeedback = (id: string, type: 'like' | 'dislike') => {
    setFeedback((prev) => ({ ...prev, [id]: prev[id] === type ? undefined as any : type }));
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="relative w-16 h-16 mb-4">
          <Image src="/logo.png" alt="NexAI" fill className="object-contain" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('welcomeToChatTitle')}</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          {t('welcomeToChatDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.filter((m) => m.content !== '').map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 max-w-3xl mx-auto ${
            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* Avatar */}
          {message.role === 'user' ? (
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm bg-primary-600 text-white overflow-hidden">
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase() || ''
              )}
            </div>
          ) : (
            <div className="relative flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-secondary-500 to-primary-500">
              <Image src="/logo.png" alt="NexAI" fill className="object-contain p-0.5" />
            </div>
          )}

          {/* Message Bubble + Actions */}
          <div className={`flex flex-col gap-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white rounded-tr-none'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none'
              }`}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>

            {/* AI মেসেজের জন্য Copy/Like/Dislike অ্যাকশন */}
            {message.role === 'assistant' && (
              <div className="flex items-center gap-1 px-1">
                <button
                  onClick={() => handleCopy(message.content)}
                  title={t('copyButton')}
                  className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => handleFeedback(message.id, 'like')}
                  title={t('goodResponse')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    feedback[message.id] === 'like'
                      ? 'text-green-600 bg-green-50 dark:bg-green-900/30'
                      : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => handleFeedback(message.id, 'dislike')}
                  title={t('badResponse')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    feedback[message.id] === 'dislike'
                      ? 'text-red-600 bg-red-50 dark:bg-red-900/30'
                      : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* টাইপিং ইন্ডিকেটর — যতক্ষণ না প্রথম চাংক আসে (এরপর মেসেজ বাবলেই স্ট্রিমিং টেক্সট দেখা যায়) */}
      {isSending && messages[messages.length - 1]?.content === '' && (
        <div className="flex gap-3 max-w-3xl mx-auto">
          <div className="relative flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-secondary-500 to-primary-500">
            <Image src="/logo.png" alt="NexAI" fill className="object-contain p-0.5" />
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-gray-100 dark:bg-gray-800">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
