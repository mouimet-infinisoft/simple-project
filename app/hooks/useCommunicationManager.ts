'use client';
import React from 'react';
import { useBrainStack } from '../../utils/BrainStackProvider';

const useCommunicationManager = () => {
  const bstack = useBrainStack();

  const addUserCommunication = (message: string) => {
    bstack.store.mutate((s) => {
      s?.communications?.push({ role: 'user', message });
      return { ...s };
    });
    bstack.store.emit('communication.user', { message });
    bstack.log.info(`User communication added: ${message}`);
  };

  const addAiCommunication = (message: string) => {
    bstack.store.mutate((s) => {
      s?.communications?.push({ role: 'assistant', message });
      return { ...s };
    });
    bstack.store.emit('communication.ai', { message });
    bstack.log.info(`AI communication added: ${message}`);
  };

  const onUserCommunication = (handler: (message: string) => Promise<void>) => {
    bstack.log.verbose('Listening for user communication...');
    return bstack.store.on('communication.user', async (e: any) => {
      bstack.log.verbose('communication.user: ', e);
      await handler(e?.message);
    });
  };

  const onAiCommunication = (handler: (message: string) => Promise<void>) => {
    bstack.log.verbose('Listening for AI communication...');
    return bstack.store.on('communication.ai', async (e: any) => {
      bstack.log.verbose('communication.ai: ', e);
      await handler(e?.message);
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
