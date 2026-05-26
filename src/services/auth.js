import { supabase, validateEmail } from '../lib/supabaseClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

function sanitizeUsername(username) {
  return username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
}

function isEmail(input) {
  return typeof input === 'string' && input.includes('@');
}

export async function signUp({ username, password, email, age }) {
  if (email && email.trim()) {
    const emailErr = validateEmail(email);
    if (emailErr) throw new Error(emailErr);
  }

  // Gọi Edge Function để đăng ký tài khoản (vá bảo mật, tránh lộ service_role_key)
  const { data, error } = await supabase.functions.invoke('signup', {
    body: {
      username: username.trim(),
      password,
      email: email && email.trim() ? email.trim() : undefined,
      age: age ? parseInt(age, 10) : null
    }
  });

  if (error) {
    // Lấy thông điệp lỗi chi tiết từ Deno Edge Function
    let errMsg = 'Registration failed. Please try again.';
    try {
      if (error.context) {
        const errJson = await error.context.json();
        if (errJson && errJson.error) errMsg = errJson.error;
      }
    } catch {
      errMsg = error.message || errMsg;
    }
    throw new Error(errMsg);
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

export async function updateProfile(updates) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
