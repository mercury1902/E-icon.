import React, { useState, useEffect } from 'react';
import { getActivityLog, getActivityCounts } from '../../services/admin';

export default function AdminActivityLog() {
  const [logs, setLogs] = useState([]);
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const [logData, countData] = await Promise.all([
        getActivityLog({
          actionType: filterType || null,
          dateFrom: dateFrom || null,
          dateTo: dateTo || null,
          limit: 100,
        }),
        getActivityCounts(),
      ]);
      setLogs(logData || []);
      setCounts(countData || []);
    } catch (err) {
      setError(err.message || 'Failed to load activity log');
    } finally {
      setLoading(false);
    }
  };

  const actionLabels = {
    post_created: 'Post Created',
    comment_added: 'Comment Added',
    report_filed: 'Report Filed',
  };

  return (
    <div className="admin-table-section">
      <div className="admin-filters">
        <select
          className="admin-filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Actions</option>
          {counts.map((c) => (
            <option key={c.action_type} value={c.action_type}>
              {actionLabels[c.action_type] || c.action_type} ({c.count})
            </option>
          ))}
        </select>
        <input
          type="date"
          className="admin-filter-date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          placeholder="From"
        />
        <input
          type="date"
          className="admin-filter-date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          placeholder="To"
        />
        <button className="admin-btn-sm admin-btn-primary" onClick={loadLogs}>
          Filter
        </button>
        <button className="admin-refresh-btn" onClick={loadLogs}>
          {'\u{1F504}'} Refresh
        </button>
      </div>

      {loading && <div className="admin-loading">Loading activity log...</div>}
      {error && <div className="admin-error">{error}</div>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan="4" className="admin-table-empty">No activity found.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td className="admin-cell-muted">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td>{log.username || 'Anonymous'}</td>
                    <td>
                      <span className="admin-action-badge">
                        {actionLabels[log.action_type] || log.action_type}
                      </span>
                    </td>
                    <td className="admin-cell-details">
                      {log.details ? JSON.stringify(log.details).slice(0, 100) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
