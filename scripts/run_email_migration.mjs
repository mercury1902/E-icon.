import pg from 'pg';
import fs from 'fs';
import path from 'path';

const dbPassword = process.env.SUPABASE_DB_PASSWORD || 'ca4TZOB1rJBrJX5O';

async function main() {
  const db = new pg.Client({
    host: 'db.cnzfmrivwohjzeoephug.supabase.co',
    port: 5432,
    user: 'postgres',
    password: dbPassword,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });
  await db.connect();
  console.log('Connected to PostgreSQL database.');

  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  const filePath = path.join(migrationsDir, '006_remove_strict_email_constraint.sql');
  
  console.log(`--- Running migration: 006_remove_strict_email_constraint.sql ---`);
  const sql = fs.readFileSync(filePath, 'utf8');
  try {
    await db.query(sql);
    console.log(`Successfully completed migration!`);
  } catch (err) {
    console.error(`ERROR running migration:`, err.message);
    process.exit(1);
  }

  await db.end();
}

main().catch(console.error);
