import { DatabaseLogin, DatabaseClient } from '../abstraction';

// SQL Server database client

export class SQLClient implements DatabaseClient {
  constructor(private login: DatabaseLogin) {}

  async connect() {
    console.log('Connecting to SQL Server database...');
    // Implement SQL Server connection logic
  }
}
