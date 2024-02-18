// components/MessageComponent.tsx
const MessageComponent = ({ text }: { text: string }) => {
  return (
    <li className="bg-blue-600 text-white rounded-md p-2 mb-2 shadow">
      {text}
    </li>
  );
};

export default MessageComponent;
