import React, { useEffect, useRef } from 'react';
import MessageComponent from './MessageComponent';
import { ChatMessage } from 'types/ChatMessage'; // Adjust the import path as necessary

const DiscussionComponent = ({ messages }: { messages: ChatMessage[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Method to handle scrolling to the bottom
  const scrollToBottom = () => {
    const scrollHeight = containerRef.current?.scrollHeight ?? 0;
    const height = containerRef.current?.clientHeight ?? 0;
    containerRef.current?.scrollTo(0, scrollHeight - height);
  };

  useEffect(() => {
    // Delayed scroll for initial load
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 3500); // Adjust delay as needed
  
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []); // This effect runs once on mount

  useEffect(() => {
    // Immediate scroll when messages update
    scrollToBottom();
  }, [messages]); // This effect runs every time the messages array changes

  return (
    <div ref={containerRef} className="space-y-2 overflow-auto p-3" style={{ maxHeight: '65vh' }}>
      {messages?.map?.((msg) => (
        <MessageComponent key={msg.id} {...msg} />
      ))}
    </div>
  );
};

export default DiscussionComponent;
