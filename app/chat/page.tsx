// app/chat/page.tsx
'use client';
import React, { useEffect } from 'react';
import ChatComponent from 'components/ui/Chat';
import { createClient } from '@/utils/supabase/client';

const subscribeInsertMessage = () => {
  const supabase = createClient();

  const channels = supabase
    .channel('custom-insert-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        if (String(payload?.new?.role).includes('ibrain')) {
          console.log('Change received!', payload);
          speak(String(payload?.new?.text))
        }
      }
    )
    .subscribe();
};

const speak = (text:string) => {
  const sentences = text.split(/(?<=[.!?])/);

  sentences.forEach((sentence) => {
    const trimmedSentence = sentence.trim();
    if (trimmedSentence) {
      const utterance = new SpeechSynthesisUtterance(trimmedSentence);
      utterance.lang = "en";
      utterance.voice = window.speechSynthesis.getVoices()[87];

      utterance.onstart = () => {
        // bstack.store.emit("audio.stopListening");
      };

      utterance.onend = () => {
        // bstack.store.emit("audio.startListening");
      };

      window.speechSynthesis.speak(utterance);
    }
  });
}

export default function ChatPage() {
  useEffect(() => {
    subscribeInsertMessage();
  }, []);
  return (
    <div>
      <ChatComponent />
    </div>
  );
}
