// src/app/dashboard/chat/[id]/page.tsx

'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import ChatWindow from '@/components/dashboard/ChatWindow';
import ChatInput from '@/components/dashboard/ChatInput';
import Loading from '@/components/common/Loading';

export default function ChatByIdPage() {
  const params = useParams();
  const chatId = params.id as string;
  const { user } = useAuth();
  const { messages, isSending, isLoadingHistory, sendMessage, loadChat } = useChat(chatId);

  useEffect(() => {
    if (chatId) loadChat(chatId);
  }, [chatId, loadChat]);

  const handleSend = (message: string) => {
    sendMessage(message, user?.language || 'en');
  };

  if (isLoadingHistory) {
    return <Loading fullScreen text="Loading chat..." />;
  }

  return (
    <div className="flex flex-col h-full">
      <ChatWindow messages={messages} isSending={isSending} />
      <ChatInput onSend={handleSend} isSending={isSending} />
    </div>
  );
}
