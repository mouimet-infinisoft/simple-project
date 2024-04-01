'use client';
import React from 'react';

import { motion } from 'framer-motion';
import { useBrainStack } from '@/utils/BrainStackProvider';
import AddDatabase from './components/AddDatabase';


export default function DatabaseToolsPage() {
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
        Database Tools List Page
        <AddDatabase />
      </motion.div>
    </>
  );
}
