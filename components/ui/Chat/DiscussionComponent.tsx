import React, { useEffect, useRef } from 'react';
import MessageComponent from './MessageComponent';
import { ChatMessage } from 'types/ChatMessage'; // Adjust the import path as necessary

const DiscussionComponent = ({ messages }: { messages: ChatMessage[] }) => {
  // Ref for the messages container
  const containerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Scroll the container to the bottom
    const scrollHeight = containerRef.current?.scrollHeight ?? 0;
    const height = containerRef.current?.clientHeight ?? 0;

    // Set the scrollTop to the height of the container minus the visible height
    containerRef.current?.scrollTo(0, scrollHeight - height);
  }, [messages]); // Run every time the messages array changes

  return (
    <ul ref={containerRef} className="space-y-2 max-h-96 overflow-auto p-3">
      {messages.map((msg) => (
        <MessageComponent key={msg.id} {...msg}/>
      ))}
    </ul>
  );
};

export default DiscussionComponent;
