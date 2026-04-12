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

console.log('[Migrate] DATABASE_URL:', process.env.DATABASE_URL);

try {
  await client.connect();
  console.log('[Migrate] Connected to database');
  
  // Test simple query
  const testResult = await client.query('SELECT current_database(), current_user');
  console.log('[Migrate] DB:', testResult.rows[0]);
  
  const sql = readFileSync(join(__dir, '../migrations/001_init.sql'), 'utf8');
  console.log('[Migrate] SQL loaded, length:', sql.length);
  await client.query(sql);
  console.log('[Migrate] Schema applied successfully');
  
  // Test if table exists
  const tableResult = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  console.log('[Migrate] Tables:', tableResult.rows.map(r => r.table_name));
} catch (err) {
  console.error('[Migrate] Failed:', err.message);
  process.exit(1);
} finally {
  await client.end();
}