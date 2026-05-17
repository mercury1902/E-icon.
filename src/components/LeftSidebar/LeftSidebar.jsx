import React from 'react';
import {
  navItems,
  trendingTags,
  emotionColors,
} from '../../data/sidebarData';
import './LeftSidebar.css';

const emotionLabels = {
  exhausted: 'Exhausted',
  anxious: 'Anxious',
  lonely: 'Lonely',
  numb: 'Numb',
  hopeful: 'Hopeful',
  overwhelmed: 'Overwhelmed',
};

export default function LeftSidebar({
  activeNav,
  onNavChange,
  emotionHistory,
  showToast,
}) {
  return (
    <aside className="left-sidebar" aria-label="Navigation sidebar">
      <nav className="sidebar-section" aria-label="Main navigation">
        <h3 className="sidebar-heading">Navigation</h3>
        <ul className="nav-list" role="list">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item${activeNav === item.id ? ' active' : ''}`}
                onClick={() => onNavChange(item.id)}
                aria-current={activeNav === item.id ? 'page' : undefined}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section className="sidebar-section trending-section">
        <h3 className="sidebar-heading">Trending Tags</h3>
        <div className="trending-list">
          {trendingTags.map((t) => (
            <button
              key={t.tag}
              className="trending-item"
              onClick={() => showToast?.('Filtered by #' + t.tag)}
            >
              <span className="trending-tag">#{t.tag}</span>
              <span className="trending-count">{t.posts} posts</span>
            </button>
          ))}
        </div>
      </section>

      <section className="sidebar-section emotion-insights-section">
        <h3 className="sidebar-heading">Emotion Insights</h3>
        {emotionHistory.length === 0 ? (
          <p className="insights-empty">
            Check in with your feelings above to see patterns here.
          </p>
        ) : (
          <>
            <div className="insights-dots">
              {emotionHistory
                .slice(-7)
                .reverse()
                .map((e, i) => (
                  <span
                    key={i}
                    className="emotion-dot"
                    style={{ background: emotionColors[e.emotion] || '#94A3B8' }}
                    title={emotionLabels[e.emotion] || e.emotion}
                  />
                ))}
            </div>
            <p className="insights-summary">
              Checked in <strong>{emotionHistory.length}</strong>{' '}
              {emotionHistory.length === 1 ? 'time' : 'times'}
            </p>
            {emotionHistory.length >= 3 && (
              <p className="insights-most-common">
                Most common:{' '}
                <strong>
                  {
                    emotionLabels[
                      Object.entries(
                        emotionHistory.reduce((acc, e) => {
                          acc[e.emotion] = (acc[e.emotion] || 0) + 1;
                          return acc;
                        }, {})
                      ).sort((a, b) => b[1] - a[1])[0]?.[0]
                    ] || '—'
                  }
                </strong>
              </p>
            )}
          </>
        )}
      </section>

      <div className="sidebar-section guidelines-section">
        <a
          href="#"
          className="guidelines-link"
          onClick={(e) => {
            e.preventDefault();
            showToast?.('Community guidelines — be kind, stay safe.');
          }}
        >
          <span aria-hidden="true">{'\u{1F6E1}\u{FE0F}'}</span>
          Community Guidelines
        </a>
        <p className="guidelines-sub">
          Respect privacy. No judgment. Support each other.
        </p>
      </div>
    </aside>
  );
}
