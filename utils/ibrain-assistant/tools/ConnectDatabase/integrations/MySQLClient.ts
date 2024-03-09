import { DatabaseLogin, DatabaseClient } from "../abstraction";

// MySQL database client

export class MySQLClient implements DatabaseClient {
  constructor(private login: DatabaseLogin) { }

  connect(): void {
    console.log('Connecting to MySQL database...');
    // Implement MySQL connection logic
  }
}
