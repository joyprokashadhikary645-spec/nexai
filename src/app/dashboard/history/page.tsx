// src/app/dashboard/history/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '@/components/common/Loading';
import { MessageSquareOff } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ChatItem {
  id: string;
  title: string;
  isSaved: boolean;
  isPinned: boolean;
  updatedAt: string;
}

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

export default function HistoryPage() {
  const { t } = useLanguage();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChats = async () => {
    try {
      const { data } = await axios.get('/api/chats', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setChats(data.data);
    } catch (error) {
      toast.error(t('couldNotLoadHistory'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const toggleSave = async (chat: ChatItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await axios.patch(
        `/api/chats/${chat.id}`,
        { isSaved: !chat.isSaved },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setChats((prev) =>
        prev.map((c) => (c.id === chat.id ? { ...c, isSaved: !c.isSaved } : c))
      );
      toast.success(chat.isSaved ? t('removedFromFavorites') : t('addedToFavorites'));
    } catch (error) {
      toast.error(t('operationFailed'));
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(t('confirmDeleteChat'))) return;

    try {
      await axios.delete(`/api/chats/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setChats((prev) => prev.filter((c) => c.id !== id));
      toast.success(t('chatDeleted'));
    } catch (error) {
      toast.error(t('deleteFailed'));
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) return <Loading fullScreen text={t('loadingHistory')} />;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('chatHistoryTitle')}</h1>

      {chats.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquareOff className="w-14 h-14 mb-4 mx-auto text-gray-300 dark:text-gray-700" strokeWidth={1.5} />
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t('noChatsYet')}</p>
          <Link href="/dashboard/chat" className="btn btn-primary">
            {t('startNewChat')}
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/dashboard/chat/${chat.id}`}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl flex-shrink-0">
                  {chat.isPinned ? '' : ''}
                </span>
                <div className="min-w-0">
                  <p className="font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(chat.updatedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={(e) => toggleSave(chat, e)}
                  className={`p-2 rounded-lg transition-all ${
                    chat.isSaved
                      ? 'text-yellow-500'
                      : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {chat.isSaved ? '' : ''}
                </button>
                <button
                  onClick={(e) => handleDelete(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                  
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
