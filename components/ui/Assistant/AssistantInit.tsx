'use client';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import useAuthorization from '@/app/hooks/useAuthorization';
import useCommunicationManager from '@/app/hooks/useCommunicationManager';
import { useDevTools } from '@/app/hooks/useDevTool';
import useSpeech2text from '@/app/hooks/useSpeech2text';
import useTextToSpeech from '@/app/hooks/useText2Speech';
import { useBrainStack, core } from '@/utils/BrainStackProvider';
import { VoicePermissionAlert } from '@/components/ui/VoicePermissionAlert'; // Import the VoicePermissionAlert component


  let window:any = global?.window ? global.window :  {};

const AssistantInit = ({ children }: PropsWithChildren<any>) => {
  useAuthorization();
  const bstack = useBrainStack();
  const { onAiCommunication } = useCommunicationManager();
  const { isRecognizing, startListening, stopListening } = useSpeech2text();
  const { aiSpeak } = useTextToSpeech();
  useDevTools(core);

  const [micPermissionGranted, setMicPermissionGranted] = useState(
    Boolean(window?.localStorage?.getItem('micPermissionGranted') ?? false)
  );
  const [showVoiceAlert, setShowVoiceAlert] = useState(
    !Boolean(window?.localStorage?.getItem('micPermissionGranted') ?? false)
  ); // New state to control the visibility of the VoicePermissionAlert

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
    if (micPermissionGranted) {
      core.store.emit('ibrain.talk', {
        // Updated prompt for the LLM to generate a more engaging and informative introduction
        system: `As iBrain, you welcome back the user! It's great to see user coming back. As always, you are here to assist with a wide range of tasks, from providing detailed insights to facilitating easy sign-ins. Remember, the first 14 days are free, allowing the user to fully experience what  you can offer without any commitment. 

        Signing in is incredibly straightforward – just a simple voice command away, whether user prefer Google, GitHub, or email. And, of course, you multilingual support is here to ensure you can interact in the language user most comfortable with.
        
        Ask user if there anything specific he like to know more about today? Perhaps more details on your services or how to start your free trial?.
        `,
        instructions: 'Hi.'
      });
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
      {!micPermissionGranted && showVoiceAlert && (
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
