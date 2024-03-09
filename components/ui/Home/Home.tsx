'use client';
import React, { useEffect } from 'react';
import { FeatureList } from '../FeatureList';
import { Hero } from '../Hero';
import useCommunicationManager from '@/app/hooks/useCommunicationManager';
import useSpeech2text from '@/app/hooks/useSpeech2text';
import { useDevTools } from '@/app/hooks/useDevTool';
import useTextToSpeech from '@/app/hooks/useText2Speech';
import { useBrainStack, core } from '@/app/page';
import Button from '../Button';

const features = [
  {
    title: 'Talk with your data',
    description: 'Easily access and analyze your data through voice commands.'
  },
  {
    title: 'Easy for non-technical users',
    description:
      'No coding required, anyone can interact with data using natural language.'
  },
  {
    title: 'Business at your fingertips',
    description:
      'Get real-time insights and make data-driven decisions on the go.'
  },
  {
    title: 'Instantaneous',
    description: 'Get immediate results to your voice queries without delays.'
  },
  {
    title: 'Easy multi-language',
    description:
      'Interact with your data in multiple languages for broader accessibility.'
  },
  {
    title: 'No learning curve',
    description:
      'Start using the platform instantly, no need for extensive training.'
  },
  {
    title: 'Almost no config',
    description: 'Minimal setup required, get up and running quickly.'
  }
];

const HomeComponent: React.FC<{}> = () => {
  const bstack = useBrainStack();
  const { addUserCommunication, onAiCommunication, addAiCommunication } =
    useCommunicationManager();
  const { isRecognizing, startListening, stopListening } = useSpeech2text();
  const { aiSpeak } = useTextToSpeech();
  useDevTools(core);
  const handleAiCommunication = (message: string) => {
    // Speak the AI response when received
    aiSpeak(message);
  };

  // Subscribe to AI communication events
  useEffect(() => {
    return onAiCommunication(handleAiCommunication);
  }, []);

  // Trigger speech recognition when the page loads
  useEffect(() => {
    startListening();
    return () => stopListening();
  }, []);

  return (
    <div>
      <Hero
        title="Welcome to your App!"
        subtitle="This is a great hero section with animation and call to action."
        buttonText="Get Started"
        buttonLink="/"
      />
      <Button
        onClick={() => {
          addAiCommunication('Steve my bollz!');
        }}
      >
        Speak
      </Button>
      <FeatureList features={features} />
    </div>
  );
};

export default HomeComponent;
