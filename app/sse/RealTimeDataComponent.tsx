"use client"
import React, { useState } from 'react';
import { useSSE } from './useSSE';

const RealTimeDataComponent = () => {
  const [messages, setMessages] = useState<any[]>([]);

  useSSE('https://simple-project-tau.vercel.app/api/sse', (data) => {
    setMessages((prevMessages) => [...prevMessages, data]);
  });

  return (
    <div>
      <h1>Real-Time Data</h1>
      {messages.map((message, index) => (
        <div key={index}>
          Message: {message.message}, Time: {message.time}
        </div>
      ))}
    </div>
  );
};

export default RealTimeDataComponent;
