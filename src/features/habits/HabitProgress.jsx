import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getCurrentStreak, getLongestStreak } from '../shared/streak';
import habitIcons from './habitIcons';
import { FacebookEmoji } from '../../utils/emojiHelper';

function CalendarGrid({ dates }) {
  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return (
    <div className="habit-calendar">
      {days.map((key) => (
        <span
          key={key}
          className={`habit-calendar-cell ${dates[key] ? 'filled' : ''}`}
          title={key}
        />
      ))}
    </div>
  );
}

function HabitProgress() {
  const { userHabits, getHabitCompletions } = useApp();

  const { entries, totalCompletions } = useMemo(() => {
    const list = userHabits.map((h) => {
      const dates = getHabitCompletions(h.id);
      const t = Object.keys(dates).length;
      return {
        habit: h,
        dates,
        total: t,
        streak: getCurrentStreak(dates),
        longest: getLongestStreak(dates),
      };
    });
    const total = list.reduce((sum, e) => sum + e.total, 0);
    return { entries: list, totalCompletions: total };
  }, [userHabits, getHabitCompletions]);

  if (userHabits.length === 0) {
    return <p className="empty-state">No habits yet. Create some to start tracking!</p>;
  }

  return (
    <div className="habit-progress">
      <div className="habit-progress-summary">
        <span className="habit-progress-summary-value">{totalCompletions}</span>
        <span className="habit-progress-summary-label">total completions</span>
      </div>
      {entries.map(({ habit, dates, total, streak, longest }) => (
        <div key={habit.id} className="habit-progress-card">
          <div className="habit-progress-card-header">
            <span className="habit-progress-icon">
              {habitIcons[habit.id] || <FacebookEmoji emoji={habit.icon || '⭐'} size={20} />}
            </span>
            <span className="habit-progress-name">{habit.name}</span>
            {habit.description && <span className="habit-progress-desc">{habit.description}</span>}
            <div className="habit-progress-stats">
              {streak > 0 && (
                <span className="habit-progress-streak">
                  <FacebookEmoji emoji="🔥" size={14} /> {streak} day streak
                </span>
              )}
              {longest > streak && (
                <span className="habit-progress-best">
                  <FacebookEmoji emoji="🏆" size={14} /> Best: {longest}
                </span>
              )}
              <span className="habit-progress-total">{total}x</span>
            </div>
          </div>
          <div className="habit-progress-card-detail">
            <CalendarGrid dates={dates} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default HabitProgress;
