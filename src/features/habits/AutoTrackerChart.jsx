import { useState, useEffect, useCallback, useRef } from 'react';
import { getTrackingSummary } from './autoTracker';

function AutoTrackerChart() {
  const [data, setData] = useState(null);
  const [newBadgeAlert, setNewBadgeAlert] = useState(null);
  const initialised = useRef(false);

  const refresh = useCallback(() => {
    const summary = getTrackingSummary();
    setData(summary);
    if (summary.newBadges.length > 0) {
      setNewBadgeAlert(summary.newBadges);
      setTimeout(() => setNewBadgeAlert(null), 5000);
    }
  }, []);

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      refresh();
    }
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (!data) return null;

  const { overall, weeklyChart, earnedBadges, lockedBadges, totalHabitsTracked } = data;

  return (
    <div className="auto-tracker">
      <div className="auto-tracker-header">
        <span className="auto-tracker-title">Auto Tracker</span>
        <button className="auto-tracker-refresh" onClick={refresh} title="Refresh">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>

      {newBadgeAlert && (
        <div className="auto-tracker-new-badge">
          {newBadgeAlert.map(b => (
            <span key={b.id}>{b.icon} {b.name} unlocked!</span>
          ))}
        </div>
      )}

      <div className="auto-tracker-stats">
        <div className="auto-tracker-stat">
          <span className="auto-tracker-stat-value">{overall.current}</span>
          <span className="auto-tracker-stat-label">Day Streak</span>
        </div>
        <div className="auto-tracker-stat">
          <span className="auto-tracker-stat-value">{overall.longest}</span>
          <span className="auto-tracker-stat-label">Best Streak</span>
        </div>
        <div className="auto-tracker-stat">
          <span className="auto-tracker-stat-value">{overall.totalDays}</span>
          <span className="auto-tracker-stat-label">Total Days</span>
        </div>
        <div className="auto-tracker-stat">
          <span className="auto-tracker-stat-value">{totalHabitsTracked}</span>
          <span className="auto-tracker-stat-label">Habits</span>
        </div>
      </div>

      {overall.current >= 7 && (
        <div className="auto-tracker-heatmap">
          <span className="auto-tracker-heatmap-title">Weekly Progress</span>
          <div className="auto-tracker-heatmap-grid">
            {weeklyChart.map((week, wi) => (
              <div key={wi} className="auto-tracker-heatmap-week">
                <span className="auto-tracker-heatmap-label">{week.label}</span>
                <div className="auto-tracker-heatmap-days">
                  {week.days.map((day, di) => (
                    <div
                      key={di}
                      className={`auto-tracker-heatmap-cell ${day.count > 0 ? 'filled' : ''}`}
                      style={day.count > 0 ? { opacity: Math.min(0.3 + day.count * 0.2, 1) } : {}}
                      title={`${day.date}: ${day.count} habits`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="auto-tracker-heatmap-legend">
            <span>Less</span>
            <div className="auto-tracker-heatmap-cell" />
            <div className="auto-tracker-heatmap-cell filled" style={{ opacity: 0.4 }} />
            <div className="auto-tracker-heatmap-cell filled" style={{ opacity: 0.6 }} />
            <div className="auto-tracker-heatmap-cell filled" style={{ opacity: 0.8 }} />
            <div className="auto-tracker-heatmap-cell filled" style={{ opacity: 1 }} />
            <span>More</span>
          </div>
        </div>
      )}

      <div className="auto-tracker-badges">
        <span className="auto-tracker-badges-title">
          Streak Badges
          <span className="auto-tracker-badges-count">{earnedBadges.length} / {earnedBadges.length + lockedBadges.length}</span>
        </span>
        <div className="auto-tracker-badges-list">
          {earnedBadges.map(b => (
            <div key={b.id} className="auto-tracker-badge earned">
              <span className="auto-tracker-badge-icon">{b.icon}</span>
              <span className="auto-tracker-badge-name">{b.name}</span>
            </div>
          ))}
          {lockedBadges.map(b => (
            <div key={b.id} className="auto-tracker-badge locked">
              <span className="auto-tracker-badge-icon">🔒</span>
              <span className="auto-tracker-badge-name">{b.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AutoTrackerChart;
