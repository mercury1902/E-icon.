import { supabase, TABLES } from '../lib/supabaseClient';

export async function reportContent({ targetType, targetId, reason, sessionTokenHash }) {
  if (!targetType || !targetId || !reason) {
    return { error: 'Missing required fields' };
  }

  const { data, error } = await supabase
    .from(TABLES.CONTENT_REPORTS)
    .insert({
      target_type: targetType,
      target_id: targetId,
      reason,
      session_token_hash: sessionTokenHash,
    })
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') {
      return { error: 'Already reported' };
    }
    console.error('reportContent error:', error);
    return { error: 'Failed to submit report' };
  }

  return { id: data.id };
}

export const REPORT_REASONS = [
  'harassment',
  'self_harm',
  'personal_info',
  'spam',
  'other',
];
