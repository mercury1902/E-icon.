import React, { useState, useEffect } from 'react';
import { getComments, deleteComment, hideComment, showComment } from '../../services/admin';

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getComments();
      setComments(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment permanently?')) return;
    try {
      await deleteComment(id);
      loadComments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleHide = async (id, isHidden) => {
    try {
      if (isHidden) await showComment(id);
      else await hideComment(id);
      loadComments();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="admin-loading">Loading comments...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-table-section">
      <div className="admin-table-toolbar">
        <span className="admin-table-count">{comments.length} comment(s)</span>
        <button className="admin-refresh-btn" onClick={loadComments}>
          {'\u{1F504}'} Refresh
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Post ID</th>
              <th>Author</th>
              <th>Content</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 ? (
              <tr><td colSpan="6" className="admin-table-empty">No comments found.</td></tr>
            ) : (
              comments.map((c) => (
                <tr key={c.id} className={c.is_hidden || c.deleted_at ? 'dimmed' : ''}>
                  <td className="admin-cell-muted">{c.post_id?.slice(0, 8)}...</td>
                  <td><span className="admin-username">{c.comment_pseudonym || 'Anonymous'}</span></td>
                  <td className="admin-cell-content">
                    <span className="admin-content-preview">{c.content?.slice(0, 100)}{c.content?.length > 100 ? '...' : ''}</span>
                  </td>
                  <td>
                    {c.deleted_at ? (
                      <span className="admin-status-bad deleted">Deleted</span>
                    ) : c.is_hidden ? (
                      <span className="admin-status-bad suspended">Hidden</span>
                    ) : c.is_flagged ? (
                      <span className="admin-status-bad warn">Flagged</span>
                    ) : (
                      <span className="admin-status-bad active">Visible</span>
                    )}
                  </td>
                  <td className="admin-cell-muted">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="admin-actions-cell">
                    {!c.deleted_at && (
                      <>
                        <button
                          className={`admin-btn-sm ${c.is_hidden ? 'admin-btn-restore' : 'admin-btn-suspend'}`}
                          onClick={() => handleToggleHide(c.id, c.is_hidden)}
                        >
                          {c.is_hidden ? 'Show' : 'Hide'}
                        </button>
                        <button className="admin-btn-sm admin-btn-danger" onClick={() => handleDelete(c.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
