import useCommunicationManager from '@/app/hooks/useCommunicationManager';
import { IBrainAssistant } from '@/utils/ibrain-assistant';
import { ConnectDatabaseTool } from '@/utils/ibrain-assistant/tools';
import { ChangeLanguageTool } from '@/utils/ibrain-assistant/tools/ChangeLanguage';
import { useEffect, useState } from 'react';

function TestIBrain() {
  const [assistantResponse, setAssistantResponse] = useState('');
  const { addAiCommunication } = useCommunicationManager();

  // Initialize the IBrainAssistant instance
  const iBrain = new IBrainAssistant(
    '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',
    'YOUR_ASSISTANT_ID'
  );

  // Create and add a tool to the assistant
  const dbTool = new ConnectDatabaseTool();
  iBrain.addTool(dbTool);

  const languageTool = new ChangeLanguageTool()
  iBrain.addTool(languageTool)

  // Method to handle user input
  const handleUserInput = async (message: string) => {
    try {
      if (message.includes('?')) {
        const answer = (await iBrain.ask(message)) ?? 'What the heck?';
        addAiCommunication(answer);
      }
    } catch (error) {
      console.error('Error asking the assistant:', error);
    }
  };

  const { onUserCommunication } = useCommunicationManager();

  useEffect(() => onUserCommunication(handleUserInput), []);

  return (
    <div>
      {/* <h1>Chat Component</h1>
      <div>
        <button
          onClick={() =>
            handleUserInput(
              'Can we connect a postgres database at localhost:1234?'
            )
          }
        >
          Ask Assistant
        </button>
      </div>
      <div>
        <h2>Assistant Response:</h2>
        <p>{assistantResponse}</p>
      </div> */}
    </div>
  );
}

export default TestIBrain;
