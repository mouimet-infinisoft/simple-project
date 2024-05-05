'use client';
import { core } from '@/utils/BrainStackProvider';
import { AbstractTool } from '../abstraction';

// Define the arguments interface for categorizing message relevance
interface CategorizeMessageArguments {
  message: string;
  id: string;
  expectation: string;
  explanations: string;
  expectationState:
    | 'Anticipating'
    | 'Satisfied'
    | 'Disappointmented'
    | 'Surprised'; // Use expectation states
}

// Implementation for CategorizeMessageTool
export class UpdateRelatedExpectationTool extends AbstractTool<CategorizeMessageArguments> {
  constructor() {
    super(
      'UpdateRelatedExpectation', // Tool name
      `Only if a message is related to an assistant immediate expectation:
      
States of Expectation:
Anticipating: Waiting for something.

Satisfied: Met the expectation

Disappointmented: Did not happend as expected.

Surprised: Something happen and it was unexepected.
      
      `, // Tool description
      {
        message: {
          type: 'string',
          description:
            'The user message related to the assistant immediate expectation.'
        },
        id: {
          type: 'string',
          description: 'The expectation id.'
        },
        expectation: {
          // Updated to use expectation states
          type: 'string',
          description: 'The expectation.'
        },
        explanations: {
          // Updated to use expectation states
          type: 'string',
          description: 'The explanation of state change.'
        },
        expectationState: {
          // Updated to use expectation states
          type: 'string',
          description: 'The updated expectation state.',
          enum: ['Anticipating', 'Satisfied', 'Disappointmented', 'Surprised']
        }
      },
      [] // Updated required parameters
    );
  }

  // Method to execute the tool
  async execute(args?: CategorizeMessageArguments) {
    // Check if arguments are provided
    if (
      !args ||
      !args.message ||
      !args.expectationState ||
      !args.id ||
      !args.explanations
    ) {
      console.error('Message or expectation state not provided.', args);
      return args?.message;
    }

    // Process the message based on the provided expectation state
    // const processedMessage = `Message: "${args.message}" refer to expectation "${args?.expectation}" id ${args?.id} is in the state of ${args.expectationState}. Explanations: ${args?.explanations}`;
    const processedMessage = `You were expecting to "${args?.expectation}" refering to id "${args?.id}". Having the following explanations "${args?.explanations}", you are now ${args?.expectationState}!`;

    // Emit an event with the categorization result
    console.log('message.categorized', processedMessage);

    // Return the processed message
    return processedMessage;
  }
}
