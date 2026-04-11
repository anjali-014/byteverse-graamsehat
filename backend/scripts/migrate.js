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

try {
  await client.connect();
  const sql = readFileSync(join(__dir, '../migrations/001_init.sql'), 'utf8');
  await client.query(sql);
  console.log('[Migrate] Schema applied successfully');
} catch (err) {
  console.error('[Migrate] Failed:', err.message);
  process.exit(1);
} finally {
  await client.end();
}