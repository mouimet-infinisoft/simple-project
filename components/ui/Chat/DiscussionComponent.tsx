import React, { useEffect, useRef } from 'react';
import MessageComponent from './MessageComponent';
import { ChatMessage } from 'types/ChatMessage'; // Adjust the import path as necessary

const DiscussionComponent = ({ messages }: { messages: ChatMessage[] }) => {
  // Create a ref for the messages container
  const messagesEndRef = useRef<any>(null);

  // Effect to scroll to the bottom of the messages container
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Dependency array ensures this runs every time `messages` changes

  return (
    <ul className="space-y-2 max-h-96 overflow-auto p-3">
      {messages.map((msg) => (
        <MessageComponent key={msg.id} text={msg.text} />
      ))}
      {/* Invisible element at the end of the messages */}
      <div ref={messagesEndRef} />
    </ul>
  );
};

export default DiscussionComponent;
