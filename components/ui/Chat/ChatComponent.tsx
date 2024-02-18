// components/ChatComponent.tsx
import React, { useState, useEffect } from 'react';
import { useChat } from 'app/hooks/useChat'
import DiscussionComponent from './DiscussionComponent';

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
    <div className="max-w-md mx-auto my-4">
      <h1 className="text-2xl font-bold text-center mb-4">Chat</h1>
      <DiscussionComponent messages={messages} />
      <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 p-2 border rounded shadow-sm"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;