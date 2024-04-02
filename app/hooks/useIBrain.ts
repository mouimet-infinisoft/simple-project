'use client';
import { useEffect, useMemo, useRef } from 'react';
import { IBrainAssistant } from '@/utils/ibrain-assistant';
import { ConnectDatabaseTool } from '@/utils/ibrain-assistant/tools';
import { ChangeLanguageTool } from '@/utils/ibrain-assistant/tools/ChangeLanguage';
import useCommunicationManager from '@/app/hooks/useCommunicationManager';
import { useBrainStack } from '@/utils/BrainStackProvider';
import { NavigateTool } from '@/utils/ibrain-assistant/tools/Navigate';
import { useRouter } from 'next/navigation';
import { PricingTool } from '@/utils/ibrain-assistant/tools/Pricing';
import { useTaskManager } from '@/utils/task-manager/provider';
import { AiIntegration } from '@/utils/ibrain-assistant/iBrainAssistant';

function useIBrain() {
  const bstack = useBrainStack();
  const { addAiCommunication, onUserCommunication } = useCommunicationManager();
  const { addAsyncTask } = useTaskManager();
  const { push } = useRouter();

  const openaiKey = useMemo(
    () => bstack.store.getState((s) => s?.userData?.openai_apikey),
    [bstack.store.getState()?.userData?.openai_apikey]
  );
  const togetheraiKey = useMemo(
    () => bstack.store.getState()?.userData?.togetherai_apikey,
    [bstack.store.getState()?.userData?.togetherai_apikey]
  );
  const aiIntegration: AiIntegration = useMemo(
    () => bstack.store.getState()?.userData?.ai_integration,
    [bstack.store.getState()?.userData?.ai_integration]
  );

  const apiKey = aiIntegration === 'openai' ? openaiKey : togetheraiKey;

  // Use useRef to persist the IBrainAssistant instance
  const iBrainRef = useRef<IBrainAssistant | null>(null);

  useEffect(() => {
    if (apiKey && iBrainRef?.current === null) {
      // Initialize the IBrainAssistant instance if it hasn't been created yet
      const iBrain = new IBrainAssistant(
        apiKey,
        'YOUR_ASSISTANT_ID',
        aiIntegration,
        addAsyncTask
      );

      iBrainRef.current = iBrain;

      // Create and add tools to the assistant
      const asyncTools = [
        new ConnectDatabaseTool(),
        new ChangeLanguageTool(),
        new NavigateTool(),
        new PricingTool()
      ];
      asyncTools.forEach((tool) => iBrainRef.current?.addAsyncTool(tool));

      bstack.store.mutate((s) => ({ ...s, iBrain }));
    }
  }, [apiKey, addAsyncTask, aiIntegration]);

  useEffect(() => {
    const handleUserInput = async (message: string) => {
      try {
        if (
          (message.includes('?') || message.length >= 10) &&
          iBrainRef?.current?.ask !== undefined &&
          iBrainRef?.current?.ask !== null
        ) {
          addAsyncTask('Ask iBrain', async () => {
            if (
              iBrainRef?.current?.ask !== undefined &&
              iBrainRef?.current?.ask !== null
            ) {
              const answer =
                (await iBrainRef.current.ask(message)) ??
                `I'm sorry there is a issue reaching my brain connexion!`;
              addAiCommunication(answer);
            }
          });
        }
      } catch (error) {
        console.error('Error asking the assistant:', error);
      }
    };

    return onUserCommunication(handleUserInput);
  }, []);

  // Listen for navigation events
  bstack.useOn('navigatetool.go', (e: any) => push(e.destination), []);
  // Assuming bstack.useOn is a method to listen to events
  bstack.useOn(
    'tool.database.connect.new',
    () => {
      push(`/protected/tools/database`);
    },
    []
  );
  bstack.useOn(
    'tool.pricing',
    (e: any) => {
      console.log(`tool.pricing event: `, e);
      push(`/protected/account#pricing`);
    },
    []
  );

  bstack.useOn(
    'ibrain.talk',
    (e: any) => {
      addAsyncTask('Welcome back', async () => {
        const answer =
          (await iBrainRef?.current?.talk?.(e?.system, e?.instructions)) ??
          `Hello there, welcome back!`;
        addAiCommunication(answer);
      });
    },
    []
  );
}

export default useIBrain;
