import React, { useState, useEffect } from 'react';
import { getAnalytics, getPostsPerDay } from '../../services/admin';

export default function AdminOverview() {
  const [analytics, setAnalytics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [a, c] = await Promise.all([
        getAnalytics(),
        getPostsPerDay(14),
      ]);
      setAnalytics(a);
      setChartData(c || []);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading analytics...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  const cards = [
    { label: 'Total Users', value: analytics?.total_users ?? 0, icon: '\u{1F465}' },
    { label: 'Total Posts', value: analytics?.total_posts ?? 0, icon: '\u{1F4DD}' },
    { label: 'Total Comments', value: analytics?.total_comments ?? 0, icon: '\u{1F4AC}' },
    { label: 'Active Sessions', value: analytics?.total_sessions ?? 0, icon: '\u{1F4A1}' },
    { label: 'Posts Today', value: analytics?.posts_today ?? 0, icon: '\u{1F4F0}' },
    { label: 'Active Users (7d)', value: analytics?.active_users_7d ?? 0, icon: '\u{1F468}\u{200D}\u{1F4BB}' },
    { label: 'Total Reports', value: analytics?.total_reports ?? 0, icon: '\u{1F6A8}' },
  ];

  const maxVal = Math.max(...chartData.map((d) => d.count || 0), 1);

  return (
    <div className="admin-overview">
      <div className="admin-stats-grid">
        {cards.map((card) => (
          <div key={card.label} className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-icon" aria-hidden="true">{card.icon}</span>
              <span className="admin-stat-label">{card.label}</span>
            </div>
            <div className="admin-stat-value">{card.value}</div>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="admin-chart-section">
          <h3>Posts per Day (Last 14 Days)</h3>
          <div className="admin-bar-chart">
            {chartData.map((d) => (
              <div key={d.date} className="admin-bar-item">
                <div className="admin-bar-fill-wrap">
                  <div
                    className="admin-bar-fill"
                    style={{ height: `${(d.count / maxVal) * 100}%` }}
                    title={`${d.count} posts`}
                  />
                </div>
                <span className="admin-bar-label">
                  {new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="admin-refresh-btn" onClick={loadData}>
        {'\u{1F504}'} Refresh Data
      </button>
    </div>
  );
}
