'use client';
import { core } from '@/utils/BrainStackProvider';
import { AbstractTool } from '../abstraction';

// Define the arguments interface for navigation
interface NavigateArguments {
  destination: 'home' | 'account' | 'assistant' | string;
}

// Implementation for NavigateTool
export class NavigateTool extends AbstractTool<NavigateArguments> {
  constructor() {
    super(
      'navigateTo', // Tool name
      'Navigates to a specific page on the website.', // Tool description
      {
        destination: {
          type: 'string',
          description:
            'The destination page to navigate to (home, account, assistant).'
        }
      },
      ['destination'] // Required parameters
    );
  }

  // Method to execute the tool
  async execute(args?: NavigateArguments) {
    // Check if arguments are provided
    if (!args || !args.destination) {
      console.error('Destination not provided.');
      return;
    }

    // Define routes based on destination
    const routes: { [key in NavigateArguments['destination']]: string } = {
      home: '/',
      account: '/account',
      assistant: '/assistant'
    };

    // Check if the destination is valid
    if (!routes[args.destination.toLowerCase()]) {
      console.error('Invalid destination.');
      return;
    }

    // Navigate to the specified route imperatively
    const destination = routes[args.destination.toLowerCase()]
    core.store.emit('navigatetool.go', {destination})

    // Return some result or status
    return `Navigating to ${args.destination.toLowerCase()}...`;
  }
}
