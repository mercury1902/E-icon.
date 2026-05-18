import { supabase } from '../lib/supabaseClient';

export async function checkAdmin(user) {
  if (!user) return false;
  const admin = await userIsAdmin(user.id);
  return admin;
}

async function userIsAdmin(userId) {
  try {
    const { data, error } = await supabase.rpc('is_admin');
    if (error) return false;
    return data === true;
  } catch {
    return false;
  }
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

export async function suspendUser(userId, reason = '') {
  const { data, error } = await supabase.rpc('admin_suspend_user', {
    p_user_id: userId,
    p_reason: reason,
  });
  if (error) throw error;
  return data;
}

export async function restoreUser(userId) {
  const { data, error } = await supabase.rpc('admin_restore_user', {
    p_user_id: userId,
  });
  if (error) throw error;
  return data;
}

export async function deleteUser(userId) {
  const { data, error } = await supabase.rpc('admin_delete_user', {
    p_user_id: userId,
  });
  if (error) throw error;
  return data;
}

export async function hidePost(postId) {
  const { data, error } = await supabase.rpc('admin_hide_post', {
    p_post_id: postId,
  });
  if (error) throw error;
  return data;
}

export async function showPost(postId) {
  const { data, error } = await supabase.rpc('admin_show_post', {
    p_post_id: postId,
  });
  if (error) throw error;
  return data;
}

export async function deletePost(postId) {
  const { data, error } = await supabase.rpc('admin_delete_post', {
    p_post_id: postId,
  });
  if (error) throw error;
  return data;
}

export async function hideComment(commentId) {
  const { data, error } = await supabase.rpc('admin_hide_comment', {
    p_comment_id: commentId,
  });
  if (error) throw error;
  return data;
}

export async function showComment(commentId) {
  const { data, error } = await supabase.rpc('admin_show_comment', {
    p_comment_id: commentId,
  });
  if (error) throw error;
  return data;
}

export async function deleteComment(commentId) {
  const { data, error } = await supabase.rpc('admin_delete_comment', {
    p_comment_id: commentId,
  });
  if (error) throw error;
  return data;
}

export async function getActivityLog({ limit = 100, offset = 0, actionType = null, dateFrom = null, dateTo = null } = {}) {
  const { data, error } = await supabase.rpc('admin_get_activity_log', {
    p_limit: limit,
    p_offset: offset,
    p_action_type: actionType,
    p_date_from: dateFrom,
    p_date_to: dateTo,
  });
  if (error) throw error;
  return data;
}

export async function getAnalytics() {
  const { data, error } = await supabase.rpc('admin_get_analytics');
  if (error) throw error;
  return data;
}

export async function getPostsPerDay(days = 30) {
  const { data, error } = await supabase.rpc('admin_get_posts_per_day', {
    p_days: days,
  });
  if (error) throw error;
  return data;
}

export async function getActivityCounts() {
  const { data, error } = await supabase.rpc('admin_get_activity_counts');
  if (error) throw error;
  return data;
}

export async function getReportStats() {
  const { data, error } = await supabase.rpc('admin_get_report_stats');
  if (error) throw error;
  return data;
}

export function subscribeActivity(callback) {
  const channel = supabase
    .channel('admin-activity-log')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'activity_log' },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function exportToCsv(data, filename = 'export.csv') {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
