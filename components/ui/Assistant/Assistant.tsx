'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '@/app/protected/assistant/page';
import MessageCard from '../Card/MessageCard';

const AssistantComponent: React.FC<{
  messages: Message[];
  active: boolean;
}> = ({ messages, active }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} // Initial animation values
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.9 }} // Animation states
      transition={{ duration: 0.5 }} // Animation duration
      className="discussion-component rounded-lg shadow-md px-8 py-6 flex flex-col items-center justify-center"
    >
      {messages.map((message, index) => (
        <MessageCard key={index} message={message} />
      ))}
    </motion.div>
  );
};

export default AssistantComponent;
