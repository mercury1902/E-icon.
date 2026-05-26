import pg from 'pg';

const key = process.env.SUPABASE_DB_PASSWORD || 'ca4TZOB1rJBrJX5O';

async function main() {
  const db = new pg.Client({
    host: 'db.cnzfmrivwohjzeoephug.supabase.co',
    port: 5432,
    user: 'postgres',
    password: key,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });
  await db.connect();

  console.log('=== Tables in public schema ===');
  const { rows: tables } = await db.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

  for (const t of tables) {
    console.log(`\nTable: ${t.table_name}`);
    const { rows: columns } = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position;
    `, [t.table_name]);
    for (const c of columns) {
      console.log(`  - ${c.column_name} (${c.data_type})${c.is_nullable === 'NO' ? ' NOT NULL' : ''}${c.column_default ? ' DEFAULT ' + c.column_default : ''}`);
    }
  }

  await db.end();
}

main().catch(console.error);
