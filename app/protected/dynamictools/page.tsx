'use client';
import React from 'react';

import { motion } from 'framer-motion';
import { useBrainStack } from '@/utils/BrainStackProvider';


export default function DynamicToolsListPage() {
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
        Dynamic Tools List Page
      </motion.div>
    </>
  );
}
