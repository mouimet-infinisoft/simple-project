import React, { useEffect } from 'react';
import { useChat } from 'app/hooks/useChat';
import DiscussionComponent from './DiscussionComponent';
import ChatInputComponent from './ChatInputComponent';
import './ChatStyles.css'; 

const ChatComponent = () => {
  const { messages, sendMessage, fetchMessages } = useChat();

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className="chatOverlay">
      <h1 className="text-xl font-bold text-white mb-4">Chat</h1>
      <DiscussionComponent messages={messages} />
      <ChatInputComponent sendMessage={sendMessage} />
    </div>
  );
};

export default ChatComponent;
