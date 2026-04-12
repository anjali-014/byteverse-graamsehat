import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const __dir = dirname(fileURLToPath(import.meta.url));
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

console.log('[Seed] DATABASE_URL:', process.env.DATABASE_URL);

await client.connect();
console.log('[Seed] Connected');

const sql = readFileSync(join(__dir, '../seeds/demo_data.sql'), 'utf8');
console.log('[Seed] SQL length:', sql.length);
await client.query(sql);
console.log('[Seed] Demo data inserted successfully');

await client.end();