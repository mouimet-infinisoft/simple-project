'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

const SpeechRecognition =
  (global?.window as any)?.SpeechRecognition ||
  (global?.window as any)?.webkitSpeechRecognition;

const useSpeech2text = (onTrigger: (speech: string) => Promise<void>) => {
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const recognition = useRef<typeof SpeechRecognition | null>(null);

  const startListening = () => {
    try {
      console.log('const startListening = useCallback(() => {');
      if (!isRecognizing) {
        recognition.current?.start();
        setIsRecognizing(true);
      }
    } catch (err) {}
  };

  const stopListening = () => {
    try {
      console.log('const stopListening = useCallback(() => {');
      if (isRecognizing) {
        recognition.current?.abort();
      }
    } catch (err) {
    } finally {
      setIsRecognizing(false);
    }
  };

  useEffect(() => {
    if (!SpeechRecognition) {
      console.error('Speech Recognition is not supported by this browser.');
      return;
    }

    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.lang = 'en-US';
    recognition.current.onresult = async (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result?.[0]?.transcript)
        .join('');
      await onTrigger(transcript);
    };

    recognition.current.onerror = (event: any) => {
      if (String(event?.error).includes('no-speech')) {
        setIsRecognizing(false);
        startListening();
      } else if (String(event?.error).includes('abort')) {
      } else {
        console.error('Speech recognition error', event);
      }
    };

    return () => {
      stopListening();
    };
  }, []);

  useEffect(() => {
    // Listen for custom events to start/stop recognition
    window.addEventListener('isTalking', stopListening);
    window.addEventListener('isSilent', startListening);

    return () => {
      window.removeEventListener('isTalking', stopListening);
      window.removeEventListener('isSilent', startListening);
    };
  }, [startListening, stopListening]);

  return { isRecognizing, startListening, stopListening };
};

export default useSpeech2text;
