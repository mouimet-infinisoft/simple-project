import { core } from '@/utils/BrainStackProvider';
import { AbstractTool } from '../abstraction';

// Define the arguments interface for changing the language
interface ChangeLanguageArguments {
  language: string;
  recognitionLanguageCode: string; // Language code for web speech recognition
  synthesisLanguageCode: string; // Language code for web speech synthesis
  feedbackMessage: string;
}

// Implementation for ChangeLanguageTool
export class ChangeLanguageTool extends AbstractTool<ChangeLanguageArguments> {
  constructor() {
    super(
      'changeConversationLanguage', // Tool name
      'Changes the language of the conversation. This tool is not related to programming', // Tool description
      {
        language: {
          type: 'string',
          description: 'The language to switch to.'
        },
        recognitionLanguageCode: {
          type: 'string',
          description: 'The language code for web speech recognition.'
        },
        synthesisLanguageCode: {
          type: 'string',
          description: 'The language code for web speech synthesis.'
        },
        feedbackMessage: {
          type: 'string',
          description:
            'A message in language to let the user know it is changed.'
        }
      },
      [
        'language',
        'recognitionLanguageCode',
        'synthesisLanguageCode',
        'feedbackMessage'
      ] // Required parameters
    );
  }

  // Method to execute the tool
  async execute(args?: ChangeLanguageArguments) {
    // Check if arguments are provided
    if (
      !args ||
      !args.language ||
      !args.recognitionLanguageCode ||
      !args.synthesisLanguageCode ||
      !args.feedbackMessage
    ) {
      console.error('Some language arguments are missing.');
      return;
    }

    console.log(`Language changed to `, args);
    core.store.mutate((s) => ({
      ...s,
      language: args.recognitionLanguageCode
    }));

    core.store.emit('communication.ai', {content:args.feedbackMessage})

    // Return some result or status
    return args.feedbackMessage;
  }
}
