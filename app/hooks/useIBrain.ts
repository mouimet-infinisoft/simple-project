'use client';
import { useEffect } from 'react';
import { IBrainAssistant } from '@/utils/ibrain-assistant';
import { ConnectDatabaseTool } from '@/utils/ibrain-assistant/tools';
import { ChangeLanguageTool } from '@/utils/ibrain-assistant/tools/ChangeLanguage';
import useCommunicationManager from '@/app/hooks/useCommunicationManager';
import { core } from '@/utils/BrainStackProvider';
import { NavigateTool } from '@/utils/ibrain-assistant/tools/Navigate';
import { useRouter } from 'next/navigation';

function useIBrain() {
  const { addAiCommunication, onUserCommunication } = useCommunicationManager();
  const { push } = useRouter();

  core.useOn(
    'navigatetool.go',
    (e: any) => {
      push(e?.destination);
    },
    []
  );

  useEffect(() => {
    const apiKey = core.store.getState((s) => s?.userData?.openai_apikey);
    if (apiKey) {
      const iBrain = new IBrainAssistant(apiKey, 'YOUR_ASSISTANT_ID');

      // Create and add tools to the assistant
      const dbTool = new ConnectDatabaseTool();
      iBrain.addTool(dbTool);

      const languageTool = new ChangeLanguageTool();
      iBrain.addTool(languageTool);

      const navigateTool = new NavigateTool();
      iBrain.addTool(navigateTool);

      // Method to handle user input
      const handleUserInput = async (message: string) => {
        try {
          if (message.includes('?') || message?.length >= 10) {
            const answer = (await iBrain.ask(message)) ?? 'What the heck?';
            addAiCommunication(answer);
          }
        } catch (error) {
          console.error('Error asking the assistant:', error);
        }
      };

      const unsubscribe = onUserCommunication(handleUserInput);

      // Cleanup function
      return () => {
        unsubscribe();
      };
    }
  }, [core.store.getState((s) => s?.userData?.openai_apikey)]);

  return {};
}

export default useIBrain;
