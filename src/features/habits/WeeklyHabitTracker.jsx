import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getWeeklyStreak } from '../shared/streak';

const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: '3x', label: '3x / week' },
  { value: '2x', label: '2x / week' },
  { value: '1x', label: '1x / week' },
];

const EMOJI_OPTIONS = ['⭐', '📖', '🧘', '🏃', '🎨', '✍️', '🧠', '🥗', '💧', '🌱', '🎵', '🧹', '📵', '☀️', '🫂'];

function WeeklyHabitTracker() {
  const { weeklyHabits, setupWeek, logWeeklyHabit, resetWeek } = useApp();
  const [showSetup, setShowSetup] = useState(false);
  const [newHabits, setNewHabits] = useState([{ name: '', emoji: '⭐', frequency: 'daily' }]);
  const [justChecked, setJustChecked] = useState(null);

  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().toISOString().slice(0, 10);
  const thisMonday = getMonday(today);

  function getMonday(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().slice(0, 10);
  }

  function getWeekDates(startStr) {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startStr + 'T12:00:00');
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().slice(0, 10));
    }
    return dates;
  }

  function isWeekday(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    const day = d.getDay();
    return day >= 1 && day <= 5;
  }

  function formatWeekRange(startStr) {
    const start = new Date(startStr + 'T12:00:00');
    const end = new Date(startStr + 'T12:00:00');
    end.setDate(end.getDate() + 6);
    const options = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}`;
  }

  useEffect(() => {
    if (weeklyHabits.weekStart && weeklyHabits.weekStart !== thisMonday) {
      resetWeek();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const needsSetup = weeklyHabits.habits.length === 0;
  const weekDates = useMemo(
    () => weeklyHabits.weekStart ? getWeekDates(weeklyHabits.weekStart) : [],
    [weeklyHabits.weekStart]
  );

  const todayHabits = useMemo(() => {
    if (needsSetup || !weeklyHabits.weekStart) return [];
    return weeklyHabits.habits.filter((h) => {
      if (h.frequency === 'daily') return true;
      if (h.frequency === 'weekdays') return isWeekday(today);
      return true;
    });
  }, [weeklyHabits.habits, needsSetup, weeklyHabits.weekStart, today]);

  const todayLog = weeklyHabits.log[today] || {};
  const completedToday = todayHabits.filter((h) => todayLog[h.id]);
  const pct = todayHabits.length > 0
    ? Math.round((completedToday.length / todayHabits.length) * 100)
    : 0;

  const streak = useMemo(() => {
    if (needsSetup) return 0;
    return getWeeklyStreak(weeklyHabits.log);
  }, [weeklyHabits.log, needsSetup]);

  const weekProgress = useMemo(() => {
    if (needsSetup || !weeklyHabits.weekStart) return { done: 0, total: 0, pct: 0 };
    let total = 0;
    let done = 0;
    for (const h of weeklyHabits.habits) {
      let target = 7;
      if (h.frequency === 'weekdays') target = 5;
      else if (h.frequency === '3x') target = 3;
      else if (h.frequency === '2x') target = 2;
      else if (h.frequency === '1x') target = 1;
      total += target;
      for (const d of weekDates) {
        if (weeklyHabits.log[d]?.[h.id]) done++;
      }
    }
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [weeklyHabits, weekDates, needsSetup]);

  function handleAddField() {
    setNewHabits((prev) => [...prev, { name: '', emoji: '⭐', frequency: 'daily' }]);
  }

  function handleFieldChange(index, field, value) {
    setNewHabits((prev) => {
      const next = prev.map((h, i) => (i === index ? { ...h, [field]: value } : h));
      return next;
    });
  }

  function handleRemoveField(index) {
    setNewHabits((prev) => prev.filter((_, i) => i !== index));
  }

  function handleStartWeek() {
    const valid = newHabits.filter((h) => h.name.trim());
    if (valid.length === 0) return;
    const withIds = valid.map((h, i) => ({ ...h, id: `w${Date.now()}_${i}`, name: h.name.trim() }));
    setupWeek(withIds);
    setShowSetup(false);
  }

  function handleToggle(habitId) {
    setJustChecked(habitId);
    logWeeklyHabit(habitId, today);
    setTimeout(() => setJustChecked(null), 400);
  }

  function handleReset() {
    resetWeek();
    setShowSetup(false);
    setNewHabits([{ name: '', emoji: '⭐', frequency: 'daily' }]);
  }

  if (needsSetup && !showSetup) {
    return (
      <div className="weekly-tracker">
        <div className="weekly-tracker-header">
          <span className="weekly-tracker-title">This Week</span>
          <span className="weekly-tracker-range">{formatWeekRange(thisMonday)}</span>
        </div>
        <div className="weekly-tracker-setup">
          <p className="weekly-tracker-setup-text">
            Set up your habits for this week
          </p>
          <button className="weekly-tracker-setup-btn" onClick={() => setShowSetup(true)}>
            Set Up This Week
          </button>
        </div>
      </div>
    );
  }

  if (needsSetup && showSetup) {
    return (
      <div className="weekly-tracker">
        <div className="weekly-tracker-header">
          <span className="weekly-tracker-title">Set Up Your Week</span>
          <span className="weekly-tracker-range">{formatWeekRange(thisMonday)}</span>
        </div>
        <div className="weekly-tracker-form">
          {newHabits.map((habit, i) => (
            <div key={i} className="weekly-tracker-form-row">
              <div className="weekly-tracker-form-emoji">
                <select
                  value={habit.emoji}
                  onChange={(e) => handleFieldChange(i, 'emoji', e.target.value)}
                  className="weekly-tracker-emoji-select"
                >
                  {EMOJI_OPTIONS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <input
                className="weekly-tracker-form-input"
                placeholder="Habit name..."
                value={habit.name}
                onChange={(e) => handleFieldChange(i, 'name', e.target.value)}
              />
              <select
                className="weekly-tracker-form-freq"
                value={habit.frequency}
                onChange={(e) => handleFieldChange(i, 'frequency', e.target.value)}
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
              {newHabits.length > 1 && (
                <button className="weekly-tracker-form-remove" onClick={() => handleRemoveField(i)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button className="weekly-tracker-form-add" onClick={handleAddField}>
            + Add Another
          </button>
          <button className="weekly-tracker-form-start" onClick={handleStartWeek}>
            Start Week
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="weekly-tracker">
      <div className="weekly-tracker-header">
        <div>
          <span className="weekly-tracker-title">This Week</span>
          <span className="weekly-tracker-range">{weeklyHabits.weekStart ? formatWeekRange(weeklyHabits.weekStart) : ''}</span>
        </div>
        <button className="weekly-tracker-reset" onClick={handleReset} title="Reset week">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>

      <div className="weekly-tracker-week-progress">
        <div className="weekly-tracker-week-progress-bar">
          <div className="weekly-tracker-week-progress-fill" style={{ width: `${weekProgress.pct}%` }} />
        </div>
        <span className="weekly-tracker-week-progress-label">{weekProgress.done}/{weekProgress.total}</span>
      </div>

      {streak > 0 && (
        <div className="weekly-tracker-streak">
          <span className="weekly-tracker-streak-icon">🔥</span>
          <span>{streak} day streak</span>
        </div>
      )}

      <div className="weekly-tracker-weekdays">
        {WEEKDAYS.map((name, i) => {
          const date = weekDates[i];
          const done = date && weeklyHabits.log[date]
            ? weeklyHabits.habits.some((h) => weeklyHabits.log[date]?.[h.id])
            : false;
          const isToday = date === today;
          return (
            <div key={name} className={`weekly-tracker-weekday ${isToday ? 'today' : ''} ${done ? 'done' : ''}`}>
              <span className="weekly-tracker-weekday-name">{name}</span>
              <span className="weekly-tracker-weekday-dot">{done ? '✓' : '·'}</span>
            </div>
          );
        })}
      </div>

      <div className="weekly-tracker-today">
        <div className="weekly-tracker-today-header">
          <span className="weekly-tracker-today-label">Today</span>
          <span className="weekly-tracker-today-pct">{pct}%</span>
        </div>
        <div className="weekly-tracker-today-progress">
          <div className="weekly-tracker-today-progress-bar">
            <div className="weekly-tracker-today-progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="weekly-tracker-today-list">
          {todayHabits.map((h) => {
            const done = !!todayLog[h.id];
            return (
              <button
                key={h.id}
                className={`weekly-tracker-item ${done ? 'done' : ''} ${justChecked === h.id && done ? 'just-checked' : ''}`}
                onClick={() => handleToggle(h.id)}
              >
                <span className="weekly-tracker-item-emoji">{h.emoji}</span>
                <span className="weekly-tracker-item-name">{h.name}</span>
                <span className={`weekly-tracker-item-check ${done ? 'checked' : ''}`}>
                  {done && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
}

export default WeeklyHabitTracker;
