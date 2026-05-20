import { supabase } from '../lib/supabaseClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

function sanitizeUsername(username) {
  return username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
}

function isEmail(input) {
  return typeof input === 'string' && input.includes('@');
}

export async function signUp({ username, password, email, age }) {
  const sanitized = sanitizeUsername(username);
  const userEmail = email && email.trim()
    ? email.trim()
    : `anon_${sanitized}@murmur.app`;

  const { data, error } = await supabase.auth.signUp({
    email: userEmail,
    password,
    options: {
      data: {
        username: username.trim(),
        age: age ? parseInt(age, 10) : null,
        has_real_email: !!(email && email.trim()),
      },
    },
  });

  if (error) throw error;

  if (data?.user) {
    // Attempt auto-confirm via admin API (may be blocked by browser User-Agent)
    if (serviceRoleKey) {
      try {
        await fetch(`${supabaseUrl}/auth/v1/admin/users/${data.user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
          },
          body: JSON.stringify({ email_confirm: true }),
        });
      } catch {
        // auto-confirm may be blocked in browser
      }
    }
  }

  return data;
}

function trySignInWithPassword(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signIn({ username, password }) {
  if (isEmail(username)) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username.trim(),
      password,
    });
    if (error) throw error;
    return data;
  }

  const sanitized = sanitizeUsername(username);
  const fakeEmail = `anon_${sanitized}@murmur.app`;

  // Attempt 1: deterministic fake email (new users)
  const { data: result1, error: err1 } = await trySignInWithPassword(fakeEmail, password);

  if (!err1) return result1;

  // Re-throw "Email not confirmed" immediately — user exists but unconfirmed
  if (err1?.message?.includes('Email not confirmed')) throw err1;

  // Only fallback if the error is "Invalid login credentials" (user not found or wrong password)
  // This avoids swallowing unexpected errors (network, rate-limit, etc.)
  if (!err1?.message?.includes('Invalid login credentials')) throw err1;

  // Attempt 2: look up legacy email from profiles table via RPC
  const { data: emailData, error: emailError } = await supabase
    .rpc('get_email_by_username', { lookup_username: username.trim() });

  if (emailError || !emailData) {
    throw new Error('Tên người dùng hoặc mật khẩu không đúng');
  }

  const { data: result2, error: err2 } = await trySignInWithPassword(emailData, password);

  if (err2) throw new Error('Tên người dùng hoặc mật khẩu không đúng');
  return result2;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function checkIsAdmin() {
  const { data, error } = await supabase.rpc('is_admin');
  if (error) return false;
  return data;
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}
