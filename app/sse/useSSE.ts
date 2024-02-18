import { useEffect, useState } from 'react';

interface MessageEvent {
  data: string;
}

export const useSSE = (url: string, onMessage: (data: any) => void) => {
  useEffect(() => {
    const eventSource = new EventSource(url);

    const messageHandler = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    eventSource.onmessage = messageHandler;
    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url, onMessage]);
};
