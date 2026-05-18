import React, { useState, useEffect, useCallback } from 'react';
import * as adminService from '../../services/adminService';

const PAGE_SIZE = 15;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(0);
  const [confirm, setConfirm] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data || []);
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users
    .filter((u) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (u.username || '').toLowerCase().includes(q) ||
        (u.nickname || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.role || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (!aVal) return 1;
      if (!bVal) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(0);
  };

  const handleAction = async (action, user) => {
    try {
      if (action === 'suspend') {
        const reason = prompt('Enter suspension reason:');
        if (reason === null) return;
        await adminService.suspendUser(user.user_id, reason);
      } else if (action === 'restore') {
        await adminService.restoreUser(user.user_id);
      } else if (action === 'delete') {
        await adminService.deleteUser(user.user_id);
      }
      setConfirm(null);
      await fetchUsers();
    } catch (e) {
      alert('Action failed: ' + e.message);
    }
  };

  const SortIcon = ({ column }) => {
    if (sortKey !== column) return <span className="sort-icon sort-inactive">{'\u{2195}'}</span>;
    return <span className="sort-icon">{sortDir === 'asc' ? '\u{2191}' : '\u{2193}'}</span>;
  };

  if (loading) {
    return <div className="admin-section-loading"><div className="admin-spinner" /></div>;
  }

  return (
    <div className="admin-section">
      <div className="admin-toolbar">
        <div className="admin-search">
          <span className="admin-search-icon" aria-hidden="true">{'\u{1F50D}'}</span>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="admin-search-input"
          />
        </div>
        <button className="admin-btn admin-btn-outline" onClick={() => adminService.exportToCsv(filtered, 'users.csv')}>
          {'\u{1F4E5}'} Export CSV
        </button>
        <span className="admin-count">{filtered.length} users</span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('username')}>Username <SortIcon column="username" /></th>
              <th onClick={() => toggleSort('nickname')}>Nickname <SortIcon column="nickname" /></th>
              <th onClick={() => toggleSort('email')}>Email <SortIcon column="email" /></th>
              <th onClick={() => toggleSort('age')}>Age <SortIcon column="age" /></th>
              <th onClick={() => toggleSort('role')}>Role <SortIcon column="role" /></th>
              <th>Status</th>
              <th onClick={() => toggleSort('created_at')}>Registered <SortIcon column="created_at" /></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={8} className="admin-empty">No users found</td></tr>
            ) : (
              paged.map((u) => (
                <tr key={u.id} className={u.is_suspended ? 'row-suspended' : ''}>
                  <td className="cell-primary">{u.username}</td>
                  <td>{u.nickname || '\u2014'}</td>
                  <td className="cell-mono">{u.email || '\u2014'}</td>
                  <td>{u.age || '\u2014'}</td>
                  <td>
                    <span className={`admin-role-badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td>
                    {u.deleted_at ? (
                      <span className="status-badge status-deleted">Deleted</span>
                    ) : u.is_suspended ? (
                      <span className="status-badge status-suspended" title={u.suspension_reason}>Suspended</span>
                    ) : (
                      <span className="status-badge status-active">Active</span>
                    )}
                  </td>
                  <td className="cell-date">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '\u2014'}</td>
                  <td className="cell-actions">
                    {u.role !== 'admin' && (
                      <>
                        {u.is_suspended ? (
                          <button className="admin-btn-sm admin-btn-restore" onClick={() => handleAction('restore', u)}
                            title="Restore user">Restore</button>
                        ) : (
                          <button className="admin-btn-sm admin-btn-warn" onClick={() => setConfirm({ action: 'suspend', user: u })}
                            title="Suspend user">Suspend</button>
                        )}
                        <button className="admin-btn-sm admin-btn-danger" onClick={() => setConfirm({ action: 'delete', user: u })}
                          title="Delete user">Delete</button>
                      </>
                    )}
                    {u.role === 'admin' && <span className="admin-na">\u2014</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {confirm && (
        <div className="admin-modal-overlay" onClick={() => setConfirm(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to <strong>{confirm.action}</strong> user <strong>{confirm.user.username}</strong>?
              {confirm.action === 'delete' && <span className="modal-warning"> This action cannot be easily undone.</span>}
            </p>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-outline" onClick={() => setConfirm(null)}>Cancel</button>
              <button
                className={`admin-btn ${confirm.action === 'delete' ? 'admin-btn-danger' : confirm.action === 'suspend' ? 'admin-btn-warn' : 'admin-btn-primary'}`}
                onClick={() => handleAction(confirm.action, confirm.user)}
              >
                Confirm {confirm.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
