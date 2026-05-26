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
  HABIT_CATALOG: 'habit_catalog',
  USER_HABITS: 'user_habits',
  HABIT_LOG: 'habit_log',
  PARALLEL_THREADS: 'parallel_threads',
  PARALLEL_MESSAGES: 'parallel_messages',
  PARALLEL_LISTINGS: 'parallel_listings',
  PARALLEL_REQUESTS: 'parallel_requests',
};

export const AUTH_ERRORS = {
  WEAK_PASSWORD: 'Mật khẩu phải có ít nhất 6 ký tự',
  USER_EXISTS: 'Username already exists',
  INVALID_CREDENTIALS: 'Tên người dùng hoặc mật khẩu không đúng',
  USERNAME_REQUIRED: 'Vui lòng nhập tên người dùng',
  PASSWORD_REQUIRED: 'Vui lòng nhập mật khẩu',
  USERNAME_LENGTH: 'Tên người dùng phải có ít nhất 3 ký tự',
  USERNAME_FORMAT: 'Tên người dùng chỉ chứa chữ cái, số, gạch dưới và gạch ngang',
  AGE_RANGE: 'Tuổi phải từ 13 đến 120',
};

export function validateUsername(username) {
  if (!username) return 'Vui lòng nhập tên người dùng';
  
  if (username.includes(' ')) {
    return 'Inappropriate';
  }
  
  const trimmed = username.trim();
  if (!trimmed) return 'Vui lòng nhập tên người dùng';
  
  if (trimmed.length < 3 || trimmed.length > 26) {
    return 'Inappropriate';
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
    return 'Inappropriate';
  }
  
  return null;
}

export function validateLoginIdentifier(input) {
  if (!input || !input.trim()) return AUTH_ERRORS.USERNAME_REQUIRED;
  const trimmed = input.trim();
  const isEmailInput = trimmed.includes('@');
  if (isEmailInput) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Invalid email format';
  } else {
    if (trimmed.length < 3) return AUTH_ERRORS.USERNAME_LENGTH;
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) return AUTH_ERRORS.USERNAME_FORMAT;
  }
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

export const DISPOSABLE_DOMAINS_BLACKLIST = [
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  '10minutemail.com',
  'mailinator.com',
  'yopmail.com',
  'sharklasers.com',
  'dispostable.com',
  'getairmail.com',
  'maildrop.cc'
];

export function validateEmail(email) {
  if (!email || !email.trim()) return null; // Email is optional
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/;
  const match = trimmed.match(emailRegex);
  if (!match) {
    return 'Định dạng email không hợp lệ';
  }
  const domain = match[1].toLowerCase();
  // Validate phần đuôi TLD dài tối đa 10 ký tự
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2 || tld.length > 10) {
    return 'Định dạng email không hợp lệ';
  }
  return null;
}

export async function verifyEmailExternal(email) {
  if (!email || !email.trim()) return null;
  const trimmed = email.trim();
  
  const syntaxErr = validateEmail(trimmed);
  if (syntaxErr) return syntaxErr;
  
  const domain = trimmed.split('@')[1]?.toLowerCase();
  
  // 1. Chặn nhanh các domain disposable nổi tiếng (tĩnh)
  if (DISPOSABLE_DOMAINS_BLACKLIST.includes(domain)) {
    return 'Invalid or disposable email address';
  }
  
  // 2. Gọi dịch vụ xác thực bên ngoài
  const abstractApiKey = import.meta.env.VITE_ABSTRACT_API_KEY;
  try {
    if (abstractApiKey) {
      const res = await fetch(`https://emailverification.abstractapi.com/v1/?api_key=${abstractApiKey}&email=${trimmed}`);
      if (res.ok) {
        const data = await res.json();
        if (data.is_valid_format?.value === false || 
            data.is_disposable_email?.value === true || 
            data.is_mx_found?.value === false || 
            data.deliverability === 'UNDELIVERABLE') {
          return 'Invalid or disposable email address';
        }
        return null;
      }
    }
    
    // Fallback sang Disify API (miễn phí, có CORS)
    const res = await fetch(`https://api.disify.com/v1/email/${trimmed}`);
    if (res.ok) {
      const data = await res.json();
      if (data.disposable === true || data.dns === false) {
        return 'Invalid or disposable email address';
      }
    }
  } catch (err) {
    console.error('Lỗi khi xác thực email qua dịch vụ ngoài:', err);
  }
  
  return null;
}

export async function checkUsernameExists(username) {
  if (!username || !username.trim() || username.trim().length < 3 || username.trim().length > 26) return false;
  const { data, error } = await supabase.rpc('check_username_exists', {
    p_username: username.trim()
  });
  if (error) {
    console.error('Lỗi khi kiểm tra username trùng lặp:', error.message);
    return false;
  }
  return data;
}

export async function checkEmailExists(email) {
  if (!email || !email.trim()) return false;
  const { data, error } = await supabase.rpc('check_email_exists', {
    p_email: email.trim()
  });
  if (error) {
    console.error('Lỗi khi kiểm tra email trùng lặp:', error.message);
    return false;
  }
  return data;
}


