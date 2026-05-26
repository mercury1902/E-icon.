import { supabase, TABLES } from '../lib/supabaseClient';

export async function getPosts() {
  const { data, error } = await supabase
    .from(TABLES.POSTS)
    .select('*')
    .is('deleted_at', null)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getPostById(id) {
  const { data, error } = await supabase
    .from(TABLES.POSTS)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createPost({ content, tags, postPseudonym, avatarColor, emotionTag }) {
  const { data: sessionData, error: sessionError } = await supabase
    .rpc('claim_pseudonym');

  if (sessionError) throw sessionError;

  const pseudonym = sessionData?.[0] || { pseudonym: postPseudonym, avatar_color: avatarColor };

  const { data, error } = await supabase
    .from(TABLES.POSTS)
    .insert({
      post_pseudonym: pseudonym.pseudonym || postPseudonym,
      avatar_color: pseudonym.avatar_color || avatarColor,
      content,
      tags: tags || [],
      emotion_tag: emotionTag || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getReactionsForPost(postId) {
  const { data, error } = await supabase
    .from(TABLES.REACTIONS)
    .select('emoji, session_id')
    .eq('post_id', postId);

  if (error) throw error;
  return data || [];
}

export async function toggleReaction(postId, emoji) {
  const { data: existing } = await supabase
    .from(TABLES.REACTIONS)
    .select('id')
    .eq('post_id', postId)
    .eq('emoji', emoji)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from(TABLES.REACTIONS)
      .delete()
      .eq('id', existing.id);

    if (error) throw error;
    return { action: 'removed' };
  }

  const { error } = await supabase
    .from(TABLES.REACTIONS)
    .insert({ post_id: postId, emoji });

  if (error) throw error;
  return { action: 'added' };
}

export async function getCommentsForPost(postId) {
  const { data, error } = await supabase
    .from(TABLES.COMMENTS)
    .select('*')
    .eq('post_id', postId)
    .is('deleted_at', null)
    .eq('is_hidden', false)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addComment(postId, content, pseudonym, avatarColor, parentId = null) {
  const { data, error } = await supabase
    .from(TABLES.COMMENTS)
    .insert({
      post_id: postId,
      comment_pseudonym: pseudonym,
      avatar_color: avatarColor,
      content,
      parent_id: parentId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
