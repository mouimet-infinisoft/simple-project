// hooks/useChat.ts
import { useState, useCallback } from 'react';
import type { ChatMessage } from 'types/ChatMessage';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const fetchMessages = useCallback(() => {
    fetch('/api/chat')
      .then((res) => res.json())
      .then(setMessages)
      .catch((error) => console.error("Failed to fetch messages:", error));
  }, []);

  const sendMessage = async (text: string) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      fetchMessages(); // Refresh messages after sending
    } else {
      console.error('Failed to send message:', await res.text());
    }
  };

  return { messages, sendMessage, fetchMessages };
};
