import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useCallback,
    useState,
  } from "react";

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  
    
  export const useBrainAudio = () => useContext(BrainAudioContext);
  
  const useSpeech2text = () => {
    const bstack = useBrainStack();
    const recognition = useRef(new SpeechRecognition());
  
    if (
      typeof window.SpeechRecognition === "undefined" &&
      typeof window.webkitSpeechRecognition === "undefined"
    ) {
      throw new Error("Speech Recognition is not supported by this browser.");
    }
  
    const [userSpeech, setUserSpeech] = useState("");
    const [isRecognizing, setIsRecognizing] = useState(false);
  
    const setLanguage = useCallback((lang) => {
      recognition.current.lang = lang;
      // Additional logic to set language for speech synthesis if needed
    }, []);
  
    useEffect(() => {
      const _recognition = recognition.current;
      _recognition.continuous = true;
      _recognition.lang = "en-US"; // Default language
  
      _recognition.onend = () => {
        // bstack.store.emit("audio.startListening");
        setIsRecognizing(false)
      };
  
      _recognition.onresult = (event) => {
        console.log(event.results);
        const transcript = event.results[event.resultIndex][0].transcript;
        const newCommunication = transcript;
        if (String(newCommunication).length < 2) {
          return;
        }
  
        setUserSpeech((prev) => {
          const next = `${prev} ${transcript}`;

  
          if (
            String(newCommunication).toLocaleLowerCase().includes("?")
          ) {
            bstack.log.info(`Quick Send!! `, prev, newCommunication);
            bstack.store.emit("user.speech", {
              message: prev + " " + newCommunication,
              source: getValue(`state.context.name`),
            });
  
            return ""
          }
  
          return next;
        });
  
        bstack.log.info(`Speech Recognition Result: `, newCommunication);
  
      };
  
      _recognition.onerror = (event) => {
        bstack.store.emit("audio.recognitionError", { error: event });
      };
  
      return () => {
        _recognition?.stop?.();
      };
    }, [recognition, bstack.store, bstack.log]);
  
    const changeLanguageHandler = useCallback(
      (event) => {
        const newLang = event.detail.lang; // Assuming the event contains the new language code in `detail.lang`
        setLanguage(newLang);
      },
      [setLanguage]
    ); // `setLanguage` should be a stable function or part of the state
  
    const startListening = useCallback(() => {
      try {
        recognition.current?.start?.();
        setIsRecognizing(true)
      } catch (error) {
        console.error(error);
      }
    }, [recognition]); // `recognition` is the dependency
  
    const stopListening = useCallback(() => {
      try {
        recognition.current?.stop?.();
        setIsRecognizing(false)
      } catch (err) {
        console.error(err);
      }
    }, [recognition]); // `recognition` is the dependency
  
    const speak = useCallback((text) => {
      const sentences = text.split(/(?<=[.!?])/);
  
      sentences.forEach((sentence) => {
        const trimmedSentence = sentence.trim();
        if (trimmedSentence) {
          const utterance = new SpeechSynthesisUtterance(trimmedSentence);
          utterance.lang = "en";
          utterance.voice = window.speechSynthesis.getVoices()[87];
  
          utterance.onstart = () => {
            bstack.store.emit("audio.stopListening");
          };
  
          utterance.onend = () => {
            bstack.store.emit("audio.startListening");
          };
  
          window.speechSynthesis.speak(utterance);
        }
      });
    }, [bstack.store]);
  
    /***** TO BE REPLACED BY ROUTER */
    bstack.useOn("chat.context", (e) =>
      setUserSpeech((prev) => `${prev} ${e.message}`)
    );
    bstack.useOn("audio.changeLanguage", changeLanguageHandler);
    bstack.useOn("audio.startListening", () => startListening(), [
      startListening,
    ]);
    bstack.useOn("audio.stopListening", () => stopListening(), [stopListening]);
    bstack.useOn(
      "audio.speak",
      (e) => {
        speak(e.message);
      },
      [speak]
    );
    bstack.useOn(
      "audio.silent",
      (e) => {
        window.speechSynthesis.cancel();
      },
      []
    );
  
    return {
      startListening,
      stopListening,
      speak,
    };
  };
  