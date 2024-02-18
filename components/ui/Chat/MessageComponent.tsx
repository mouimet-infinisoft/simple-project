// components/MessageComponent.tsx
const MessageComponent = ({ text }: { text: string }) => {
    return (
      <li className="bg-blue-100 rounded-md p-2 mb-2 shadow">
        {text}
      </li>
    );
  };
  
  export default MessageComponent;
  