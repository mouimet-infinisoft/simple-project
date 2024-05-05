'use client';
import { core } from '@/utils/BrainStackProvider';
import { AbstractTool } from '../abstraction';

// Define the arguments interface for expectations
interface ExpectationArguments {
  expectation: string;
  timeout?: number; // Optional timeout in milliseconds
}

// Implementation for ExpectationTool
export class ExpectationTool extends AbstractTool<ExpectationArguments> {
  constructor() {
    super(
      'Expectation', // Tool name
      'Usefull when you expect something from the user.', // Tool description
      {
        expectation: {
          type: 'string',
          description: 'The expectationfrom the user.'
        },
        timeout: {
          type: 'number',
          description:
            'Optional timeout in milliseconds after which to abort waiting.'
        }
      },
      ['expectation'] // Required parameters
    );
  }

  // Method to execute the tool
  async execute(args?: ExpectationArguments) {
    // Check if arguments are provided
    if (!args || !args.expectation) {
      console.error('Expectation not provided.');
      return;
    }

    // Setup a promise that resolves when the expectation is met or rejects on timeout
    return new Promise((resolve, reject) => {
      const handleExpectationMet = (event: any) => {
        if (event.detail.expectation === args.expectation) {
          // core.store.off('expectation.met', handleExpectationMet);
          clearTimeout(timeoutId);
          resolve(`Expectation '${args.expectation}' met.`);
        }
      };

      // Listen for an event that signifies the expectation is met
      core.store.on('expectation.met', handleExpectationMet);

      // Setup timeout if specified
      let timeoutId: NodeJS.Timeout;
      if (args.timeout) {
        timeoutId = setTimeout(() => {
          // core.store.off('expectation.met', handleExpectationMet);
          // reject(new Error(`Timeout waiting for expectation '${args.expectation}'.`));
          resolve(`So are you back now?`);
        }, args.timeout);
      }
    });
  }
}
