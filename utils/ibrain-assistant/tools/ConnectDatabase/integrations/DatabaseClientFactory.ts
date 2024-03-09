import { DatabaseLogin, DatabaseClient } from "../abstraction";
import { PostgresClient } from "./PostgresClient";
import { SQLClient } from "./SQLClient";
import { MySQLClient } from "./MySQLClient";

// Define a factory for creating database clients
export class DatabaseClientFactory {
  static createClient(dbtype: string, login: DatabaseLogin): DatabaseClient {
    switch (dbtype) {
      case 'mysql':
        return new MySQLClient(login);
      case 'sql':
        return new SQLClient(login);
      case 'postgres':
        return new PostgresClient(login);
      default:
        throw new Error('Unsupported database type.');
    }
  }
}
