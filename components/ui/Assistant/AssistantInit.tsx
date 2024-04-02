'use client';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import useAuthorization from '@/app/hooks/useAuthorization';
import useCommunicationManager from '@/app/hooks/useCommunicationManager';
import { useDevTools } from '@/app/hooks/useDevTool';
import useSpeech2text from '@/app/hooks/useSpeech2text';
import useTextToSpeech from '@/app/hooks/useText2Speech';
import { useBrainStack, core } from '@/utils/BrainStackProvider';
import { VoicePermissionAlert } from '@/components/ui/VoicePermissionAlert'; // Import the VoicePermissionAlert component

const AssistantInit = ({ children }: PropsWithChildren<any>) => {
  useAuthorization();
  const bstack = useBrainStack();
  const { onAiCommunication } = useCommunicationManager();
  const { isRecognizing, startListening, stopListening } = useSpeech2text();
  const { aiSpeak } = useTextToSpeech();
  useDevTools(core);

  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [showVoiceAlert, setShowVoiceAlert] = useState(true);

  useEffect(() => {
    if (micPermissionGranted) {
      const handleAiCommunication = async (message: string) => {
        aiSpeak(message);
      };

      return onAiCommunication(handleAiCommunication);
    }
  }, [micPermissionGranted]);

  useEffect(() => {
    if (micPermissionGranted) {
      startListening();
      return () => stopListening();
    }
  }, [micPermissionGranted]);

  useEffect(() => {
    if (window && window?.localStorage?.getItem('micPermissionGranted')) {
      setShowVoiceAlert(false);
      setMicPermissionGranted(true);
    }
  }, []);

  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermissionGranted(true);
      core.store.emit('ibrain.introduce');
      setShowVoiceAlert(false);
      console.log('Mic permission granted');
      window?.localStorage.setItem('micPermissionGranted', 'true'); // Set the flag in localStorage
    } catch (error) {
      console.error('Microphone access denied.', error);
      setMicPermissionGranted(false);
      // Consider removing or not setting the flag here, as permission was denied
    }
  };

  // Function to handle closing the VoicePermissionAlert
  const handleCloseAlert = () => {
    setShowVoiceAlert(false); // Hide the alert
  };

  return (
    <>
      {showVoiceAlert && (
        <VoicePermissionAlert
          requestMicPermission={requestMicPermission}
          onClose={handleCloseAlert} // Pass the handleCloseAlert function to the VoicePermissionAlert
        />
      )}
      {children}
    </>
  );
};

export default AssistantInit;
