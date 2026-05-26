import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FacebookEmoji } from '../../utils/emojiHelper';

const MOOD_COLORS = {
  Happy: '#22c55e',
  Peaceful: '#3b82f6',
  Sad: '#8b5cf6',
  Angry: '#ef4444',
};

const MOOD_ICONS = {
  Happy: '😊',
  Peaceful: '😌',
  Sad: '😢',
  Angry: '😤',
};

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function MoodCalendar() {
  const { moodLog } = useApp();
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = today.toISOString().slice(0, 10);

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  const counts = {};
  for (const d in moodLog) {
    const mood = moodLog[d];
    counts[mood] = (counts[mood] || 0) + 1;
  }

  return (
    <div className="mood-calendar">
      <div className="mood-calendar-header">
        <button className="mood-calendar-nav" onClick={prevMonth}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="mood-calendar-title">{monthLabel}</span>
        <button className="mood-calendar-nav" onClick={nextMonth}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="mood-calendar-weekdays">
        {WEEKDAY_LABELS.map((l) => (
          <span key={l} className="mood-calendar-weekday">{l}</span>
        ))}
      </div>

      <div className="mood-calendar-grid">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="mood-calendar-cell empty" />;
          }
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const mood = moodLog[dateStr];
          const isToday = dateStr === todayStr;
          return (
            <div
              key={dateStr}
              className={`mood-calendar-cell ${isToday ? 'today' : ''} ${mood ? 'logged' : ''}`}
              style={mood ? { '--mood-color': MOOD_COLORS[mood] } : {}}
              title={mood ? `${day} — ${mood}` : String(day)}
            >
              <span className="mood-calendar-day">{day}</span>
              {mood && (
                <span className="mood-calendar-dot">
                  <FacebookEmoji emoji={MOOD_ICONS[mood]} size={12} />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mood-calendar-legend">
        {Object.entries(MOOD_COLORS).map(([key, color]) => (
          <div key={key} className="mood-calendar-legend-item">
            <span className="mood-calendar-legend-dot" style={{ background: color }} />
            <span className="mood-calendar-legend-label">{key}</span>
            <span className="mood-calendar-legend-count">{counts[key] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoodCalendar;
