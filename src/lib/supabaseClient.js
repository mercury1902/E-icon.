import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Supabase credentials missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-app-name': 'murmur',
    },
  },
});

export const TABLES = {
  POSTS: 'posts',
  COMMENTS: 'comments',
  REACTIONS: 'reactions',
  MOOD_CHECKINS: 'mood_checkins',
  ANONYMOUS_SESSIONS: 'anonymous_sessions',
  PSEUDONYM_POOL: 'pseudonym_pool',
  PROFILES: 'profiles',
};

export const AUTH_ERRORS = {
  WEAK_PASSWORD: 'Mật khẩu phải có ít nhất 6 ký tự',
  USER_EXISTS: 'Tên người dùng này đã được đăng ký',
  INVALID_CREDENTIALS: 'Tên người dùng hoặc mật khẩu không đúng',
  USERNAME_REQUIRED: 'Vui lòng nhập tên người dùng',
  PASSWORD_REQUIRED: 'Vui lòng nhập mật khẩu',
  USERNAME_LENGTH: 'Tên người dùng phải có ít nhất 3 ký tự',
  USERNAME_FORMAT: 'Tên người dùng chỉ chứa chữ cái, số, gạch dưới và gạch ngang',
  AGE_RANGE: 'Tuổi phải từ 13 đến 120',
};

export function validateUsername(username) {
  if (!username || !username.trim()) return AUTH_ERRORS.USERNAME_REQUIRED;
  if (username.trim().length < 3) return AUTH_ERRORS.USERNAME_LENGTH;
  if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) return AUTH_ERRORS.USERNAME_FORMAT;
  return null;
}

export function validatePassword(password) {
  if (!password) return AUTH_ERRORS.PASSWORD_REQUIRED;
  if (password.length < 6) return AUTH_ERRORS.WEAK_PASSWORD;
  return null;
}

export function validateAge(age) {
  if (!age || age === '') return null;
  const num = parseInt(age, 10);
  if (isNaN(num) || num < 13 || num > 120) return AUTH_ERRORS.AGE_RANGE;
  return null;
}
