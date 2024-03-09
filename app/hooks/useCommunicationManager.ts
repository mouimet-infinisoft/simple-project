'use client';
import React from 'react';
import { useBrainStack } from '../../utils/BrainStackProvider';

const useCommunicationManager = () => {
  const bstack = useBrainStack();

  const addUserCommunication = (content: string) => {
    bstack.store.mutate((s) => {
      s?.communications?.push({ role: 'user', content });
      return { ...s };
    });
    bstack.store.emit('communication.user', { content });
    bstack.log.info(`User communication added: ${content}`);
  };

  const addAiCommunication = (content: string) => {
    bstack.store.mutate((s) => {
      s?.communications?.push({ role: 'assistant', content });
      return { ...s };
    });
    bstack.store.emit('communication.ai', { content });
    bstack.log.info(`AI communication added: ${content}`);
  };

  const onUserCommunication = (handler: (content: string) => Promise<void>) => {
    bstack.log.verbose('Listening for user communication...');
    return bstack.store.on('communication.user', async (e: any) => {
      bstack.log.verbose('communication.user: ', e);
      await handler(e?.content);
    });
  };

  const onAiCommunication = (handler: (content: string) => Promise<void>) => {
    bstack.log.verbose('Listening for AI communication...');
    return bstack.store.on('communication.ai', async (e: any) => {
      bstack.log.verbose('communication.ai: ', e);
      await handler(e?.content);
    });
  };

  return {
    addUserCommunication,
    addAiCommunication,
    onUserCommunication,
    onAiCommunication
  };
};

export default useCommunicationManager;
