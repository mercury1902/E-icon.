import { supabase, TABLES } from '../lib/supabaseClient';

export async function saveMoodCheckin(sessionId, emotion) {
  if (!sessionId || !emotion) return null;

  const { data, error } = await supabase
    .from(TABLES.MOOD_CHECKINS)
    .insert({
      session_id: sessionId,
      emotion,
    })
    .select('id, created_at')
    .single();

  if (error) {
    console.error('saveMoodCheckin error:', error);
    return null;
  }

  return data;
}

export async function fetchMoodHistory(sessionId, days = 14) {
  if (!sessionId) return [];

  const { data, error } = await supabase
    .from(TABLES.MOOD_CHECKINS)
    .select('emotion, created_at')
    .eq('session_id', sessionId)
    .gte('created_at', new Date(Date.now() - days * 86400000).toISOString())
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('fetchMoodHistory error:', error);
    return [];
  }

  return data.map((entry) => ({
    emotion: entry.emotion,
    timestamp: new Date(entry.created_at).getTime(),
  }));
}

export async function fetchMoodTrend(sessionId, days = 14) {
  if (!sessionId) return [];

  const { data, error } = await supabase.rpc('get_mood_trend', {
    session_id_input: sessionId,
    days,
  });

  if (error) {
    console.error('fetchMoodTrend error:', error);
    return [];
  }

  return data;
}
