// ChatComponent.tsx
import React, { useState, useEffect } from 'react';
import { useChat } from 'app/hooks/useChat';
import DiscussionComponent from './DiscussionComponent';
import useSpeech2text from '@/app/hooks/useSpeech2text'; // Adjust the import path as necessary

const ChatComponent = () => {
  const { messages, sendMessage, fetchMessages } = useChat();
  const [message, setMessage] = useState('');

  const handleRecognizedSpeech = (recognizedSpeech: string) => {
    if (recognizedSpeech.includes('?')) {
      sendMessage(recognizedSpeech);
    } else {
      setMessage(recognizedSpeech);
    }
  };

  const { isRecognizing, startListening, stopListening } = useSpeech2text(handleRecognizedSpeech);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage('');
  };

  return (
    <div className="max-w-md mx-auto my-4 bg-gray-800 p-4 rounded-lg shadow">
      <h1 className="text-xl font-bold text-white mb-4">Chat</h1>
      <DiscussionComponent messages={messages} />
      <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type or speak your message here..."
          className="flex-1 p-2 border rounded shadow-sm bg-gray-700 text-white"
        />
        <button
          type="button"
          onClick={startListening}
          className={`px-4 py-2 rounded ${isRecognizing ? 'bg-red-500' : 'bg-green-500'} hover:bg-green-700 text-white font-bold`}
        >
          {isRecognizing ? 'Stop' : 'Speak'}
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;