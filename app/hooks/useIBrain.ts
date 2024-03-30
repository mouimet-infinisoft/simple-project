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

// function useIBrain() {
//   const { addAiCommunication, onUserCommunication } = useCommunicationManager();
//   const { addAsyncTask } = useTaskManager();
//   const { push } = useRouter();
//   const apiKey = useMemo(
//     () => core.store.getState((s) => s?.userData?.openai_apikey),
//     [core.store.getState()?.userData?.openai_apikey]
//   );

//   core.useOn(
//     'navigatetool.go',
//     (e: any) => {
//       push(e?.destination);
//     },
//     []
//   );

//   useEffect(() => {
//     // const apiKey = core.store.getState((s) => s?.userData?.openai_apikey);
//     if (apiKey) {
//       const iBrain = new IBrainAssistant(
//         apiKey,
//         'YOUR_ASSISTANT_ID',
//         addAsyncTask
//       );

//       // Create and add tools to the assistant
//       const dbTool = new ConnectDatabaseTool();
//       iBrain.addTool(dbTool);

//       const languageTool = new ChangeLanguageTool();
//       iBrain.addTool(languageTool);

//       const navigateTool = new NavigateTool();
//       iBrain.addTool(navigateTool);

//       const pricingTool = new PricingTool();
//       iBrain.addTool(pricingTool);

//       // Method to handle user input
//       const handleUserInput = async (message: string) => {
//         try {
//           if (message.includes('?') || message?.length >= 10) {
//             const answer = (await iBrain.ask(message)) ?? 'What the heck?';
//             addAiCommunication(answer);
//           }
//         } catch (error) {
//           console.error('Error asking the assistant:', error);
//         }
//       };

//       return onUserCommunication(handleUserInput);
//     }
//   }, [apiKey]);

//   useEffect(() => {
//     // Method to handle user input
//     const handleUserInput = async (message: string) => {
//       try {
//         if (message.includes('?') || message?.length >= 10) {
//           const answer = (await iBrain.ask(message)) ?? 'What the heck?';
//           addAiCommunication(answer);
//         }
//       } catch (error) {
//         console.error('Error asking the assistant:', error);
//       }
//     };

//     return onUserCommunication(handleUserInput);
//   }, []);

//   return {};
// }

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
      tools.forEach((tool) => iBrainRef.current?.addTool(tool));
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
          // const answer =
          //   (await iBrainRef.current?.ask(message)) ?? 'What the heck?';
          // addAiCommunication(answer);
          addAsyncTask('Ask iBrain', async () => {
            if (
              iBrainRef?.current?.ask !== undefined &&
              iBrainRef?.current?.ask !== null
            ) {
              const answer =
                (await iBrainRef.current.ask(message)) ?? 'What the heck?';
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

  // No need to return anything if the hook doesn't provide anything to the components
}

export default useIBrain;
