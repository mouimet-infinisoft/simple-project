// app/chat/page.tsx

"use client"
import React, { useState, useEffect, useCallback } from 'react';

type ChatMessage = {
  id: number;
  text: string;
};

export default function ChatComponent() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Encapsulate the fetching logic in a useCallback hook
  const fetchMessages = useCallback(() => {
    fetch('/api/chat')
      .then((res) => res.json())
      .then((fetchedMessages) => {
        setMessages(fetchedMessages);
      })
      .catch((error) => console.error("Failed to fetch messages:", error));
  }, []);

  useEffect(() => {
    // Call fetchMessages when the component mounts
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Send the new message
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });

    if (res.ok) {
      const newMessage = await res.json();
      // Optionally call fetchMessages to refresh the list from the server
      // This approach might be preferred if there's additional logic on the server side
      // that affects the returned messages (e.g., filtering, sorting).
      fetchMessages();
    } else {
      console.error('Failed to send message:', await res.text());
    }

    setMessage(''); // Clear the input after sending
  };

  return (
    <div>
      <h1>Chat</h1>
      <ul>
        {messages.map((msg) => (
          <li key={msg?.id}>{msg?.text}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
