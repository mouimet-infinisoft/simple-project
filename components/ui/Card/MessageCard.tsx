// MessageCard.js or MessageCard.tsx if using TypeScript
import { Message } from '@/app/assistant/page';
import { motion } from 'framer-motion';
import React from 'react';
import Markdown from 'react-markdown';
import gfm from 'remark-gfm';
import highlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

const MessageCard: React.FC<{ message: Message }> = ({ message }) => {
  // Determine the styling based on the message role
  const cardStyle =
    message.role === 'assistant'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-green-100 text-green-800';
  const alignment = message.role === 'assistant' ? 'self-start' : 'self-end';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} // Initial animation values
      animate={{ opacity: 1, scale: 1 }} // Animation states
      transition={{ duration: 0.75 }} // Animation duration
      className={`${cardStyle} ${alignment} mb-4 p-4 rounded-lg shadow`}
    >
      <Markdown remarkPlugins={[gfm]} rehypePlugins={[highlight]}>
        {message.content}
      </Markdown>
    </motion.div>
  );
};

export default MessageCard;
