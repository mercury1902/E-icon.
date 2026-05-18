import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

// Create admin user via Supabase Auth
const username = 'admin';
const password = 'Admin123!';
const email = 'admin@murmur.local';

const { data: authUser, error: signUpError } = await supabase.auth.admin.createUser({
  email: email,
  password: password,
  email_confirm: true,
  user_metadata: { username: username }
});

if (signUpError) {
  console.log('Sign up error:', signUpError.message);
  // Try to find existing user
  const { data: users } = await supabase.auth.admin.listUsers();
  const existing = users?.users?.find(u => u.email === email);
  if (existing) {
    console.log('Admin user already exists with ID: ' + existing.id);
    // Promote to admin if not already
    await promoteToAdmin(existing.id);
  }
  process.exit(0);
}

console.log('Admin user created with ID: ' + authUser.user.id);

// Promote to admin
await promoteToAdmin(authUser.user.id);

async function promoteToAdmin(userId) {
  const db = new pg.Client({
    host: 'db.cnzfmrivwohjzeoephug.supabase.co', port: 5432,
    user: 'postgres', password: 'ca4TZOB1rJBrJX5O',
    database: 'postgres', ssl: { rejectUnauthorized: false }
  });
  await db.connect();

  // Check if profile exists (created by trigger)
  const { rows: profiles } = await db.query("SELECT username, role FROM profiles WHERE user_id = $1", [userId]);
  if (profiles.length === 0) {
    // Profile not auto-created, create it manually
    await db.query(
      "INSERT INTO profiles (user_id, username, role) VALUES ($1, $2, 'admin') ON CONFLICT (user_id) DO UPDATE SET role = 'admin'",
      [userId, username]
    );
  } else {
    await db.query("UPDATE profiles SET role = 'admin' WHERE user_id = $1", [userId]);
  }
  console.log('User promoted to admin');

  // Verify
  const { rows: check } = await db.query("SELECT username, role FROM profiles WHERE user_id = $1", [userId]);
  console.log('Profile: ' + JSON.stringify(check[0]));

  await db.end();
}

console.log('\nLogin with:');
console.log('  Username: ' + username);
console.log('  Password: ' + password);
console.log('  URL: /admin');
