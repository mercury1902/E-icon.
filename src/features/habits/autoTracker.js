const STREAK_BADGES = [
  { id: 'streak_7', name: 'Week Warrior', icon: '🔥', desc: '7-day streak', threshold: 7 },
  { id: 'streak_30', name: 'Month Master', icon: '💪', desc: '30-day streak', threshold: 30 },
  { id: 'streak_60', name: 'Two-Month Titan', icon: '⚡', desc: '60-day streak', threshold: 60 },
  { id: 'streak_100', name: 'Century Champion', icon: '🏆', desc: '100-day streak', threshold: 100 },
];

const HIDDEN_BADGE_KEY = 'autoBadges';

function loadBadges() {
  try {
    return JSON.parse(localStorage.getItem(HIDDEN_BADGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveBadges(badges) {
  localStorage.setItem(HIDDEN_BADGE_KEY, JSON.stringify(badges));
}

function loadData() {
  const parse = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || fallback); } catch { return JSON.parse(fallback); }
  };
  return {
    habitLog: parse('habitLog', '{}'),
    weeklyHabits: parse('weeklyHabits', '{"log":{}}'),
    moodLog: parse('moodLog', '{}'),
  };
}

function getCurrentStreak(dates) {
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

function getLongestStreak(dates) {
  const keys = Object.keys(dates).sort();
  if (keys.length === 0) return 0;
  let longest = 1, current = 1;
  for (let i = 1; i < keys.length; i++) {
    const prev = new Date(keys[i - 1] + 'T00:00:00');
    const curr = new Date(keys[i] + 'T00:00:00');
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) { current++; } else { longest = Math.max(longest, current); current = 1; }
  }
  return Math.max(longest, current);
}

function getOverallStreak(habitLog) {
  const merged = {};
  for (const habitId of Object.keys(habitLog)) {
    for (const date of Object.keys(habitLog[habitId])) {
      merged[date] = (merged[date] || 0) + 1;
    }
  }
  const streakDates = {};
  for (const date of Object.keys(merged)) {
    streakDates[date] = true;
  }
  return {
    current: getCurrentStreak(streakDates),
    longest: getLongestStreak(streakDates),
    totalDays: Object.keys(streakDates).length,
  };
}

function getHabitStats(habitLog) {
  const stats = {};
  for (const habitId of Object.keys(habitLog)) {
    const dates = habitLog[habitId];
    stats[habitId] = {
      total: Object.keys(dates).length,
      current: getCurrentStreak(dates),
      longest: getLongestStreak(dates),
    };
  }
  return stats;
}

function getWeeklyChartData(habitLog) {
  const today = new Date();
  const weeks = [];
  for (let w = 0; w < 8; w++) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1 - w * 7);
    const days = [];
    let completed = 0, total = 0;
    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + d);
      const key = day.toISOString().slice(0, 10);
      const count = Object.keys(habitLog).filter(hid => habitLog[hid]?.[key]).length;
      days.push({ date: key, count });
      total++;
      if (count > 0) completed++;
    }
    const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    weeks.unshift({ label, days, completed, total });
  }
  return weeks;
}

function getMoodChartData(moodLog) {
  const today = new Date();
  const weeks = [];
  for (let w = 0; w < 8; w++) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1 - w * 7);
    const days = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + d);
      const key = day.toISOString().slice(0, 10);
      days.push({ date: key, mood: moodLog[key] || null });
    }
    const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    weeks.unshift({ label, days });
  }
  return weeks;
}

function checkAndUnlockBadges(streak) {
  const earned = loadBadges();
  let newUnlocks = [];
  for (const badge of STREAK_BADGES) {
    if (!earned.includes(badge.id) && streak >= badge.threshold) {
      earned.push(badge.id);
      newUnlocks.push(badge);
    }
  }
  if (newUnlocks.length > 0) saveBadges(earned);
  return newUnlocks;
}

function getTrackingSummary() {
  const { habitLog, moodLog } = loadData();
  const overall = getOverallStreak(habitLog);
  const habitStats = getHabitStats(habitLog);
  const weeklyChart = getWeeklyChartData(habitLog);
  const moodChart = getMoodChartData(moodLog);
  const earnedBadges = loadBadges();

  const newBadges = checkAndUnlockBadges(overall.current);

  const activeHabits = (() => {
    try { return JSON.parse(localStorage.getItem('activeHabits') || '[]'); } catch { return []; }
  })();

  return {
    overall,
    habitStats,
    weeklyChart,
    moodChart,
    earnedBadges: STREAK_BADGES.filter(b => earnedBadges.includes(b.id)),
    lockedBadges: STREAK_BADGES.filter(b => !earnedBadges.includes(b.id)),
    newBadges,
    activeHabits,
    totalHabitsTracked: Object.keys(habitLog).length,
    streakBadgeDefs: STREAK_BADGES,
  };
}

export {
  getTrackingSummary,
  checkAndUnlockBadges,
  STREAK_BADGES,
  HIDDEN_BADGE_KEY,
  loadBadges,
};
