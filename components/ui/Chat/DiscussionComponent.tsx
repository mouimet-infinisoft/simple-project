// components/DiscussionComponent.tsx
import React from 'react';
import MessageComponent from './MessageComponent';
import { ChatMessage } from 'types/ChatMessage'; // Adjust the import path as necessary

const DiscussionComponent = ({ messages }: { messages: ChatMessage[] }) => {
  return (
    <ul className="space-y-2 max-h-96 overflow-auto p-3">
      {messages.map((msg) => (
        <MessageComponent key={msg?.id} text={msg?.text} />
      ))}
    </ul>
  );
};

export default DiscussionComponent;
