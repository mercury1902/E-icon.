export function getCurrentStreak(dates) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (dates[key]) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export function getLongestStreak(dates) {
  const dateKeys = Object.keys(dates).sort();
  if (dateKeys.length === 0) return 0;

  let longest = 0;
  let current = 1;

  for (let i = 1; i < dateKeys.length; i++) {
    const prev = new Date(dateKeys[i - 1] + 'T00:00:00');
    const curr = new Date(dateKeys[i] + 'T00:00:00');
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
    } else {
      longest = Math.max(longest, current);
      current = 1;
    }
  }

  return Math.max(longest, current);
}

export function getWeeklyStreak(weeklyLog) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayLog = weeklyLog[key];
    if (dayLog && Object.keys(dayLog).length > 0) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}
