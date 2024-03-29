'use client';
import { useBrainStack } from '@/utils/BrainStackProvider';
import { useTaskManager } from '@/utils/task-manager/provider';
import { useEffect, useRef } from 'react';

const useTextToSpeech = () => {
  const { addSyncTask } = useTaskManager();
  const bstack = useBrainStack();
  const synthesisRef = useRef<SpeechSynthesis>();

  useEffect(() => {
    synthesisRef.current = window.speechSynthesis;
    return () => {
      synthesisRef.current?.cancel();
    };
  }, []);

  const speakText = (utterance:  SpeechSynthesisUtterance) => {
    if (!synthesisRef.current) return;

    // Configure utterance properties as needed
    synthesisRef.current.speak(utterance);
  };

  const splitCodeFromText = (markdown: string) => {
    const codeBlockRegex = /```[\s\S]*?```/g;
    const codeBlocks: string[] = [];

    let plainText = markdown.replace(codeBlockRegex, (block) => {
      const code = block.slice(3, -3);
      codeBlocks.push(code);
      return '';
    });

    plainText = plainText.replace(/^\s*[\r\n]/gm, '');

    return { codeBlocks, plainText };
  };

  const changeLanguage = (newLanguage: string) => {
    // Update the language and voice
    bstack.store.mutate((s) => ({ ...s, language: newLanguage }));
  };

  const aiSpeak = (text: string) => {
    // Assuming splitCodeFromText is a utility function you've defined elsewhere
    const { plainText } = splitCodeFromText(text.replace('ibrain:', ''));
    const sentences = plainText
      .split(/(?<=[.!?])/)
      .filter((sentence) => sentence.trim());

    sentences.forEach((sentence) => {
      addSyncTask(
        'Speak Text',
        () =>
          new Promise<void>((resolve) => {
            const trimmedSentence = sentence.trim();
            if (trimmedSentence) {
              const utterance = new SpeechSynthesisUtterance(trimmedSentence);
              utterance.onend = () => resolve();
              speakText(utterance);
            } else {
              resolve(); // Resolve immediately if there's no sentence to speak
            }
          })
      );
    });
  };

  return { aiSpeak, changeLanguage };
};

export default useTextToSpeech;

// "use client"
// import { useEffect, useRef } from 'react';
// import { useBrainStack } from '../../utils/BrainStackProvider';

// const useTextToSpeech = () => {
//   const bstack = useBrainStack();
//   const synthesisRef = useRef<SpeechSynthesis>();

//   useEffect(() => {
//     synthesisRef.current = window.speechSynthesis;
//     return () => {
//       synthesisRef?.current?.cancel?.();
//     };
//   }, []);

//   const aiSpeak = (text: string) => {
//     if (!synthesisRef.current) return;

//     const { plainText } = splitCodeFromText(text.replace('ibrain:', ''));
//     const sentences = plainText.split(/(?<=[.!?])/);

//     sentences.forEach((sentence, index) => {
//       const trimmedSentence = sentence.trim();
//       if (trimmedSentence) {
//         const utterance = new SpeechSynthesisUtterance(trimmedSentence);

//         // Set language based on state
//         utterance.lang = bstack.store.getState().language || 'en-US';

//         // Set voice based on language
//         const voices = synthesisRef?.current?.getVoices();
//         if (voices) {
//           const voiceForLanguage = voices.find(
//             (voice) => voice.lang === utterance.lang
//           );
//           if (voiceForLanguage) {
//             utterance.voice = voiceForLanguage;
//           }
//         }

//         if (index === 0) {
//           bstack.store.mutate((s) => ({ ...s, isSpeaking: true }));
//           bstack.store.emit('speech.speaking');
//         }

//         utterance.onend = () => {
//           if (index === sentences.length - 1) {
//             bstack.store.mutate((s) => ({ ...s, isSpeaking: false }));
//             bstack.store.emit('speech.silent');
//           }
//         };

//         synthesisRef?.current?.speak?.(utterance);
//       }
//     });
//   };

//   const changeLanguage = (newLanguage: string) => {
//     // Update the language and voice
//     bstack.store.mutate((s) => ({ ...s, language: newLanguage }));
//   };

//   const splitCodeFromText = (markdown: string) => {
//     const codeBlockRegex = /```[\s\S]*?```/g;
//     const codeBlocks: string[] = [];

//     let plainText = markdown.replace(codeBlockRegex, (block) => {
//       const code = block.slice(3, -3);
//       codeBlocks.push(code);
//       return '';
//     });

//     plainText = plainText.replace(/^\s*[\r\n]/gm, '');

//     return { codeBlocks, plainText };
//   };

//   return { aiSpeak, changeLanguage };
// };

// export default useTextToSpeech;
