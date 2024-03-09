// Define the type for the database login arguments
export type ConnectDatabaseArguments = {
  dbtype: string;
  url: string;
  username: string;
  password: string;
};
// Define an interface for database logins
export interface DatabaseLogin {
  url: string;
  username: string;
  password: string;
}
// Define an interface for the database client
export interface DatabaseClient {
  connect(): Promise<void>;
}
