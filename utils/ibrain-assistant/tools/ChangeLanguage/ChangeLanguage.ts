import { core } from '@/utils/BrainStackProvider';
import { AbstractTool } from '../abstraction';

// Define the arguments interface for changing the language
interface ChangeLanguageArguments {
  language: string;
  recognitionLanguageCode: string; // Language code for web speech recognition
  synthesisLanguageCode: string; // Language code for web speech synthesis
}

// Implementation for ChangeLanguageTool
export class ChangeLanguageTool extends AbstractTool<ChangeLanguageArguments> {
  constructor() {
    super(
      'changeConversationLanguage', // Tool name
      'Useful to change the spoken conversation language with the user. Example of user could  tell: Hey lets talk in French now.', // Tool description
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
        }
      },
      [
        'language',
        'recognitionLanguageCode',
        'synthesisLanguageCode'
      ] // Required parameters
    );
  }

  // Method to execute the tool
  async execute(args?: ChangeLanguageArguments) {
    if (
      !args ||
      !args.language ||
      !args.recognitionLanguageCode ||
      !args.synthesisLanguageCode
    ) {
      return 'You will need to ask user to what language he wants to discuss.'
    }

    core.store.getState()?.language

    console.log(`Language changed to `, args);
    core.store.mutate((s) => ({
      ...s,
      language: args.recognitionLanguageCode
    }));

    return `You will respond back in ${args.language} to let the user know language is changed now.`
  }
}
