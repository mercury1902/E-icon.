import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getCurrentStreak } from '../shared/streak';
import habitIcons from './habitIcons';
import HabitManager from './HabitManager';
import { FacebookEmoji } from '../../utils/emojiHelper';

function HabitCheckin() {
  const { userHabits, habitLog, toggleHabit, getHabitCompletions } = useApp();
  const [managerOpen, setManagerOpen] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('habitDismissed') === 'true'
  );
  const [justChecked, setJustChecked] = useState(null);
  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem('habitCategoriesExpanded');
    return saved ? JSON.parse(saved) : {};
  });

  const today = new Date().toISOString().slice(0, 10);

  const completions = useMemo(() => {
    const map = {};
    for (const h of userHabits) {
      map[h.id] = getHabitCompletions(h.id);
    }
    return map;
  }, [userHabits, getHabitCompletions]);

  const completed = useMemo(() =>
    userHabits.filter((h) => completions[h.id]?.[today]),
    [userHabits, completions, today]
  );

  const allDone = userHabits.length > 0 && completed.length === userHabits.length;
  const pct = userHabits.length > 0 ? Math.round((completed.length / userHabits.length) * 100) : 0;

  const streaks = useMemo(() => {
    const map = {};
    for (const h of userHabits) {
      map[h.id] = getCurrentStreak(completions[h.id]);
    }
    return map;
  }, [userHabits, completions]);

  const categories = useMemo(() => {
    const set = new Set(userHabits.map((h) => h.category).filter(Boolean));
    return [...set].sort();
  }, [userHabits]);

  const grouped = useMemo(() => {
    const map = {};
    for (const h of userHabits) {
      const cat = h.category || 'General';
      if (!map[cat]) map[cat] = [];
      map[cat].push(h);
    }
    return map;
  }, [userHabits]);

  const completedByCategory = useMemo(() => {
    const map = {};
    for (const cat of categories) {
      map[cat] = completed.filter((h) => (h.category || 'General') === cat);
    }
    return map;
  }, [categories, completed]);

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

  function toggleCategory(key) {
    setExpanded((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('habitCategoriesExpanded', JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className={`habit-checkin ${allDone ? 'all-done' : ''}`}>
      <div className="habit-checkin-header">
        <div className="habit-checkin-title-row">
          <span className="habit-checkin-title">Today's Habits</span>
          {allDone && (
            <span className="habit-checkin-celebration">
              <FacebookEmoji emoji="🎉" size={18} />
            </span>
          )}
        </div>
        <div className="habit-checkin-actions">
          <span className="habit-checkin-count">{completed.length}/{userHabits.length}</span>
          <button className="habit-checkin-dismiss" onClick={handleDismiss} title="Hide">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {userHabits.length > 0 && (
        <div className="habit-checkin-progress">
          <div className="habit-checkin-progress-bar">
            <div className="habit-checkin-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="habit-checkin-progress-label">{pct}%</span>
        </div>
      )}

      {allDone && userHabits.length > 0 && (
        <div className="habit-checkin-done-banner">
          <span>All done for the day!</span>
          <span className="habit-checkin-done-sub">Great work — keep it going</span>
        </div>
      )}

      {userHabits.length === 0 && (
        <p className="habit-checkin-empty">
          No habits yet. Create your first one!
        </p>
      )}

      <div className="habit-checkin-list">
        {categories.map((cat) => {
          const catHabits = grouped[cat];
          const catCompleted = completedByCategory[cat] || [];
          if (!catHabits || catHabits.length === 0) return null;

          const isExpanded = expanded[cat] !== false;
          return (
            <div key={cat} className="habit-checkin-category">
              <button
                className="habit-checkin-category-header"
                onClick={() => toggleCategory(cat)}
                aria-expanded={isExpanded}
              >
                <span className="habit-checkin-category-name">{cat}</span>
                <span className="habit-checkin-category-count">{catCompleted.length}/{catHabits.length}</span>
                <svg
                  className={`habit-checkin-category-chevron ${isExpanded ? 'expanded' : ''}`}
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className={`habit-checkin-category-body ${isExpanded ? 'expanded' : ''}`}>
                <div className="habit-checkin-category-items">
                  {catHabits.map((h) => {
                    const done = !!completions[h.id]?.[today];
                    const streak = streaks[h.id] || 0;
                    return (
                      <button
                        key={h.id}
                        className={`habit-checkin-item ${done ? 'done' : ''} ${justChecked === h.id && done ? 'just-checked' : ''}`}
                        onClick={() => handleToggle(h.id)}
                      >
                        <span className="habit-checkin-icon">
                          {habitIcons[h.id] || <FacebookEmoji emoji={h.icon || '⭐'} size={20} />}
                        </span>
                        <span className="habit-checkin-name">{h.name}</span>
                        {streak > 0 && (
                          <span className="habit-checkin-streak">
                            <span className="habit-checkin-streak-icon">
                              <FacebookEmoji emoji="🔥" size={14} />
                            </span>
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
              </div>
            </div>
          );
        })}
      </div>

      <button className="habit-checkin-add" onClick={() => setManagerOpen(true)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Manage Habits
      </button>

      {managerOpen && <HabitManager onClose={() => setManagerOpen(false)} />}
    </div>
  );
}

export default HabitCheckin;
