import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const dbPath = process.env.DATABASE_URL || 'file:./dev.db';
console.log('Database path:', dbPath);
const client = createClient({ url: dbPath });
export const db = drizzle(client);

export async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}