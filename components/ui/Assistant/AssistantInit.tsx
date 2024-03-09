'use client';
import useAuthorization from '@/app/hooks/useAuthorization';
import useCommunicationManager from '@/app/hooks/useCommunicationManager';
import { useDevTools } from '@/app/hooks/useDevTool';
import useIBrain from '@/app/hooks/useIBrain';
import useSpeech2text from '@/app/hooks/useSpeech2text';
import useTextToSpeech from '@/app/hooks/useText2Speech';
import { useBrainStack, core } from '@/utils/BrainStackProvider';
import React, { PropsWithChildren, useEffect, useState } from 'react';

const AssistantInit = ({ children }: PropsWithChildren) => {
  useAuthorization();
  const bstack = useBrainStack();
  useIBrain();
  const { onAiCommunication } = useCommunicationManager();
  const { isRecognizing, startListening, stopListening } = useSpeech2text();
  const { aiSpeak } = useTextToSpeech();
  useDevTools(core);

  useEffect(() => {
    const handleAiCommunication = async (message: string) => {
      aiSpeak(message);
      setTopicMessage(message);
    };

    return onAiCommunication(handleAiCommunication);
  }, []);

  useEffect(() => {
    startListening();
    return () => stopListening();
  }, []);

  const [topicMessage, setTopicMessage] = useState('');
  
  return <>{children}</>;
};

export default AssistantInit;
