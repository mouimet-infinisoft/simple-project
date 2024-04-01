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
    // Validate arguments
    const validationMessage = validateArguments(args);
    if (validationMessage !== true) {
      console.log(validationMessage);
      core.store.emit(`tool.database.connect.new`)
      return `Let's connect your database. Please provide me the connexion string to continue.`;
    } else {
      // Destructure arguments
      const { dbtype, url, username, password } = args!;

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

      // Return some result or status
      return `Connected to ${dbtype} database successfully.`;
    }
  }
}

function validateArguments(args?: ConnectDatabaseArguments): true | string {
  if (!args) {
    return 'Arguments are missing.';
  }

  const { dbtype, url, username, password } = args;
  if (!dbtype || !url || !username || !password) {
    // Identify which specific arguments are missing for a more detailed error message
    const missingFields = [];
    if (!dbtype) missingFields.push('dbtype');
    if (!url) missingFields.push('url');
    if (!username) missingFields.push('username');
    if (!password) missingFields.push('password');

    return `Missing required information: ${missingFields.join(', ')}.`;
  }

  return true; // All validations passed
}
