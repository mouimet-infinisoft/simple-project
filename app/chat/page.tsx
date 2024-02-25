'use client';

// app/chat/page.tsx
import React, { useEffect } from 'react';
import ChatComponent from 'components/ui/Chat';
import { createClient } from '@/utils/supabase/client';

const subscribeInsertMessage = async () => {
  const supabase = createClient();

  // Extract the user session from the request to identify the user
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  // const channels = supabase
  //   .channel('custom-insert-channel')
  //   .on(
  //     'postgres_changes',
  //     { event: 'INSERT', schema: 'public', table: 'messages' },
  //     (payload) => {
  //       if (String(payload?.new?.role).includes('ibrain')) {
  //         console.log('Change received!', payload);
  //         speak(String(payload?.new?.text));
  //       }
  //     }
  //   )
  //   .subscribe();

  const messages = supabase
    .channel('custom-filter-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `user_id=eq.${user?.id}`
      },
      (payload: any) => {
        if (String(payload?.new?.role).includes('ibrain')) {
          console.log('Change received!', payload);
          speak(String(payload?.new?.text));
        }
      }
    )
    .subscribe();
};

const unSubscribeInsertMessage = () => {
  const supabase = createClient();

  supabase.removeAllChannels();
};

// Define custom events for starting and stopping speech recognition
const isSpeakingEvent = new Event('isTalking');
const isSilentEvent = new Event('isSilent');

const speak = (text: string) => {
  const { plainText } = splitCodeFromText(text.replace('ibrain:', ''));
  const sentences = plainText.split(/(?<=[.!?])/);

  sentences.forEach((sentence, index) => {
    const trimmedSentence = sentence.trim();
    if (trimmedSentence) {
      const utterance = new SpeechSynthesisUtterance(trimmedSentence);
      utterance.lang = 'en';
      utterance.voice = window.speechSynthesis.getVoices()[87];

      if (index === 0) {
        window.dispatchEvent(isSpeakingEvent);
      }

      utterance.onend = () => {
        if (index === sentences.length - 1) {
          window.dispatchEvent(isSilentEvent);
        }
      };

      window.speechSynthesis.speak(utterance);
    }
  });
};

// const speak = (text: string) => {
//   const { plainText } = splitCodeFromText(text.replace('ibrain:', ''));
//   const sentences = plainText.split(/(?<=[.!?])/);

//   sentences.forEach((sentence) => {
//     const trimmedSentence = sentence.trim();
//     if (trimmedSentence) {
//       const utterance = new SpeechSynthesisUtterance(trimmedSentence);
//       utterance.lang = 'en';
//       utterance.voice = window.speechSynthesis.getVoices()[87];

//       utterance.onstart = () => {
//         // bstack.store.emit("audio.stopListening");
//       };

//       utterance.onend = () => {
//         // bstack.store.emit("audio.startListening");
//       };

//       window.speechSynthesis.speak(utterance);
//     }
//   });
// };

function splitCodeFromText(markdown: string) {
  // Regex to find code blocks
  const codeBlockRegex = /```[\s\S]*?```/g;

  // Array to hold extracted code blocks
  const codeBlocks: string[] = [];

  // Extracting and replacing code blocks
  let plainText = markdown.replace(codeBlockRegex, (block) => {
    // Remove the triple backticks
    const code = block.slice(3, -3);
    codeBlocks.push(code);
    // Replace code block with a placeholder or nothing if wish to completely remove from plain text
    return '';
  });

  // Removing any additional newlines that may have been left after removing code blocks
  plainText = plainText.replace(/^\s*[\r\n]/gm, '');

  return { codeBlocks, plainText };
}

export default function ChatPage() {
  useEffect(() => {
    subscribeInsertMessage()
      .then(() => {
        console.log(`Subsribed`);
      })
      .catch(console.error);

    return unSubscribeInsertMessage;
  }, []);
  return (
    <div>
      <ChatComponent />
    </div>
  );
}
