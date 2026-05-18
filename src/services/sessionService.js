import { supabase, TABLES } from '../lib/supabaseClient';
import { sha256 } from '../utils/crypto';

const SESSION_STORAGE_KEY = 'murmur_session';

function generateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function getOrCreateSession() {
  const cached = localStorage.getItem(SESSION_STORAGE_KEY);
  if (cached) {
    try {
      const session = JSON.parse(cached);
      const { data, error } = await supabase
        .from(TABLES.ANONYMOUS_SESSIONS)
        .select('id, pseudonym, avatar_color, post_count, is_active')
        .eq('token_hash', await sha256(session.token))
        .single();

      if (data && data.is_active) {
        await supabase
          .from(TABLES.ANONYMOUS_SESSIONS)
          .update({ last_active: new Date().toISOString() })
          .eq('id', data.id);

        return {
          id: data.id,
          pseudonym: data.pseudonym,
          avatarColor: data.avatar_color,
          postCount: data.post_count,
          token: session.token,
        };
      }
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  return createNewSession();
}

export async function createNewSession() {
  const token = generateToken();
  const tokenHash = await sha256(token);

  const pseudo = generateFallbackPseudonym();

  const { data, error } = await supabase
    .from(TABLES.ANONYMOUS_SESSIONS)
    .insert({
      token_hash: tokenHash,
      pseudonym: pseudo.name,
      avatar_color: pseudo.color,
    })
    .select('id, pseudonym, avatar_color')
    .single();

  if (error) {
    console.error('Session creation failed:', error);
    return null;
  }

  const session = {
    id: data.id,
    pseudonym: data.pseudonym,
    avatarColor: data.avatar_color,
    postCount: 0,
    token,
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export async function refreshSessionActivity(sessionId) {
  await supabase
    .from(TABLES.ANONYMOUS_SESSIONS)
    .update({ last_active: new Date().toISOString() })
    .eq('id', sessionId);
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

function generateFallbackPseudonym() {
  const adjectives = [
    'Gentle','Quiet','Soft','Warm','Calm','Bright','Deep','Free',
    'Kind','Brave','True','Wild','Still','Fair','Pure','Bold',
    'Sage','Clear','Rising','Steady','Lunar','Solar','Silent','Honest',
  ];
  const nouns = [
    'Oak','Wave','Glow','Sky','Moon','Star','River','Forest',
    'Heart','Light','Pine','Cloud','Breeze','Dawn','Meadow',
    'Tide','Haven','Ember','Willow','Cedar','Stone','Feather',
    'Horizon','Garden',
  ];
  const colors = [
    '#A78BFA','#67E8F9','#6EE7B7','#F87171','#FBBF24',
    '#60A5FA','#E879F9','#34D399','#38BDF8','#FB923C',
  ];

  return {
    name:
      adjectives[Math.floor(Math.random() * adjectives.length)] +
      nouns[Math.floor(Math.random() * nouns.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
  };
}
