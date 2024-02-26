import React, { useState } from 'react';
import useSpeech2text from '@/app/hooks/useSpeech2text'; // Make sure this import path matches your project structure

interface ChatInputComponentProps {
  sendMessage: (message: string) => Promise<void>;
}

const ChatInputComponent: React.FC<ChatInputComponentProps> = ({
  sendMessage
}) => {
  const [message, setMessage] = useState('');

  const onRecognizedSpeech = async (recognizedSpeech: string) => {
    await handleSpeechRecognitionResult(recognizedSpeech)
    // if (recognizedSpeech.includes('?')) {
    //   await sendMessage(message + ' ' + recognizedSpeech);
    //   setMessage('');
    // } else {
    //   setMessage((prev) => prev + ' ' + recognizedSpeech);
    // }
  };

  const { isRecognizing, startListening, stopListening } = useSpeech2text(
    onRecognizedSpeech
  );

  const handleSpeechRecognitionResult = async (recognizedSpeech: string) => {
    if (recognizedSpeech.includes('?')) {
      stopListening();
      const msg = message;
      setMessage('');
      await sendMessage(msg + ' ' + recognizedSpeech);
    } else {
      setMessage((prev) => prev + ' ' + recognizedSpeech);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type or speak your message here..."
        className="flex-1 p-2 border rounded shadow-sm bg-gray-700 text-white"
      />
      {!isRecognizing && (
        <button
          type="button"
          onClick={startListening}
          className="px-4 py-2 rounded bg-green-500 hover:bg-green-700 text-white font-bold"
        >
          Speak
        </button>
      )}
      {isRecognizing && (
        <button
          type="button"
          onClick={stopListening}
          className="px-4 py-2 rounded bg-red-500 hover:bg-red-700 text-white font-bold"
        >
          Stop
        </button>
      )}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInputComponent;
