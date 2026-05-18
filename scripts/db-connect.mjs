import pg from 'pg';

const ref = process.env.VITE_SUPABASE_URL?.match(/https?:\/\/(.+)\.supabase\.co/)?.[1] ?? '';
const key = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ?? '';

async function tryConnect(host, port, user, password, label) {
  const client = new pg.Client({
    host, port, user, password,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  try {
    await client.connect();
    const res = await client.query('SELECT version()');
    console.log(`OK [${label}] ${res.rows[0].version}`);
    await client.end();
    return true;
  } catch (e) {
    console.log(`FAIL [${label}] ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('=== Testing Supabase DB connections with service_role key ===\n');

  // 1. Direct connection
  await tryConnect(`db.${ref}.supabase.co`, 5432, 'postgres', key, 'Direct');

  // 2. Pooler with common regions
  const regions = ['us-east-1', 'eu-west-1', 'ap-southeast-1', 'ap-northeast-1'];
  for (const region of regions) {
    const ok = await tryConnect(
      `aws-0-${region}.pooler.supabase.com`, 6543,
      `postgres.${ref}`, key,
      `Pooler ${region}`
    );
    if (ok) break;
  }
}

main().catch(console.error);
