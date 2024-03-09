'use client';
import { useEffect, useMemo } from 'react';
import { useBrainStack } from '../../utils/BrainStackProvider';
import useCommunicationManager from './useCommunicationManager';

const SpeechRecognition =
  (global?.window as any)?.SpeechRecognition ||
  (global?.window as any)?.webkitSpeechRecognition;

const useSpeech2text = () => {
  const bstack = useBrainStack();
  const { addUserCommunication } = useCommunicationManager();

  const startListening = () => {
    try {
      const recognition = bstack.store.getState((s) => s?.recognition);
      const isRecognizing = bstack.store.getState((s) => s?.isRecognizing);

      if (!isRecognizing) {
        recognition?.start();
        bstack.log.verbose('Started listening...');
      }
    } catch (e) {}
  };

  const stopListening = () => {
    const recognition = bstack.store.getState((s) => s?.recognition);
    const isRecognizing = bstack.store.getState((s) => s?.isRecognizing);

    if (isRecognizing) {
      recognition?.abort();
      bstack.log.verbose('Stopped listening...');
    }
  };

  bstack.useOn('speech.speaking', stopListening, []);
  bstack.useOn('speech.silent', startListening, []);

  const changeLanguage = (newLanguage: string) => {
    bstack.store.mutate((s) => ({ ...s, language: newLanguage }));
    bstack.log.verbose(`Language changed to ${newLanguage}`);
  };

  useEffect(() => {
    if (!SpeechRecognition) {
      bstack.log.error('Speech Recognition is not supported by this browser.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.lang =
      bstack.store.getState((s) => s?.language) ?? 'en-US';

    recognitionInstance.onstart = () => {
      bstack.store.mutate((s) => ({ ...s, isRecognizing: true }));
      bstack.log.verbose('Recognition started...');
    };

    recognitionInstance.onend = () => {
      bstack.store.mutate((s) => ({ ...s, isRecognizing: false }));
      bstack.log.verbose('Recognition ended...');
      startListening();
    };

    recognitionInstance.onresult = (event: any) => {
      const transcript =
        event.results?.[event.results?.length - 1]?.[0]?.transcript;
      bstack.log.verbose('Speech recognition result received: ', event);
      addUserCommunication(transcript);
    };

    recognitionInstance.onerror = (event: any) => {
      bstack.log.error('Speech recognition error', event);
    };

    bstack.store.mutate((s) => ({ ...s, recognition: recognitionInstance }));

    return () => {
      stopListening();
    };
  }, []);

  return {
    isRecognizing: false,
    startListening,
    stopListening,
    changeLanguage
  };
};

export default useSpeech2text;
