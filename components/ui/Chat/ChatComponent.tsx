// components/ChatComponent.tsx
import React, { useState, useEffect } from 'react';
import { useChat } from 'app/hooks/useChat'

const ChatComponent = () => {
  const { messages, sendMessage, fetchMessages } = useChat();
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage('');
  };

  return (
    <div>
      <h1>Chat</h1>
      <ul>
        {messages.map((msg) => (
          <li key={msg?.id}>{msg?.text}</li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;
