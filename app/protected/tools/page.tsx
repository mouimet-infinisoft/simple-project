'use client';
import React from 'react';

import { motion } from 'framer-motion';
import { useBrainStack } from '@/utils/BrainStackProvider';
import { AbstractTool } from '@/utils/ibrain-assistant/tools/abstraction';
import ToolCard from './components/ToolCard';

export default function ToolsPage() {
  // const [messages, setMessages] = useState<Message[]>([]); // Adjusted to hold an array of Message objects
  const bstack = useBrainStack();

  const communications = bstack.store.getState((s) => s?.communications) ?? [];

  console.log(bstack.store.getState()?.iBrain?.listTools());
  const tools:AbstractTool[] = bstack.store.getState()?.iBrain?.listTools()??[];
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 2 }}
      >
        <div className="p-4 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <div className="text-3xl font-bold text-center mb-10">
              Our Tools
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {tools.map((tool, index) => (
                <ToolCard key={index} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
