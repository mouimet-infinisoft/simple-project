'use client';
import { core } from '@/utils/BrainStackProvider';
import { AbstractTool } from '../abstraction';

// Define the arguments interface for sign-in
interface SignInArguments {
  provider: 'google' | 'github' | 'facebook' | string; // Extend with more providers as needed
}

// Implementation for SignInTool
export class SignInTool extends AbstractTool<SignInArguments> {
  constructor() {
    super(
      'signIn', // Tool name
      'Signs in a user using a specified authentication provider.', // Tool description
      {
        provider: {
          type: 'string',
          description:
            'The authentication provider to use for signing in (e.g., google, github, facebook).'
        }
      },
      ['provider'] // Required parameters
    );
  }

  // Method to execute the tool
  async execute(args?: SignInArguments) {
    // Check if arguments are provided
    if (!args || !args.provider) {
      console.error('Authentication provider not provided.');
      return;
    }

    // Validate the provider
    const validProviders = ['google', 'github', 'facebook']; // Extend this list as needed
    if (!validProviders.includes(args.provider.toLowerCase())) {
      console.error('Invalid authentication provider.');
      return;
    }

    // Emit the sign-in event with the specified provider
    core.store.emit('tool.signin', { provider: args.provider.toLowerCase() });

    // Return some result or status
    return `Signing in with ${args.provider.toLowerCase()}...`;
  }
}
