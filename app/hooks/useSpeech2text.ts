"use client"

// useSpeech2text.ts
import React, { useCallback, useEffect, useRef, useState } from "react";

type OnTriggerFunction = (speech: string) => void;
type TriggerConditionFunction = (text: string) => boolean;

const useSpeech2text = (
  onTrigger: OnTriggerFunction,
  triggerCondition: TriggerConditionFunction = (text) => text.includes('?')
) => {
  const SpeechRecognition = (global.window as any).SpeechRecognition || (global.window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("Speech Recognition is not supported by this browser.");
    return {
      userSpeech: "",
      isRecognizing: false,
      startListening: () => {},
      stopListening: () => {},
      setLanguage: (lang: string) => {},
    };
  }

  const recognition = useRef<typeof SpeechRecognition>(new SpeechRecognition());
  const [userSpeech, setUserSpeech] = useState<string>("");
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);

  const setLanguage = useCallback((lang: string) => {
    recognition.current.lang = lang;
  }, []);

  useEffect(() => {
    const _recognition = recognition.current;
    _recognition.continuous = true;
    _recognition.lang = "en-US"; // Default language

    _recognition.onend = () => {
      setIsRecognizing(false);
    };

    _recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result:any) => result[0].transcript)
        .join("");
      const newSpeech = `${userSpeech} ${transcript}`.trim();
      setUserSpeech(newSpeech);

      if (triggerCondition(newSpeech)) {
        onTrigger(newSpeech);
        setUserSpeech("");
      }
    };

    _recognition.onerror = (event: Event) => {
      console.error("Speech recognition error", (event as ErrorEvent).message);
    };

    return () => {
      _recognition.stop();
    };
  }, [userSpeech, onTrigger, triggerCondition]);

  const startListening = useCallback(() => {
    try {
      recognition.current.start();
      setIsRecognizing(true);
      setUserSpeech("");
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  }, []);

  const stopListening = useCallback(() => {
    try {
      recognition.current.stop();
      setIsRecognizing(false);
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
  }, []);

  return {
    userSpeech,
    isRecognizing,
    startListening,
    stopListening,
    setLanguage,
  };
};

export default useSpeech2text;
