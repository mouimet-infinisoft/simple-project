'use client';
import { core } from '@/utils/BrainStackProvider';
import { AbstractTool } from '../abstraction';

// Define the arguments interface for feedback expectations
interface FeedbackExpectedArguments {
  question: string;
  reengageMessage: string;
  giveUpMessage: string;
  timeout?: number; // Optional timeout in milliseconds for each attempt
}

// Implementation for FeedbackExpectedTool
export class FeedbackExpectedTool extends AbstractTool<FeedbackExpectedArguments> {
  constructor() {
    super(
      'feedbackExpected', // Tool name
      'Useful when asks a question and waits for user feedback, attempting to re-engage if necessary.', // Tool description
      {
        question: {
          type: 'string',
          description: 'The initial question asked by the AI.'
        },
        reengageMessage: {
          type: 'string',
          description:
            'Message to re-engage the user if there is no initial response. Something like: Hello there, I am waiting for your answer. You slow down the pace my friend!'
        },
        giveUpMessage: {
          type: 'string',
          description:
            'Message to indicate the user that trhe AI is giving up after attempts to re-engage. Something like: The user did not answer even if we retried twice. Lets tell the user we give up for now and try later when user has time to pay attention.'
        },
        timeout: {
          type: 'number',
          description:
            'Optional timeout in milliseconds for each attempt to wait for an answer.'
        }
      },
      ['question', 'reengageMessage', 'giveUpMessage'] // Required parameters
    );
  }

  // Method to execute the tool
  async execute(args?: FeedbackExpectedArguments) {
    if (!args) {
      console.error('Arguments not provided.');
      return;
    }

    const { question, reengageMessage, giveUpMessage, timeout = 30000 } = args;

    // Function to handle waiting for feedback with re-engagement
    const waitForFeedback = (
      message: string,
      attempt: number = 1
    ): Promise<string> => {
      console.log(message); // Simulate asking the question or sending a message
      core.store.emit('ibrain.speak', {
        message
      });
      return new Promise((resolve) => {
        let timeoutId: NodeJS.Timeout = setTimeout(() => {
          if (attempt < 2) {
            // Attempt to re-engage up to two times
            resolve(waitForFeedback(reengageMessage, attempt + 1));
          } else {
            // Give up after two attempts to re-engage
            // core.store.emit('ibrain.speak', {
            //   message: giveUpMessage
            // });
            resolve(giveUpMessage);
          }
        }, 10000);

        // Example event listener for user response (to be replaced with actual implementation)
        core.store.on('user.response', (response: any) => {
          clearTimeout(timeoutId);
          resolve(`Received response: ${response.detail}`);
        });
      });
    };

    const d = await waitForFeedback(question);

    console.log(`const d = await waitForFeedback(question) = `, d);

    return d;
  }
}
