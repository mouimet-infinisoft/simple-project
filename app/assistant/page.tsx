'use client';
import { AssistantComponent } from '@/components/ui/Assistant';
import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
// import useCommunicationManager from '../hooks/useCommunicationManager';
import { TaskComponent } from '@/components/ui/TaskManager';
import { useBrainStack } from '@/utils/BrainStackProvider';

// If you're using TypeScript, define an interface
export interface Message {
  content: string;
  role: 'user' | 'assistant';
}

export default function AssistantPage() {
  // const [messages, setMessages] = useState<Message[]>([]); // Adjusted to hold an array of Message objects
  const bstack = useBrainStack()

  const communications = bstack.store.getState(s=>s?.communications) ?? []

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 2 }}
      >
        <AssistantComponent
          // key={communications.length} // Using the length of messages as a key to trigger re-renders
          messages={communications} // Passing the entire messages array
          active={communications.length > 0}
        />
        <TaskComponent />
      </motion.div>
    </>
  );
}
