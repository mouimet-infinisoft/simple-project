'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

const SpeechRecognition =
  (global?.window as any)?.SpeechRecognition ||
  (global?.window as any)?.webkitSpeechRecognition;

const useSpeech2text = (onTrigger: (speech: string) => Promise<void>) => {
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const recognition = useRef<typeof SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    recognition.current?.start();
    setIsRecognizing(true);
  }, []);

  const stopListening = useCallback(() => {
    recognition.current?.stop();
    setIsRecognizing(false);
  }, []);

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
      console.error('Speech recognition error', event);
    };

    // Listen for custom events to start/stop recognition
    window.addEventListener('speechStart', stopListening);
    window.addEventListener('speechEnd', startListening);

    return () => {
      window.removeEventListener('speechStart', stopListening);
      window.removeEventListener('speechEnd', startListening);
      stopListening();
    };
  }, [startListening, stopListening, onTrigger]);

  return { isRecognizing, startListening, stopListening };
};

export default useSpeech2text;

// // useSpeech2text.ts
// import { useCallback, useEffect, useRef, useState } from 'react';

// const useSpeech2text = (onTrigger: (speech: string) => Promise<void>) => {
//   const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
//   const recognition = useRef<typeof SpeechRecognition | null>(null);

//   useEffect(() => {
//     if (!SpeechRecognition) {
//       console.error('Speech Recognition is not supported by this browser.');
//       return;
//     }

//     recognition.current = new SpeechRecognition();
//     recognition.current.continuous = true;
//     recognition.current.lang = 'en-US';
//     recognition.current.onresult = async (event: any) => {
//       const transcript = Array.from(event.results)
//         .map((result: any) => result?.[0]?.transcript)
//         .join('');
//       await onTrigger(transcript);
//     };
//     recognition.current.onerror = (event: any) => {
//       console.error('Speech recognition error', event.error);
//     };
//   }, [onTrigger]);

//   const startListening = useCallback(() => {
//     recognition.current?.start();
//     setIsRecognizing(true);
//   }, []);

//   const stopListening = useCallback(() => {
//     recognition.current?.stop();
//     setIsRecognizing(false);
//   }, []);

//   return { isRecognizing, startListening, stopListening };
// };

// export default useSpeech2text;
