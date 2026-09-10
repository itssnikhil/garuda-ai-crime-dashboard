import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.ts';

const { Pool } = pg;

export const isDbConfigured = Boolean(process.env.SQL_HOST || process.env.DATABASE_URL);

let pool: any = null;
let drizzleDb: any = null;

if (isDbConfigured) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err: any) => {
      console.warn('Database connection warning (running in hybrid mode):', err?.message || err);
    });

    drizzleDb = drizzle(pool, { schema });
  } catch (err) {
    console.warn('Could not initialize PostgreSQL pool. Fallback to in-memory mode.');
  }
}

export const db = drizzleDb;
export { pool };

