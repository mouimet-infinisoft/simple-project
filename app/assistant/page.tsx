'use client';
import { AssistantComponent } from '@/components/ui/Assistant';
import React, { useState, useEffect } from 'react';
import { core, useBrainStack } from '../../utils/BrainStackProvider';
import useCommunicationManager from '../hooks/useCommunicationManager';
import { useDevTools } from '../hooks/useDevTool';
import useSpeech2text from '../hooks/useSpeech2text';
import useTextToSpeech from '../hooks/useText2Speech';
import { motion } from 'framer-motion';
import useIBrain from '../hooks/useIBrain';
import useAuthorization from '../hooks/useAuthorization';

export default function AssistantPage() {
  // useAuthorization();
  // const bstack = useBrainStack();
  // useIBrain();
  // const { onAiCommunication } = useCommunicationManager();
  // const { isRecognizing, startListening, stopListening } = useSpeech2text();
  // const { aiSpeak } = useTextToSpeech();
  // useDevTools(core);

  // useEffect(() => {
  //   const handleAiCommunication = async (message: string) => {
  //     aiSpeak(message);
  //     setTopicMessage(message);
  //   };

  //   return onAiCommunication(handleAiCommunication);
  // }, []);

  // useEffect(() => {
  //   startListening();
  //   return () => stopListening();
  // }, []);

  const [topicMessage, setTopicMessage] = useState('');

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }} // Initial animation values
        animate={{ opacity: 1, y: 0 }} // Animation states
        exit={{ opacity: 0, y: -20 }} // Animation states
        transition={{ duration: 2 }} // Animation duration
      >
        <AssistantComponent
          key={topicMessage}
          topic={topicMessage}
          active={Boolean(topicMessage?.length > 0)}
        />
      </motion.div>
    </>
  );
}
