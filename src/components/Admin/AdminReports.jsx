import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { deletePost, deleteComment, hidePost, hideComment, showPost, showComment } from '../../services/admin';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: reportData, error: reportErr } = await supabase
        .from('content_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportErr) throw reportErr;
      setReports(reportData || []);

      const { data: postData, error: postErr } = await supabase.rpc('admin_get_posts');
      if (postErr) throw postErr;
      setPosts(postData || []);
    } catch (err) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const getTargetContent = (report) => {
    if (report.target_type === 'post') {
      const post = posts.find((p) => p.id === report.target_id);
      return post?.content?.slice(0, 120) || 'Deleted post';
    }
    return 'Comment (view details in Comments tab)';
  };

  const handleQuickHide = async (report) => {
    try {
      if (report.target_type === 'post') {
        await hidePost(report.target_id);
      } else {
        await hideComment(report.target_id);
      }
      loadReports();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="admin-loading">Loading reports...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-table-section">
      <div className="admin-table-toolbar">
        <span className="admin-table-count">{reports.length} report(s)</span>
        <button className="admin-refresh-btn" onClick={loadReports}>
          {'\u{1F504}'} Refresh
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="admin-empty-state">
          <span className="admin-empty-icon" aria-hidden="true">{'\u{2705}'}</span>
          <p>No reports to review. All clear!</p>
        </div>
      ) : (
        <div className="admin-reports-list">
          {reports.map((r) => (
            <div key={r.id} className="admin-report-card">
              <div className="admin-report-header">
                <span className="admin-report-type">{r.target_type}</span>
                <span className="admin-report-reason">{r.reason}</span>
                <span className="admin-report-time">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="admin-report-content">{getTargetContent(r)}</p>
              <div className="admin-report-actions">
                <button
                  className="admin-btn-sm admin-btn-suspend"
                  onClick={() => handleQuickHide(r)}
                >
                  Hide Content
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
