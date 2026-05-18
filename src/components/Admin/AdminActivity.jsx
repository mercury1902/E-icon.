import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as adminService from '../../services/adminService';

const ACTION_LABELS = {
  post_created: 'Post Created',
  comment_added: 'Comment Added',
  report_filed: 'Report Filed',
  login: 'Login',
  user_suspended: 'User Suspended',
  user_restored: 'User Restored',
  post_hidden: 'Post Hidden',
  post_restored: 'Post Restored',
  comment_hidden: 'Comment Hidden',
  user_deleted: 'User Deleted',
};

const ACTION_COLORS = {
  post_created: '#00d4ff',
  comment_added: '#67E8F9',
  report_filed: '#ffb020',
  login: '#6EE7B7',
  user_suspended: '#ff4444',
  user_restored: '#6EE7B7',
  post_hidden: '#ffb020',
  post_restored: '#00d4ff',
  comment_hidden: '#ffb020',
  user_deleted: '#ff4444',
};

export default function AdminActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [realtime, setRealtime] = useState(true);
  const listRef = useRef(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getActivityLog({
        limit: 200,
        actionType: filterAction || null,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
      });
      setLogs(data || []);
    } catch (e) {
      console.error('Failed to load activity:', e);
    } finally {
      setLoading(false);
    }
  }, [filterAction, dateFrom, dateTo]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (!realtime) return;
    const unsubscribe = adminService.subscribeActivity((newLog) => {
      setLogs((prev) => [newLog, ...prev].slice(0, 500));
    });
    return unsubscribe;
  }, [realtime]);

  const uniqueActions = [...new Set(logs.map((l) => l.action_type))];

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleString();
  };

  if (loading && logs.length === 0) {
    return <div className="admin-section-loading"><div className="admin-spinner" /></div>;
  }

  return (
    <div className="admin-section">
      <div className="admin-toolbar">
        <div className="admin-filters">
          <select
            className="admin-select"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="">All Actions</option>
            {uniqueActions.map((a) => (
              <option key={a} value={a}>{ACTION_LABELS[a] || a}</option>
            ))}
          </select>
          <input
            type="date"
            className="admin-date-input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="From"
          />
          <input
            type="date"
            className="admin-date-input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="To"
          />
          <button className="admin-btn admin-btn-outline" onClick={fetchLogs}>
            {'\u{1F504}'} Refresh
          </button>
        </div>
        <label className="admin-toggle-label">
          <input type="checkbox" checked={realtime} onChange={(e) => setRealtime(e.target.checked)} />
          <span className="admin-toggle-text">Live</span>
          {realtime && <span className="admin-live-dot" />}
        </label>
        <button className="admin-btn admin-btn-outline" onClick={() => adminService.exportToCsv(logs, 'activity-log.csv')}>
          {'\u{1F4E5}'} Export
        </button>
        <span className="admin-count">{logs.length} entries</span>
      </div>

      <div className="admin-activity-feed" ref={listRef}>
        {logs.length === 0 ? (
          <div className="admin-empty">No activity recorded</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="admin-activity-item">
              <div className="activity-dot" style={{ background: ACTION_COLORS[log.action_type] || '#94A3B8' }} />
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-action" style={{ color: ACTION_COLORS[log.action_type] || '#94A3B8' }}>
                    {ACTION_LABELS[log.action_type] || log.action_type}
                  </span>
                  <span className="activity-user">{log.username || 'anonymous'}</span>
                  <span className="activity-time">{formatTime(log.created_at)}</span>
                </div>
                {log.details && Object.keys(log.details).length > 0 && (
                  <div className="activity-details">
                    {log.details.content_preview && (
                      <span className="activity-preview">"{log.details.content_preview}"</span>
                    )}
                    {log.details.reason && (
                      <span className="activity-reason">Reason: {log.details.reason}</span>
                    )}
                    {log.details.tags && log.details.tags.length > 0 && (
                      <span className="activity-extra">Tags: {log.details.tags.join(', ')}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
