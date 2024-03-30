// MessageCard.js or MessageCard.tsx if using TypeScript
import { Message } from '@/app/assistant/page';
import React from 'react';

const MessageCard: React.FC<{ message: Message }> = ({ message }) => {
  // Determine the styling based on the message role
  const cardStyle = message.role === 'assistant' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  const alignment = message.role === 'assistant' ? 'self-start' : 'self-end';

  return (
    <div className={`${cardStyle} ${alignment} mb-4 p-4 rounded-lg shadow`}>
      <p style={{ color: 'black' }}>{message.content}</p>
    </div>
  );
};

export default MessageCard;
