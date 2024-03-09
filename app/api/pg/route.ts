import { NextRequest } from 'next/server';
import { Client } from 'pg';

export async function POST(req: NextRequest) {
  try {
    // Connect to PostgreSQL database
    const client = new Client({
      connectionString:
        'postgres://postgres.fnoahliscckwrgdrmkkw:UOKW1RW6eyovVEHt@aws-0-us-west-1.pooler.supabase.com:5432/postgres' // Set your PostgreSQL connection string here
    });
    await client.connect();

    // Query to retrieve table details from the public schema
    const query = `
      SELECT 
        tables.table_name AS table_name,
        columns.column_name AS column_name,
        columns.data_type AS data_type
      FROM 
        information_schema.tables AS tables
      JOIN 
        information_schema.columns AS columns
      ON 
        tables.table_name = columns.table_name
      WHERE 
        tables.table_schema = 'public'
      ORDER BY 
        tables.table_name, 
        columns.ordinal_position;
    `;
    const result = await client.query(query);

    // Extract table details from the query result
    const tables:any = {};
    result.rows.forEach((row) => {
      const tableName = row.table_name;
      if (!tables[tableName]) {
        tables[tableName] = {
          columns: []
        };
      }
      tables[tableName].columns.push({
        column_name: row.column_name,
        data_type: row.data_type
      });
    });

    await client.end();

    // Return the list of database names
    return new Response(JSON.stringify({ tables }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('An error occurred:', error);

    // Return error response
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
