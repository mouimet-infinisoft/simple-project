'use client';

// useSpeech2text.ts
import { useCallback, useEffect, useRef } from 'react';

type OnTriggerFunction = (speech: string) => void;
const SpeechRecognition =
  (global?.window as any)?.SpeechRecognition ||
  (global?.window as any)?.webkitSpeechRecognition;

const useSpeech2text = (onTrigger: OnTriggerFunction) => {
  const recognition = useRef<typeof SpeechRecognition | null>(null);
  const isRecognizingRef = useRef<boolean>(false);

  useEffect(() => {
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event: any) => {
        console.log(event);
        const transcript = Array.from(event.results)
          .map((result: any) => result?.[0].transcript)
          .join('');
        onTrigger(transcript);
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
      };
    }

    return stopListening;
  }, []);

  const startListening = useCallback(() => {
    recognition.current?.start();
    isRecognizingRef.current = true;
  }, []);

  const stopListening = useCallback(() => {
    recognition.current?.stop();
    isRecognizingRef.current = false;
  }, []);

  return {
    isRecognizing: isRecognizingRef.current,
    startListening,
    stopListening
  };
};

export default useSpeech2text;
