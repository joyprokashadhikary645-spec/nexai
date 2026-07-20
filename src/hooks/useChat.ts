// src/hooks/useChat.ts

'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || '',
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const useChat = (initialChatId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | undefined>(initialChatId);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // চ্যাটের পুরনো মেসেজ লোড করুন
  const loadChat = useCallback(async (id: string) => {
    setIsLoadingHistory(true);
    try {
      const { data } = await apiClient.get(`/api/chats/${id}`);
      setChatId(data.data.id);
      setMessages(
        data.data.messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        }))
      );
    } catch (error) {
      toast.error('চ্যাট লোড করা যায়নি');
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // বার্তা পাঠান (স্ট্রিমিং — টেক্সট আসতে আসতেই দেখা যাবে)
  const sendMessage = useCallback(
    async (content: string, language: string = 'en') => {
      if (!content.trim()) return;

      // ব্যবহারকারীর বার্তা তাৎক্ষণিকভাবে UI তে দেখান (optimistic update)
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content,
      };
      const assistantId = `stream-${Date.now()}`;
      setMessages((prev) => [...prev, tempUserMessage, { id: assistantId, role: 'assistant', content: '' }]);
      setIsSending(true);

      try {
        const token = getToken();
        const response = await fetch('/api/ai/chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ chatId, message: content, language }),
        });

        if (!response.ok || !response.body) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'বার্তা পাঠাতে ব্যর্থ হয়েছে');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            let event: any;
            try {
              event = JSON.parse(line);
            } catch {
              continue;
            }

            if (event.type === 'meta') {
              setChatId(event.chatId);
            } else if (event.type === 'chunk') {
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + event.text } : m))
              );
            } else if (event.type === 'error') {
              toast.error(event.message || 'বার্তা পাঠাতে ব্যর্থ হয়েছে');
            }
          }
        }
      } catch (error: any) {
        toast.error(error.message || 'বার্তা পাঠাতে ব্যর্থ হয়েছে');
        // ব্যর্থ হলে ব্যবহারকারীর বার্তা ও খালি assistant বার্তা সরিয়ে ফেলুন
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id && m.id !== assistantId));
      } finally {
        setIsSending(false);
      }
    },
    [chatId]
  );

  // নতুন চ্যাট শুরু করুন
  const newChat = useCallback(() => {
    setChatId(undefined);
    setMessages([]);
  }, []);

  return {
    messages,
    chatId,
    isSending,
    isLoadingHistory,
    sendMessage,
    loadChat,
    newChat,
  };
};
