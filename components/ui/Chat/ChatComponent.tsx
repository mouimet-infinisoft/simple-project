import React, { useEffect } from 'react';
import { useChat } from 'app/hooks/useChat';
import DiscussionComponent from './DiscussionComponent';
import ChatInputComponent from './ChatInputComponent';

const ChatComponent = () => {
  const { messages, sendMessage, fetchMessages } = useChat();

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className="mx-auto my-4 p-4 rounded-lg shadow bg-gray-800 w-full" style={{maxWidth:"80vw"}}>
      <h1 className="text-xl font-bold text-white mb-4">Chat</h1>
      <DiscussionComponent messages={messages} />
      <ChatInputComponent sendMessage={sendMessage} />
    </div>
  );
};

export default ChatComponent;
