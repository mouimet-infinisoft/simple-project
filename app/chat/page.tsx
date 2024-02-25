// app/chat/page.tsx
"use client";
import React from 'react';
import ChatComponent from 'components/ui/Chat';
import { subscribeInsertMessage } from '@/utils/supabase/admin';

subscribeInsertMessage()

export default function ChatPage() {
  return (
    <div>
      <ChatComponent />
    </div>
  );
}

