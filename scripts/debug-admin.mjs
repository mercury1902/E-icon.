import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? 'https://cnzfmrivwohjzeoephug.supabase.co';
const ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';
const SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ?? '';

const supabase = createClient(SUPABASE_URL, ANON_KEY);
const admin_client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

console.log('=== STEP 1: Checking existing profiles ===');
const { data: profiles, error: profilesErr } = await admin_client
  .from('profiles')
  .select('id, user_id, username, role, is_suspended')
  .limit(10);
if (profilesErr) console.log('profiles query error:', profilesErr.message);
else console.log('Profiles:', JSON.stringify(profiles, null, 2));

console.log('\n=== STEP 2: Test login as admin ===');
const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
  email: 'admin@murmur.local',
  password: 'Admin123!',
});
if (loginErr) {
  console.log('LOGIN FAILED:', loginErr.message);
} else {
  console.log('LOGIN SUCCESS! User ID:', loginData.user.id);
}

console.log('\n=== STEP 3: Test checkAdmin query (profiles direct) ===');
const { data: { user: currentUser } } = await supabase.auth.getUser();
console.log('Current user:', currentUser?.id || 'null');

if (currentUser) {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', currentUser.id)
    .single();
  console.log('Profile query result:', JSON.stringify(profileData));
  console.log('Profile query error:', profileError?.message || 'none');
  console.log('Is admin?', profileData?.role === 'admin');
}

console.log('\n=== STEP 4: Test is_admin RPC ===');
const { data: isAdminData, error: isAdminErr } = await supabase.rpc('is_admin');
console.log('is_admin result:', JSON.stringify(isAdminData));
console.log('is_admin error:', isAdminErr?.message || 'none');

console.log('\n=== STEP 5: Test admin_get_users RPC ===');
const { data: usersData, error: usersErr } = await supabase.rpc('admin_get_users');
if (usersErr) {
  console.log('admin_get_users ERROR:', usersErr.message);
  console.log('Details:', JSON.stringify(usersErr));
} else {
  console.log('admin_get_users OK, rows:', Array.isArray(usersData) ? usersData.length : 'non-array');
}

console.log('\n=== STEP 6: Test admin_get_posts RPC ===');
const { data: postsData, error: postsErr } = await supabase.rpc('admin_get_posts');
if (postsErr) {
  console.log('admin_get_posts ERROR:', postsErr.message);
} else {
  console.log('admin_get_posts OK, rows:', Array.isArray(postsData) ? postsData.length : 'non-array');
}

console.log('\n=== STEP 7: Test RLS policies ===');
const { data: policies, error: policiesErr } = await admin_client
  .from('pg_policies')
  .select('*')
  .eq('tablename', 'profiles');
if (policiesErr) console.log('policies error:', policiesErr.message);
else {
  console.log('profiles RLS policies:');
  for (const p of policies) {
    console.log(`  ${p.policyname}: ${p.cmd} → ${p.qual}`);
  }
}

await supabase.auth.signOut();
console.log('\nDone.');
