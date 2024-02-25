// app/chat/page.tsx
'use client';
import React, { useEffect } from 'react';
import ChatComponent from 'components/ui/Chat';
import { createClient } from '@/utils/supabase/client';

const subscribeInsertMessage = () => {
  const supabase = createClient();


  const channels = supabase.channel('custom-insert-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages', filter:"role=ibrain" },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
};

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
