import React, { useState, useEffect } from 'react';
import { getPosts, deletePost, hidePost, showPost } from '../../services/admin';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPosts();
      setPosts(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await deletePost(id);
      loadPosts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleHide = async (id, isHidden) => {
    try {
      if (isHidden) await showPost(id);
      else await hidePost(id);
      loadPosts();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="admin-loading">Loading posts...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-table-section">
      <div className="admin-table-toolbar">
        <span className="admin-table-count">{posts.length} post(s)</span>
        <button className="admin-refresh-btn" onClick={loadPosts}>
          {'\u{1F504}'} Refresh
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Author</th>
              <th>Content</th>
              <th>Tags</th>
              <th>Reports</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan="7" className="admin-table-empty">No posts found.</td></tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} className={p.is_hidden || p.deleted_at ? 'dimmed' : ''}>
                  <td><span className="admin-username">{p.post_pseudonym || 'Anonymous'}</span></td>
                  <td className="admin-cell-content">
                    <span className="admin-content-preview">
                      {expandedId === p.id ? p.content : p.content?.slice(0, 80) + (p.content?.length > 80 ? '...' : '')}
                    </span>
                    {p.content?.length > 80 && (
                      <button className="admin-expand-btn" onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                        {expandedId === p.id ? 'Less' : 'More'}
                      </button>
                    )}
                  </td>
                  <td>
                    {(p.tags || []).map((t) => (
                      <span key={t} className="admin-tag">#{t}</span>
                    ))}
                  </td>
                  <td>{p.report_count ?? 0}</td>
                  <td>
                    {p.deleted_at ? (
                      <span className="admin-status-bad deleted">Deleted</span>
                    ) : p.is_hidden ? (
                      <span className="admin-status-bad suspended">Hidden</span>
                    ) : p.is_flagged ? (
                      <span className="admin-status-bad warn">Flagged</span>
                    ) : (
                      <span className="admin-status-bad active">Visible</span>
                    )}
                  </td>
                  <td className="admin-cell-muted">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="admin-actions-cell">
                    {!p.deleted_at && (
                      <>
                        <button
                          className={`admin-btn-sm ${p.is_hidden ? 'admin-btn-restore' : 'admin-btn-suspend'}`}
                          onClick={() => handleToggleHide(p.id, p.is_hidden)}
                        >
                          {p.is_hidden ? 'Show' : 'Hide'}
                        </button>
                        <button className="admin-btn-sm admin-btn-danger" onClick={() => handleDelete(p.id)}>
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
