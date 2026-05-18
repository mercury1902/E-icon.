import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getCurrentStreak } from '../shared/streak';
import habitIcons from './habitIcons';
import HabitPicker from './HabitPicker';

function HabitCheckin() {
  const { activeHabits, habitLog, toggleHabit, habitCatalog, getHabitCompletions } = useApp();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('habitDismissed') === 'true'
  );
  const [justChecked, setJustChecked] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const tracked = useMemo(() =>
    activeHabits
      .map((id) => habitCatalog.find((h) => h.id === id))
      .filter(Boolean),
    [activeHabits, habitCatalog]
  );

  const completed = useMemo(() =>
    tracked.filter((h) => habitLog[h.id]?.[today]),
    [tracked, habitLog, today]
  );
  const allDone = tracked.length > 0 && completed.length === tracked.length;
  const pct = tracked.length > 0 ? Math.round((completed.length / tracked.length) * 100) : 0;

  const streaks = useMemo(() => {
    const map = {};
    for (const h of tracked) {
      map[h.id] = getCurrentStreak(getHabitCompletions(h.id));
    }
    return map;
  }, [tracked, getHabitCompletions]);

  if (dismissed) return null;

  function handleToggle(id) {
    setJustChecked(id);
    toggleHabit(id, today);
    setTimeout(() => setJustChecked(null), 400);
  }

  function handleDismiss() {
    setDismissed(true);
    localStorage.setItem('habitDismissed', 'true');
  }

  return (
    <div className={`habit-checkin ${allDone ? 'all-done' : ''}`}>
      <div className="habit-checkin-header">
        <div className="habit-checkin-title-row">
          <span className="habit-checkin-title">Today's Habits</span>
          {allDone && <span className="habit-checkin-celebration">🎉</span>}
        </div>
        <div className="habit-checkin-actions">
          <span className="habit-checkin-count">{completed.length}/{tracked.length}</span>
          <button className="habit-checkin-dismiss" onClick={handleDismiss} title="Hide">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {tracked.length > 0 && (
        <div className="habit-checkin-progress">
          <div className="habit-checkin-progress-bar">
            <div className="habit-checkin-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="habit-checkin-progress-label">{pct}%</span>
        </div>
      )}

      {allDone && tracked.length > 0 && (
        <div className="habit-checkin-done-banner">
          <span>All done for the day!</span>
          <span className="habit-checkin-done-sub">Great work — keep it going</span>
        </div>
      )}

      {tracked.length === 0 && (
        <p className="habit-checkin-empty">
          Track daily habits to build real-life skills.
        </p>
      )}

      <div className="habit-checkin-list">
        {tracked.map((h) => {
          const done = !!habitLog[h.id]?.[today];
          const streak = streaks[h.id] || 0;
          return (
            <button
              key={h.id}
              className={`habit-checkin-item ${done ? 'done' : ''} ${justChecked === h.id && done ? 'just-checked' : ''}`}
              onClick={() => handleToggle(h.id)}
            >
              <span className="habit-checkin-icon">{habitIcons[h.id]}</span>
              <span className="habit-checkin-name">{h.name}</span>
              {streak > 0 && (
                <span className="habit-checkin-streak">
                  <span className="habit-checkin-streak-icon">🔥</span>
                  {streak}
                </span>
              )}
              <span className={`habit-checkin-check ${done ? 'checked' : ''}`}>
                {done && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <button className="habit-checkin-add" onClick={() => setPickerOpen(true)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Habit
      </button>

      {pickerOpen && <HabitPicker onClose={() => setPickerOpen(false)} />}
    </div>
  );
}

export default HabitCheckin;
