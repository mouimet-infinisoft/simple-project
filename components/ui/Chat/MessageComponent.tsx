import { ChatMessage } from '@/types/ChatMessage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

// components/MessageComponent.tsx

const MessageComponent = ({ text, role }: ChatMessage) => {
  // Conditional class names based on the role
  const messageStyles: Record<string, string> = {
    base: 'rounded-md p-2 mb-2 shadow text-white',
    user: 'bg-blue-600 text-right', // Right align for "me" messages
    ibrain: 'bg-green-600 text-left' // Left align for "ibrain" messages
  };

  // Combine base styles with conditional styles
  const combinedStyles = `${messageStyles.base} ${messageStyles[role]}`;

  return (
    <ReactMarkdown className={combinedStyles} remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    // <li className={combinedStyles}>
    //   {role}:<ReactMarkdown className={combinedStyles}>{role}:{text}</ReactMarkdown>
    // </li>
  );
};

export default MessageComponent;
