import React, { useState, useEffect } from 'react';
import { useChat } from 'app/hooks/useChat';
import DiscussionComponent from './DiscussionComponent';
import useSpeech2text from '@/app/hooks/useSpeech2text';

const ChatComponent = () => {
  const { messages, sendMessage, fetchMessages } = useChat();
  const [message, setMessage] = useState('');

  // Define the onTrigger function that will update the message state
  const handleRecognizedSpeech = (recognizedSpeech: string) => {
    setMessage(recognizedSpeech);
  };

  // Initialize speech-to-text hook with the onTrigger function
  const {
    userSpeech,
    startListening,
    stopListening,
    isRecognizing,
  } = useSpeech2text(handleRecognizedSpeech); // This now correctly passes the required onTrigger function

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // This useEffect becomes redundant if handleRecognizedSpeech directly sets the message,
  // so you might consider removing it if you don't need to perform additional operations
  // when userSpeech updates.

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage('');
    if (isRecognizing) {
      stopListening(); // Stop listening after sending the message
    }
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
          onClick={isRecognizing ? stopListening : startListening}
          className={`px-4 py-2 rounded ${isRecognizing ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'} text-white font-bold`}
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
