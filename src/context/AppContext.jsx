import { createContext, useContext, useState, useCallback } from 'react';
import { user as initialUser, stories as initialStories, badges as badgeDefs, topics, prompts, affirmations } from '../data/mockData';
import { saveMoodCheckin, getMoodHistory } from '../services/mood';
import * as habitsService from '../services/habits';
import { habitCatalog } from '../data/mockData';

const MIGRATED_ICONS = {
  walk: '🚶', exercise: '🏋️', meditate: '🧘', sleep: '😴', water: '💧',
  journal: '✍️', read: '📖', cook: '🍳', tidy: '🧹', screentime: '📱',
  trynew: '🎯', sayyes: '👍', speakup: '💬', alone: '🧑', askhelp: '🙏',
};

const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(initialUser);
  const [stories, setStories] = useState(initialStories);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [userReactions, setUserReactions] = useState({});
  const [savedStories, setSavedStories] = useState(new Set());
  const [hiddenStories, setHiddenStories] = useState(new Set());
  const [currentMood, setCurrentMood] = useState(() => localStorage.getItem('mood') || null);

  const [moodLog, setMoodLog] = useState(() => {
    const saved = localStorage.getItem('moodLog');
    return saved ? JSON.parse(saved) : {};
  });

  const setMood = useCallback(async (mood) => {
    setCurrentMood(mood);
    if (mood) {
      localStorage.setItem('mood', mood);
      const today = new Date().toISOString().slice(0, 10);
      setMoodLog((prev) => {
        const next = { ...prev, [today]: mood };
        localStorage.setItem('moodLog', JSON.stringify(next));
        return next;
      });
      try {
        await saveMoodCheckin(mood);
      } catch {
        // Supabase not available, localStorage is fine
      }
    } else {
      localStorage.removeItem('mood');
    }
  }, []);

  const [userHabits, setUserHabits] = useState(() => {
    const saved = localStorage.getItem('userHabits');
    if (saved) return JSON.parse(saved);
    const oldActive = localStorage.getItem('activeHabits');
    if (oldActive) {
      const ids = JSON.parse(oldActive);
      const migrated = ids.map((id) => {
        const ref = habitCatalog.find((h) => h.id === id);
        if (!ref) return null;
        const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        return {
          id,
          name: ref.name,
          description: '',
          category: ref.category.split('-').map(cap).join(' '),
          icon: MIGRATED_ICONS[id] || '⭐',
          createdAt: new Date().toISOString(),
        };
      }).filter(Boolean);
      localStorage.setItem('userHabits', JSON.stringify(migrated));
      localStorage.removeItem('activeHabits');
      return migrated;
    }
    return [];
  });

  const [habitLog, setHabitLog] = useState(() => {
    const saved = localStorage.getItem('habitLog');
    return saved ? JSON.parse(saved) : {};
  });

  const createHabit = useCallback(async (data) => {
    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const habit = {
      id,
      name: data.name.trim(),
      description: (data.description || '').trim(),
      category: data.category.trim() || 'General',
      icon: data.icon || '⭐',
      createdAt: new Date().toISOString(),
    };
    setUserHabits((prev) => {
      const next = [...prev, habit];
      localStorage.setItem('userHabits', JSON.stringify(next));
      return next;
    });
    await habitsService.createUserHabit(habit);
    return id;
  }, []);

  const updateHabit = useCallback(async (id, updates) => {
    setUserHabits((prev) => {
      const next = prev.map((h) =>
        h.id === id ? { ...h, ...updates, name: updates.name?.trim() || h.name } : h
      );
      localStorage.setItem('userHabits', JSON.stringify(next));
      return next;
    });
    await habitsService.updateUserHabit(id, updates);
  }, []);

  const deleteHabit = useCallback(async (id) => {
    setUserHabits((prev) => {
      const next = prev.filter((h) => h.id !== id);
      localStorage.setItem('userHabits', JSON.stringify(next));
      return next;
    });
    setHabitLog((prev) => {
      const next = { ...prev };
      delete next[id];
      localStorage.setItem('habitLog', JSON.stringify(next));
      return next;
    });
    await habitsService.deleteUserHabit(id);
  }, []);

  const toggleHabit = useCallback(async (habitId, dateKey) => {
    setHabitLog((prev) => {
      const habitDates = prev[habitId] ? { ...prev[habitId] } : {};
      if (habitDates[dateKey]) {
        delete habitDates[dateKey];
      } else {
        habitDates[dateKey] = true;
      }
      const next = { ...prev, [habitId]: habitDates };
      localStorage.setItem('habitLog', JSON.stringify(next));
      return next;
    });
    await habitsService.toggleHabit(habitId, dateKey);
  }, []);

  const getHabitCompletions = useCallback((habitId) => {
    return habitLog[habitId] || {};
  }, [habitLog]);

  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().slice(0, 10);
  }

  const [weeklyHabits, setWeeklyHabits] = useState(() => {
    const saved = localStorage.getItem('weeklyHabits');
    return saved ? JSON.parse(saved) : { weekStart: null, habits: [], log: {} };
  });

  function saveWeeklyHabits(updated) {
    setWeeklyHabits(updated);
    localStorage.setItem('weeklyHabits', JSON.stringify(updated));
  }

  function setupWeek(habitsList) {
    const monday = getMonday(new Date());
    saveWeeklyHabits({ weekStart: monday, habits: habitsList, log: {} });
  }

  function logWeeklyHabit(habitId, dateKey) {
    setWeeklyHabits((prev) => {
      const dayLog = prev.log[dateKey] ? { ...prev.log[dateKey] } : {};
      if (dayLog[habitId]) {
        delete dayLog[habitId];
      } else {
        dayLog[habitId] = true;
      }
      const next = { ...prev, log: { ...prev.log, [dateKey]: dayLog } };
      localStorage.setItem('weeklyHabits', JSON.stringify(next));
      return next;
    });
  }

  function resetWeek() {
    const monday = getMonday(new Date());
    saveWeeklyHabits({ weekStart: monday, habits: [], log: {} });
  }

  function addStory(story) {
    setStories((prev) => [story, ...prev]);
    setUser((prev) => ({
      ...prev,
      storyCount: prev.storyCount + 1,
    }));
  }

  function reactToStory(storyId, type) {
    const alreadyReacted = userReactions[storyId]?.[type] ?? false;

    setUserReactions((prev) => ({
      ...prev,
      [storyId]: {
        ...prev[storyId],
        [type]: !alreadyReacted,
      },
    }));

    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId
          ? {
              ...s,
              reactions: {
                ...s.reactions,
                [type]: s.reactions[type] + (alreadyReacted ? -1 : 1),
              },
            }
          : s
      )
    );
  }

  function addComment(storyId, content, avatar) {
    const comment = {
      id: Date.now(),
      parentId: null,
      avatar,
      content,
      timestamp: new Date().toISOString(),
      reports: 0,
    };
    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId ? { ...s, comments: [...s.comments, comment] } : s
      )
    );
  }

  function addReply(storyId, parentCommentId, content, avatar) {
    const reply = {
      id: Date.now(),
      parentId: parentCommentId,
      avatar,
      content,
      timestamp: new Date().toISOString(),
      reports: 0,
    };
    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId ? { ...s, comments: [...s.comments, reply] } : s
      )
    );
  }

  function toggleSave(storyId) {
    setSavedStories((prev) => {
      const next = new Set(prev);
      if (next.has(storyId)) {
        next.delete(storyId);
      } else {
        next.add(storyId);
      }
      return next;
    });
  }

  function reportStory(storyId) {
    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId ? { ...s, reports: s.reports + 1 } : s
      )
    );
  }

  function reportComment(storyId, commentId) {
    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId
          ? {
              ...s,
              comments: s.comments.map((c) =>
                c.id === commentId ? { ...c, reports: c.reports + 1 } : c
              ),
            }
          : s
      )
    );
  }

  function deleteStory(storyId) {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    setSavedStories((prev) => {
      const next = new Set(prev);
      next.delete(storyId);
      return next;
    });
  }

  function hideStory(storyId) {
    setHiddenStories((prev) => {
      const next = new Set(prev);
      next.add(storyId);
      return next;
    });
  }

  function editStory(storyId, updates) {
    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId ? { ...s, ...updates } : s
      )
    );
  }

  function getSavedStoriesList() {
    return stories.filter((s) => savedStories.has(s.id));
  }

  function getUserStories() {
    return stories.filter((s) => s.isMine);
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        stories,
        topics,
        prompts,
        userReactions,
        selectedTopic,
        setSelectedTopic,
        savedStories,
        hiddenStories,
        currentMood,
        setMood,
        moodLog,
        affirmations,
        userHabits,
        habitLog,
        createHabit,
        updateHabit,
        deleteHabit,
        toggleHabit,
        getHabitCompletions,
        weeklyHabits,
        setupWeek,
        logWeeklyHabit,
        resetWeek,
        getMonday,
        addStory,
        reactToStory,
        addComment,
        addReply,
        toggleSave,
        deleteStory,
        hideStory,
        editStory,
        reportStory,
        reportComment,
        getSavedStoriesList,
        getUserStories,
        badgeDefs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { AppProvider, useApp };
