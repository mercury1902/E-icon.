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
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migration file(s). Running them in order...\n`);

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    console.log(`--- Running migration: ${file} ---`);
    const sql = fs.readFileSync(filePath, 'utf8');
    try {
      await db.query(sql);
      console.log(`Successfully completed migration: ${file}\n`);
    } catch (err) {
      console.error(`ERROR running migration ${file}:`, err.message);
      console.error('Stack trace:', err.stack);
      process.exit(1);
    }
  }

  console.log('All migrations completed successfully.');
  await db.end();
}

main().catch(console.error);
