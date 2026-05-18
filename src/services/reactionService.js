import { supabase, TABLES } from '../lib/supabaseClient';

export async function toggleReaction(sessionId, postId, emoji) {
  if (!sessionId || !postId || !emoji) return null;

  const { data: existing } = await supabase
    .from(TABLES.REACTIONS)
    .select('id')
    .eq('post_id', postId)
    .eq('session_id', sessionId)
    .eq('emoji', emoji)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from(TABLES.REACTIONS)
      .delete()
      .eq('id', existing.id);

    if (error) {
      console.error('toggleReaction delete error:', error);
      return null;
    }

    return { action: 'removed' };
  }

  const { error } = await supabase
    .from(TABLES.REACTIONS)
    .insert({
      post_id: postId,
      session_id: sessionId,
      emoji,
    });

  if (error) {
    console.error('toggleReaction insert error:', error);
    return null;
  }

  return { action: 'added' };
}

export async function getReactionCounts(postId) {
  const { data, error } = await supabase
    .from('reaction_counts')
    .select('emoji, count')
    .eq('post_id', postId);

  if (error) return {};

  const result = {};
  data.forEach((r) => {
    result[r.emoji] = r.count;
  });
  return result;
}

export async function getUserReactions(sessionId, postIds) {
  if (!sessionId || !postIds.length) return {};

  const { data, error } = await supabase
    .from(TABLES.REACTIONS)
    .select('post_id, emoji')
    .eq('session_id', sessionId)
    .in('post_id', postIds);

  if (error) return {};

  const result = {};
  data.forEach((r) => {
    if (!result[r.post_id]) result[r.post_id] = {};
    result[r.post_id][r.emoji] = true;
  });
  return result;
}
