import { DatabaseLogin, DatabaseClient } from '../abstraction';

export class PostgresClient implements DatabaseClient {
  constructor(private login: DatabaseLogin) {}

  async connect(): Promise<void> {
    try {
      console.log('Connecting to PostgreSQL database...');

      const url = '/api/pg'; // Assuming your API is served from the same domain

      const data = {
        // Your POST data here
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(
          `Failed to connect: ${response.status} ${response.statusText}`
        );
      }
      const d = await response.json();
      console.log('Connected to PostgreSQL database: ', d);
    } catch (error) {
      console.error('Error connecting to PostgreSQL database:', error);
      throw new Error('Failed to connect to PostgreSQL database');
    }
  }
}
