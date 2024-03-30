'use client';
import { useEffect, useMemo, useRef } from 'react';
import { IBrainAssistant } from '@/utils/ibrain-assistant';
import { ConnectDatabaseTool } from '@/utils/ibrain-assistant/tools';
import { ChangeLanguageTool } from '@/utils/ibrain-assistant/tools/ChangeLanguage';
import useCommunicationManager from '@/app/hooks/useCommunicationManager';
import { core } from '@/utils/BrainStackProvider';
import { NavigateTool } from '@/utils/ibrain-assistant/tools/Navigate';
import { useRouter } from 'next/navigation';
import { PricingTool } from '@/utils/ibrain-assistant/tools/Pricing';
import { useTaskManager } from '@/utils/task-manager/provider';


function useIBrain() {
  const { addAiCommunication, onUserCommunication } = useCommunicationManager();
  const { addAsyncTask } = useTaskManager();
  const { push } = useRouter();
  const apiKey = useMemo(
    () => core.store.getState((s) => s?.userData?.openai_apikey),
    [core.store.getState()?.userData?.openai_apikey]
  );

  // Use useRef to persist the IBrainAssistant instance
  const iBrainRef = useRef<IBrainAssistant | null>(null);

  useEffect(() => {
    if (apiKey && iBrainRef?.current === null) {
      // Initialize the IBrainAssistant instance if it hasn't been created yet
      iBrainRef.current = new IBrainAssistant(
        apiKey,
        'YOUR_ASSISTANT_ID',
        addAsyncTask
      );

      // Create and add tools to the assistant
      const tools = [
        new ConnectDatabaseTool(),
        new ChangeLanguageTool(),
        new NavigateTool(),
        new PricingTool()
      ];
      tools.forEach((tool) => iBrainRef.current?.addAsyncTool(tool));
    }
  }, [apiKey, addAsyncTask]);

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
                (await iBrainRef.current.ask(message)) ?? `I'm sorry there is a issue reaching my brain connexion!`;
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
  core.useOn('navigatetool.go', (e: any) => push(e.destination), []);

}

export default useIBrain;
