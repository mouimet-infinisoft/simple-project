'use client';
import { useEffect, useMemo, useRef } from 'react';
import { IBrainAssistant } from '@/utils/ibrain-assistant';
import { ConnectDatabaseTool } from '@/utils/ibrain-assistant/tools';
import { ChangeLanguageTool } from '@/utils/ibrain-assistant/tools/ChangeLanguage';
import useCommunicationManager from '@/app/hooks/useCommunicationManager';
import { core, useBrainStack } from '@/utils/BrainStackProvider';
import { NavigateTool } from '@/utils/ibrain-assistant/tools/Navigate';
import { useRouter } from 'next/navigation';
import { PricingTool } from '@/utils/ibrain-assistant/tools/Pricing';
import { useTaskManager } from '@/utils/task-manager/provider';
import { AiIntegration } from '@/utils/ibrain-assistant/iBrainAssistant';
import useOAuthSignIn from './useOAuthSignIn';
import { SignInTool } from '@/utils/ibrain-assistant/tools/Signin';

function usePublicIBrain() {
  const bstack = useBrainStack();
  const { addAiCommunication, onUserCommunication } = useCommunicationManager();
  const { addAsyncTask } = useTaskManager();
  const { push } = useRouter();
  const { handleSignIn } = useOAuthSignIn();

  const togetheraiKey =
    'b2e41bb3d206fac6ec61e76e96f53574235a41be47452f70f6b5b11117f52ffc';

  const aiIntegration: AiIntegration = 'togetherai';

  const apiKey = togetheraiKey;

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
        new ChangeLanguageTool(),
        new NavigateTool(),
        new PricingTool(),
        new SignInTool()
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
  core.useOn('navigatetool.go', (e: any) => push(e.destination), []);
  // Assuming core.useOn is a method to listen to events

  core.useOn('tool.pricing', () => {
    push(`/#pricing`);
  });

  core.useOn('tool.signin', (e: any) => {
    handleSignIn('google');
  });
}

export default usePublicIBrain;
