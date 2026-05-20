import { supabase } from '../lib/supabaseClient';

export async function getAnalytics() {
  const { data, error } = await supabase.rpc('admin_get_analytics');
  if (error) throw error;
  return data;
}

export async function getUsers() {
  const { data, error } = await supabase.rpc('admin_get_users');
  if (error) throw error;
  return data;
}

export async function getPosts() {
  const { data, error } = await supabase.rpc('admin_get_posts');
  if (error) throw error;
  return data;
}

export async function getComments() {
  const { data, error } = await supabase.rpc('admin_get_comments');
  if (error) throw error;
  return data;
}

export async function deletePost(postId) {
  const { data, error } = await supabase.rpc('admin_delete_post', { p_post_id: postId });
  if (error) throw error;
  return data;
}

export async function hidePost(postId) {
  const { data, error } = await supabase.rpc('admin_hide_post', { p_post_id: postId });
  if (error) throw error;
  return data;
}

export async function showPost(postId) {
  const { data, error } = await supabase.rpc('admin_show_post', { p_post_id: postId });
  if (error) throw error;
  return data;
}

export async function deleteComment(commentId) {
  const { data, error } = await supabase.rpc('admin_delete_comment', { p_comment_id: commentId });
  if (error) throw error;
  return data;
}

export async function hideComment(commentId) {
  const { data, error } = await supabase.rpc('admin_hide_comment', { p_comment_id: commentId });
  if (error) throw error;
  return data;
}

export async function showComment(commentId) {
  const { data, error } = await supabase.rpc('admin_show_comment', { p_comment_id: commentId });
  if (error) throw error;
  return data;
}

export async function deleteUser(userId) {
  const { data, error } = await supabase.rpc('admin_delete_user', { p_user_id: userId });
  if (error) throw error;
  return data;
}

export async function suspendUser(userId, reason) {
  const { data, error } = await supabase.rpc('admin_suspend_user', {
    p_user_id: userId,
    p_reason: reason || 'No reason provided',
  });
  if (error) throw error;
  return data;
}

export async function restoreUser(userId) {
  const { data, error } = await supabase.rpc('admin_restore_user', { p_user_id: userId });
  if (error) throw error;
  return data;
}

export async function getPostsPerDay(days = 30) {
  const { data, error } = await supabase.rpc('admin_get_posts_per_day', { p_days: days });
  if (error) throw error;
  return data;
}

export async function getActivityLog({ actionType, dateFrom, dateTo, limit = 50, offset = 0 } = {}) {
  const { data, error } = await supabase.rpc('admin_get_activity_log', {
    p_action_type: actionType || null,
    p_date_from: dateFrom || null,
    p_date_to: dateTo || null,
    p_limit: limit,
    p_offset: offset,
  });
  if (error) throw error;
  return data;
}

export async function getActivityCounts() {
  const { data, error } = await supabase.rpc('admin_get_activity_counts');
  if (error) throw error;
  return data;
}
