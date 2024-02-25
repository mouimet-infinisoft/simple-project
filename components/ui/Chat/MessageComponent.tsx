import { ChatMessage } from '@/types/ChatMessage';
import ReactMarkdown from 'react-markdown';

// components/MessageComponent.tsx

const MessageComponent = ({ text, role }: Partial<ChatMessage>) => {
  // Conditional class names based on the role
  const messageStyles = {
    base: 'rounded-md p-2 mb-2 shadow text-white',
    me: 'bg-blue-600 text-right', // Right align for "me" messages
    ibrain: 'bg-green-600 text-left' // Left align for "ibrain" messages
  };

  // Combine base styles with conditional styles
  const combinedStyles = `${messageStyles.base} ${role === 'user' ? messageStyles.me : messageStyles.ibrain}`;

  return (
    <li className={combinedStyles}>
      {role}:<ReactMarkdown>{text}</ReactMarkdown>
    </li>
  );
};

export default MessageComponent;
