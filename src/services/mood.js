import { supabase, TABLES } from '../lib/supabaseClient';

export async function saveMoodCheckin(emotion) {
  const { data, error } = await supabase
    .from(TABLES.MOOD_CHECKINS)
    .insert({ emotion })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMoodHistory(days = 7) {
  const { data, error } = await supabase
    .from(TABLES.MOOD_CHECKINS)
    .select('*')
    .gte('created_at', new Date(Date.now() - days * 86400000).toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
