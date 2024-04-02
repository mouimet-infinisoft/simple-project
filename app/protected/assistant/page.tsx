'use client';
import { AssistantComponent } from '@/components/ui/Assistant';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TaskComponent } from '@/components/ui/TaskManager';
import { core, useBrainStack } from '@/utils/BrainStackProvider';
import useIBrain from '@/app/hooks/useIBrain';

// If you're using TypeScript, define an interface
export interface Message {
  content: string;
  role: 'user' | 'assistant';
}

export default function AssistantPage() {
  const bstack = useBrainStack();
  useIBrain()

  const communications = bstack.store.getState((s) => s?.communications) ?? [];

  useEffect(() => {
    if (window && window?.localStorage?.getItem('micPermissionGranted') && core.store.getState()?.userData?.is_onboarding_complete) {
      core.store.emit('ibrain.talk', {
        system:   `As iBrain, you welcome back the user! It's great to see user coming back. The user is already signed in and onboarding process is complete. Suggest to the user if he wants to proceed and connect his first database?`,
        instructions: 'Hi.'
      });
    }
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 2 }}
      >
        <AssistantComponent
          messages={communications} // Passing the entire messages array
          active={communications.length > 0}
        />
        <TaskComponent />
      </motion.div>
    </>
  );
}
