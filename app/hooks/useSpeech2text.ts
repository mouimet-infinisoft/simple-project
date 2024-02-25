"use client"

// useSpeech2text.ts
import { useCallback, useEffect, useRef, useState } from 'react';

type OnTriggerFunction = (speech: string) => void;

const useSpeech2text = (onTrigger: OnTriggerFunction) => {
  const SpeechRecognition =
    (window as any)?.SpeechRecognition ||
    (window as any)?.webkitSpeechRecognition;
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const recognition = useRef<typeof SpeechRecognition | null>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.error('Speech Recognition is not supported by this browser.');
      return;
    }

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

    return () => {
      recognition.current?.stop();
    };
  }, [onTrigger]);

  const startListening = useCallback(() => {
    recognition.current?.start();
    setIsRecognizing(true);
  }, []);

  const stopListening = useCallback(() => {
    recognition.current?.stop();
    setIsRecognizing(false);
  }, []);

  return { isRecognizing, startListening, stopListening };
};

export default useSpeech2text;
