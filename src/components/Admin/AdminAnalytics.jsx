import React, { useState, useEffect, useCallback } from 'react';
import * as adminService from '../../services/adminService';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon" style={{ color: color || '#00d4ff' }}>{icon}</div>
      <div className="admin-stat-body">
        <span className="admin-stat-value">{value ?? '\u2014'}</span>
        <span className="admin-stat-label">{label}</span>
      </div>
    </div>
  );
}

function BarChart({ data, valueKey = 'count', labelKey = 'date', height = 160, color = '#00d4ff' }) {
  if (!data || data.length === 0) return <div className="admin-empty">No data</div>;
  const max = Math.max(...data.map((d) => d[valueKey] || 0), 1);

  return (
    <div className="admin-chart" style={{ height }}>
      {data.map((d, i) => {
        const pct = ((d[valueKey] || 0) / max) * 100;
        return (
          <div key={i} className="admin-bar-group" title={`${d[labelKey]}: ${d[valueKey]}`}>
            <div className="admin-bar" style={{ height: `${pct}%`, background: color }} />
          </div>
        );
      })}
    </div>
  );
}

function PieChart({ data, size = 180 }) {
  if (!data || data.length === 0) return <div className="admin-empty">No data</div>;
  const total = data.reduce((s, d) => s + (d.count || 0), 0) || 1;
  const colors = ['#00d4ff', '#ffb020', '#ff4444', '#6EE7B7', '#A78BFA', '#F87171', '#67E8F9'];

  let cumulative = 0;
  const slices = data.map((d, i) => {
    const pct = (d.count || 0) / total;
    const start = cumulative * 360;
    cumulative += pct;
    const end = cumulative * 360;
    return { ...d, pct, start, end, color: colors[i % colors.length] };
  });

  return (
    <div className="admin-pie-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((s, i) => {
          const r = size / 2 - 4;
          const cx = size / 2;
          const cy = size / 2;
          const a1 = (s.start - 90) * (Math.PI / 180);
          const a2 = (s.end - 90) * (Math.PI / 180);
          const x1 = cx + r * Math.cos(a1);
          const y1 = cy + r * Math.sin(a1);
          const x2 = cx + r * Math.cos(a2);
          const y2 = cy + r * Math.sin(a2);
          const large = s.end - s.start > 180 ? 1 : 0;
          return (
            <path
              key={i}
              d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
              fill={s.color}
              opacity={0.85}
            />
          );
        })}
        <circle cx={size / 2} cy={size / 2} r={size / 4} fill="#1a1a1a" />
      </svg>
      <div className="admin-pie-legend">
        {slices.map((s, i) => (
          <div key={i} className="admin-legend-item">
            <span className="admin-legend-dot" style={{ background: s.color }} />
            <span className="admin-legend-label">{s.action_type || s.reason || s.label || `Item ${i + 1}`}</span>
            <span className="admin-legend-value">{Math.round(s.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminAnalytics({ defaultTab = 'analytics' }) {
  const [tab, setTab] = useState(defaultTab);
  const [analytics, setAnalytics] = useState(null);
  const [postsPerDay, setPostsPerDay] = useState([]);
  const [activityCounts, setActivityCounts] = useState([]);
  const [reportStats, setReportStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [a, ppd, ac, rs] = await Promise.all([
        adminService.getAnalytics().catch(() => null),
        adminService.getPostsPerDay(14).catch(() => []),
        adminService.getActivityCounts().catch(() => []),
        adminService.getReportStats().catch(() => null),
      ]);
      setAnalytics(a);
      setPostsPerDay(ppd || []);
      setActivityCounts(ac || []);
      setReportStats(rs);
    } catch (e) {
      console.error('Analytics load failed:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (tab === 'health') {
      checkHealth();
    }
  }, [tab]);

  const checkHealth = async () => {
    setHealthStatus({ db: 'checking...', api: 'checking...', uptime: 'checking...' });
    try {
      const start = Date.now();
      const { error } = await adminService.getUsers().catch(() => ({ error: true }));
      const latency = Date.now() - start;
      setHealthStatus({
        db: error ? 'Disconnected' : 'Connected',
        api: error ? 'Unreachable' : `${latency}ms`,
        uptime: error ? 'N/A' : 'Operational',
        dbOk: !error,
        apiOk: latency < 2000,
      });
    } catch {
      setHealthStatus({ db: 'Disconnected', api: 'Error', uptime: 'N/A', dbOk: false, apiOk: false });
    }
  };

  const StatBar = ({ label, value, max, color = '#00d4ff' }) => {
    const pct = max ? Math.min((value / max) * 100, 100) : 0;
    return (
      <div className="health-stat">
        <div className="health-stat-header">
          <span className="health-stat-label">{label}</span>
          <span className="health-stat-value" style={{ color }}>{value}</span>
        </div>
        <div className="health-bar-track">
          <div className="health-bar-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    );
  };

  if (loading && !analytics) {
    return <div className="admin-section-loading"><div className="admin-spinner" /></div>;
  }

  return (
    <div className="admin-section">
      <div className="admin-tabs">
        <button
          className={`admin-tab${tab === 'analytics' ? ' active' : ''}`}
          onClick={() => setTab('analytics')}
        >
          {'\u{1F4CA}'} Analytics
        </button>
        <button
          className={`admin-tab${tab === 'health' ? ' active' : ''}`}
          onClick={() => setTab('health')}
        >
          {'\u{2699}\u{FE0F}'} System Health
        </button>
      </div>

      {tab === 'analytics' && (
        <div className="admin-analytics">
          <div className="admin-stats-grid">
            <StatCard label="Total Users" value={analytics?.total_users} icon={'\u{1F465}'} color="#00d4ff" />
            <StatCard label="Total Posts" value={analytics?.total_posts} icon={'\u{1F4F0}'} color="#A78BFA" />
            <StatCard label="Total Comments" value={analytics?.total_comments} icon={'\u{1F4AC}'} color="#67E8F9" />
            <StatCard label="Active Users (7d)" value={analytics?.active_users_7d} icon={'\u{1F525}'} color="#6EE7B7" />
            <StatCard label="Posts Today" value={analytics?.posts_today} icon={'\u{270F}\u{FE0F}'} color="#ffb020" />
            <StatCard label="Active Sessions" value={analytics?.total_sessions} icon={'\u{1F310}'} color="#F87171" />
            <StatCard label="Total Reports" value={analytics?.total_reports} icon={'\u{1F6A8}'} color="#ff4444" />
          </div>

          <div className="admin-charts-row">
            <div className="admin-chart-card">
              <h3 className="admin-chart-title">Posts per Day (14 days)</h3>
              <BarChart data={postsPerDay} color="#00d4ff" />
            </div>
            <div className="admin-chart-card">
              <h3 className="admin-chart-title">Activity Distribution</h3>
              <PieChart data={activityCounts} size={160} />
            </div>
          </div>

          {reportStats && (
            <div className="admin-charts-row">
              <div className="admin-chart-card">
                <h3 className="admin-chart-title">Reports by Reason</h3>
                {reportStats.by_reason && reportStats.by_reason.length > 0 ? (
                  <PieChart data={reportStats.by_reason} size={160} />
                ) : (
                  <div className="admin-empty">No reports</div>
                )}
              </div>
              <div className="admin-chart-card">
                <h3 className="admin-chart-title">Report Summary</h3>
                <div className="admin-report-summary">
                  <div className="report-stat">
                    <span className="report-stat-value">{reportStats.total || 0}</span>
                    <span className="report-stat-label">Total Reports</span>
                  </div>
                  <div className="report-stat">
                    <span className="report-stat-value" style={{ color: '#ffb020' }}>{reportStats.pending || 0}</span>
                    <span className="report-stat-label">Pending Review</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="admin-toolbar" style={{ marginTop: 16 }}>
            <button className="admin-btn admin-btn-outline" onClick={() => adminService.exportToCsv(postsPerDay, 'posts-per-day.csv')}>
              {'\u{1F4E5}'} Export Chart Data
            </button>
            <button className="admin-btn admin-btn-outline" onClick={fetchAll}>
              {'\u{1F504}'} Refresh Data
            </button>
          </div>
        </div>
      )}

      {tab === 'health' && (
        <div className="admin-health">
          <div className="admin-health-grid">
            <div className="admin-health-card">
              <div className={`health-status-dot ${healthStatus?.dbOk ? 'ok' : healthStatus?.db === 'checking...' ? 'checking' : 'fail'}`} />
              <div className="health-card-body">
                <h3>Database</h3>
                <div className="health-metrics">
                  <StatBar label="Connection" value={healthStatus?.db || 'Unknown'} max={1} color={healthStatus?.dbOk ? '#6EE7B7' : '#ff4444'} />
                </div>
              </div>
            </div>
            <div className="admin-health-card">
              <div className={`health-status-dot ${healthStatus?.apiOk ? 'ok' : healthStatus?.api === 'checking...' ? 'checking' : 'fail'}`} />
              <div className="health-card-body">
                <h3>API Response</h3>
                <div className="health-metrics">
                  <StatBar label="Response Time" value={healthStatus?.api || 'Unknown'} max={2000} color={healthStatus?.apiOk ? '#6EE7B7' : '#ff4444'} />
                </div>
              </div>
            </div>
            <div className="admin-health-card">
              <div className={`health-status-dot ${healthStatus?.uptime === 'Operational' ? 'ok' : healthStatus?.uptime === 'checking...' ? 'checking' : 'fail'}`} />
              <div className="health-card-body">
                <h3>System Status</h3>
                <div className="health-metrics">
                  <StatBar label="Uptime" value={healthStatus?.uptime || 'Unknown'} max={1} color={healthStatus?.uptime === 'Operational' ? '#6EE7B7' : '#ff4444'} />
                </div>
              </div>
            </div>
          </div>
          <div className="admin-toolbar" style={{ marginTop: 16 }}>
            <button className="admin-btn admin-btn-primary" onClick={checkHealth}>
              {'\u{1F504}'} Run Health Check
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
