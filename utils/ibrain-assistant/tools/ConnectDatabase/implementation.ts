import { AbstractTool } from '../abstraction';
import { DatabaseClientFactory } from './integrations/DatabaseClientFactory';
import {
  DatabaseLogin,
  DatabaseClient,
  ConnectDatabaseArguments
} from './abstraction';
import { core } from '@/utils/BrainStackProvider';

// Implementation for ConnectDatabaseTool
export class ConnectDatabaseTool extends AbstractTool<ConnectDatabaseArguments> {
  constructor() {
    super(
      'connectToDatabase',
      'Connects to a database with optional arguments.',
      {
        dbtype: {
          type: 'string',
          description: 'Type of database (e.g., mysql, sql, postgres).',
          enum: ['mysql', 'sql', 'postgres']
        },
        url: {
          type: 'string',
          description: 'URL of the database.'
        },
        username: {
          type: 'string',
          description: 'Username for the database connection.'
        },
        password: {
          type: 'string',
          description: 'Password for the database connection.'
        }
      }
    );
  }

  async execute(args?: ConnectDatabaseArguments) {
    // Check if arguments are provided
    if (!args) {
      console.error('Arguments are missing.');
      return;
    }

    // Destructure arguments
    const { dbtype, url, username, password } = args;

    // Create a database login object
    const login: DatabaseLogin = { url, username, password };

    // Create a database client using the factory
    const client: DatabaseClient = DatabaseClientFactory.createClient(
      dbtype,
      login
    );

    // Connect to the database
    client.connect();
    const answer = `Connected to ${dbtype} database successfully.`;
    // Simulate successful connection
    console.log(answer);

    core.store.emit('communication.ai', { content: answer });

    // Return some result or status
    return `Connected to ${dbtype} database successfully.`;
  }
}
