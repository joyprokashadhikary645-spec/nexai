// src/app/dashboard/saved/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '@/components/common/Loading';
import { useLanguage } from '@/hooks/useLanguage';
import { MessageSquare } from 'lucide-react';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

interface SavedChat {
  id: string;
  title: string;
  updatedAt: string;
}

interface SavedContent {
  id: string;
  type: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function SavedPage() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<'chats' | 'content'>('chats');
  const [chats, setChats] = useState<SavedChat[]>([]);
  const [contents, setContents] = useState<SavedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatsRes, contentsRes] = await Promise.all([
          axios.get('/api/chats', { headers: { Authorization: `Bearer ${getToken()}` } }),
          axios.get('/api/content/saved', { headers: { Authorization: `Bearer ${getToken()}` } }),
        ]);
        setChats(chatsRes.data.data.filter((c: any) => c.isSaved));
        setContents(contentsRes.data.data);
      } catch (error) {
        toast.error(t('couldNotLoadData'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('favoritesTitle')}</h1>

      {/* ট্যাব */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setTab('chats')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'chats'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 dark:text-gray-400'
          }`}
        >
          {t('chatsTab')} ({chats.length})
        </button>
        <button
          onClick={() => setTab('content')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'content'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 dark:text-gray-400'
          }`}
        >
          {t('contentTab')} ({contents.length})
        </button>
      </div>

      {isLoading ? (
        <Loading text={t('loadingGeneric')} />
      ) : tab === 'chats' ? (
        chats.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            {t('noSavedChatsYet')}
          </p>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/dashboard/chat/${chat.id}`}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700"
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0 text-gray-400" strokeWidth={1.75} />
                <span className="font-medium truncate">{chat.title}</span>
              </Link>
            ))}
          </div>
        )
      ) : contents.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">
          {t('noSavedContentYet')}
        </p>
      ) : (
        <div className="space-y-3">
          {contents.map((item) => (
            <div key={item.id} className="card-md">
              <div className="flex items-center justify-between mb-2">
                <span className="badge badge-primary capitalize">{item.type}</span>
                <span className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString('bn-BD')}
                </span>
              </div>
              <p className="font-medium mb-1">{item.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
