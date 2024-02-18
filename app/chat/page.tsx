"use client"
import { useState, useEffect } from 'react';

type ChatMessage = {
  id: number;
  text: string;
};

export default function () {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Fetch existing messages
    fetch('/api/chat')
      .then((res) => res.json())
      .then(setMessages);
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Send the new message
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });
    const newMessage = await res.json();

    setMessages((prev) => [...prev, newMessage]);
    setMessage(''); // Clear the input after sending
  };

  return (
    <div>
      <h1>Simple Chat</h1>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>{msg.text}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
