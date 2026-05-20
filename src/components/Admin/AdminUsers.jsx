import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, suspendUser, restoreUser } from '../../services/admin';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [suspendModal, setSuspendModal] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await deleteUser(userId);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSuspend = async (userId) => {
    setSuspendModal(userId);
    setSuspendReason('');
  };

  const confirmSuspend = async () => {
    if (!suspendModal) return;
    try {
      await suspendUser(suspendModal, suspendReason);
      setSuspendModal(null);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRestore = async (userId) => {
    try {
      await restoreUser(userId);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="admin-loading">Loading users...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-table-section">
      <div className="admin-table-toolbar">
        <span className="admin-table-count">{users.length} user(s)</span>
        <button className="admin-refresh-btn" onClick={loadUsers}>
          {'\u{1F504}'} Refresh
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Age</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="7" className="admin-table-empty">No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className={u.is_suspended ? 'suspended' : ''}>
                  <td><span className="admin-username">{u.username}</span></td>
                  <td className="admin-cell-muted">{u.email || '—'}</td>
                  <td>{u.age ?? '—'}</td>
                  <td>
                    <span className={`admin-role-badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {u.is_suspended ? (
                      <span className="admin-status-bad suspended">Suspended</span>
                    ) : u.deleted_at ? (
                      <span className="admin-status-bad deleted">Deleted</span>
                    ) : (
                      <span className="admin-status-bad active">Active</span>
                    )}
                  </td>
                  <td className="admin-cell-muted">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="admin-actions-cell">
                    {u.role !== 'admin' && !u.deleted_at && (
                      <>
                        {u.is_suspended ? (
                          <button className="admin-btn-sm admin-btn-restore" onClick={() => handleRestore(u.user_id)}>
                            Restore
                          </button>
                        ) : (
                          <button className="admin-btn-sm admin-btn-suspend" onClick={() => handleSuspend(u.user_id)}>
                            Suspend
                          </button>
                        )}
                        <button className="admin-btn-sm admin-btn-danger" onClick={() => handleDelete(u.user_id)}>
                          Delete
                        </button>
                      </>
                    )}
                    {u.role === 'admin' && <span className="admin-cell-muted">—</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {suspendModal && (
        <div className="admin-modal-overlay" onClick={() => setSuspendModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Suspend User</h3>
            <p>Reason for suspension:</p>
            <textarea
              className="admin-modal-input"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Enter reason..."
              rows={3}
            />
            <div className="admin-modal-actions">
              <button className="admin-btn-sm" onClick={() => setSuspendModal(null)}>Cancel</button>
              <button className="admin-btn-sm admin-btn-danger" onClick={confirmSuspend}>Suspend</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
