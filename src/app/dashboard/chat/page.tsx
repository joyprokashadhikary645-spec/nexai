// src/app/dashboard/chat/page.tsx

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import ChatWindow from '@/components/dashboard/ChatWindow';
import ChatInput from '@/components/dashboard/ChatInput';

export default function ChatPage() {
  const { user } = useAuth();
  const { messages, isSending, sendMessage } = useChat();

  const handleSend = (message: string) => {
    sendMessage(message, user?.language || 'en');
  };

  return (
    <div className="flex flex-col h-full">
      <ChatWindow messages={messages} isSending={isSending} />
      <ChatInput onSend={handleSend} isSending={isSending} />
    </div>
  );
}
