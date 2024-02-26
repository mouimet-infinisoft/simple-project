import React, { useEffect, useRef } from 'react';
import MessageComponent from './MessageComponent';
import { ChatMessage } from 'types/ChatMessage'; // Adjust the import path as necessary

const DiscussionComponent = ({ messages }: { messages: ChatMessage[] }) => {
  // Ref for the messages container
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Introduce a slight delay to allow for the initial loading message rendering
    const timer = setTimeout(() => {
      const scrollHeight = containerRef.current?.scrollHeight ?? 0;
      const height = containerRef.current?.clientHeight ?? 0;
  
      // Scroll to the bottom of the message container
      containerRef.current?.scrollTo(0, scrollHeight - height);
    }, 100); // Adjust delay as needed
  
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  useEffect(() => {
    // Scroll the container to the bottom
    const scrollHeight = containerRef.current?.scrollHeight ?? 0;
    const height = containerRef.current?.clientHeight ?? 0;

    // Set the scrollTop to the height of the container minus the visible height
    containerRef.current?.scrollTo(0, scrollHeight - height);
  }, [messages]); // Run every time the messages array changes

  return (
    <div ref={containerRef} className="space-y-2 overflow-auto p-3" style={{maxHeight:'65vh'}}>
      {messages.map((msg) => (
        <MessageComponent key={msg.id} {...msg} />
      ))}
    </div>
  );
};

export default DiscussionComponent;
