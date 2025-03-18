import { drizzle } from 'drizzle-orm/neon-serverless';
import { Client } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

// Use environment variable for database URL
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/shield_db';

// Create a SQL client with the connection string
const sql = new Client(DATABASE_URL);

// Create a drizzle client with the schema
export const db = drizzle(sql, { schema });