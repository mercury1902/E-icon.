import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { user as initialUser, stories as initialStories, badges as badgeDefs, topics, prompts, affirmations } from '../data/mockData';
import { saveMoodCheckin, getMoodHistory } from '../services/mood';
import * as habitsService from '../services/habits';
import { habitCatalog } from '../data/mockData';
import { supabase } from '../lib/supabaseClient';
import * as postsService from '../services/posts';

const MIGRATED_ICONS = {
  walk: '🚶', exercise: '🏋️', meditate: '🧘', sleep: '😴', water: '💧',
  journal: '✍️', read: '📖', cook: '🍳', tidy: '🧹', screentime: '📱',
  trynew: '🎯', sayyes: '👍', speakup: '💬', alone: '🧑', askhelp: '🙏',
};

const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(initialUser);
  const [stories, setStories] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [userReactions, setUserReactions] = useState(() => {
    const saved = localStorage.getItem('userReactions');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('userReactions', JSON.stringify(userReactions));
  }, [userReactions]);

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

  const fetchStories = useCallback(async () => {
    try {
      const { data: dbPosts, error: postsErr } = await supabase
        .from('posts')
        .select('*')
        .is('deleted_at', null)
        .eq('is_hidden', false)
        .order('created_at', { ascending: false });

      if (postsErr) throw postsErr;
      if (!dbPosts || dbPosts.length === 0) {
        setStories([]);
        return;
      }

      const postIds = dbPosts.map((p) => p.id);

      // Fetch comments in bulk
      const { data: dbComments, error: commentsErr } = await supabase
        .from('comments')
        .select('*')
        .in('post_id', postIds)
        .is('deleted_at', null)
        .eq('is_hidden', false)
        .order('created_at', { ascending: true });

      if (commentsErr) throw commentsErr;

      // Fetch reactions in bulk
      const { data: dbReactions, error: reactionsErr } = await supabase
        .from('reactions')
        .select('id, post_id, emoji')
        .in('post_id', postIds);

      if (reactionsErr) throw reactionsErr;

      // Map comments to post_id
      const commentsByPost = {};
      dbComments.forEach((c) => {
        if (!commentsByPost[c.post_id]) {
          commentsByPost[c.post_id] = [];
        }
        let avatar = '🦊';
        if (c.comment_pseudonym && c.comment_pseudonym.includes(' ')) {
          avatar = c.comment_pseudonym.split(' ').pop();
        }
        commentsByPost[c.post_id].push({
          id: c.id,
          parentId: c.parent_id,
          avatar: avatar,
          pseudonym: c.comment_pseudonym || 'Anonymous',
          content: c.content,
          timestamp: c.created_at,
          reports: 0
        });
      });

      // Aggregate reactions by post_id and emoji type
      const reactionsByPost = {};
      dbReactions.forEach((r) => {
        if (!reactionsByPost[r.post_id]) {
          reactionsByPost[r.post_id] = { heart: 0, relate: 0, fire: 0 };
        }
        const key = r.emoji === '❤️' ? 'heart' : r.emoji === '😊' ? 'relate' : r.emoji === '🔥' ? 'fire' : null;
        if (key) {
          reactionsByPost[r.post_id][key]++;
        }
      });

      // Map DB posts to stories
      const mappedStories = dbPosts.map((post) => {
        const topicNames = ['confession', 'vent', 'advice', 'wholesome', 'story', 'question'];
        let topicId = 5;
        if (post.tags && post.tags.length > 0) {
          const matchIndex = topicNames.findIndex((name) => post.tags.includes(name.toLowerCase()));
          if (matchIndex !== -1) {
            topicId = matchIndex + 1;
          }
        }

        let contentWarning = null;
        if (post.tags && post.tags.length > 0) {
          const cwTag = post.tags.find(tag => !topicNames.includes(tag.toLowerCase()));
          if (cwTag) {
            contentWarning = cwTag;
          }
        }

        return {
          id: post.id,
          pseudonym: post.post_pseudonym,
          avatarColor: post.avatar_color,
          content: post.content,
          topicId: topicId,
          timestamp: post.created_at,
          contentWarning: contentWarning,
          reactions: reactionsByPost[post.id] || { heart: 0, relate: 0, fire: 0 },
          reports: 0,
          comments: commentsByPost[post.id] || [],
          isMine: false
        };
      });

      setStories(mappedStories);
    } catch (err) {
      console.error('Error fetching stories:', err);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  function resetWeek() {
    const monday = getMonday(new Date());
    saveWeeklyHabits({ weekStart: monday, habits: [], log: {} });
  }

  const addStory = useCallback(async (storyData) => {
    try {
      const topic = topics.find((t) => t.id === storyData.topicId);
      const tags = [topic ? topic.name.toLowerCase() : 'story'];
      if (storyData.ephemeral) {
        tags.push('ephemeral');
      }

      await postsService.createPost({
        content: storyData.content,
        tags: tags,
        postPseudonym: storyData.pseudonym || 'Anonymous',
        avatarColor: '#A78BFA',
      });

      await fetchStories();

      setUser((prev) => ({
        ...prev,
        storyCount: prev.storyCount + 1,
      }));
    } catch (err) {
      console.error('Error adding story:', err);
    }
  }, [topics, fetchStories]);

  const reactToStory = useCallback(async (storyId, type) => {
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
                [type]: Math.max(0, s.reactions[type] + (alreadyReacted ? -1 : 1)),
              },
            }
          : s
      )
    );

    try {
      const emojiMap = {
        heart: '❤️',
        relate: '😊',
        fire: '🔥'
      };
      const emoji = emojiMap[type] || '❤️';
      await postsService.toggleReaction(storyId, emoji);
      await fetchStories();
    } catch (err) {
      console.error('Error toggling reaction:', err);
      setUserReactions((prev) => ({
        ...prev,
        [storyId]: {
          ...prev[storyId],
          [type]: alreadyReacted,
        },
      }));
      await fetchStories();
    }
  }, [userReactions, fetchStories]);

  const addComment = useCallback(async (storyId, content, avatar) => {
    try {
      const commentPseudonym = `Anonymous ${avatar || '🦊'}`;
      await postsService.addComment(storyId, content, commentPseudonym, '#A78BFA');
      await fetchStories();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  }, [fetchStories]);

  const addReply = useCallback(async (storyId, parentCommentId, content, avatar) => {
    try {
      const replyPseudonym = `Anonymous ${avatar || '🦊'}`;
      await postsService.addComment(storyId, content, replyPseudonym, '#A78BFA', parentCommentId);
      await fetchStories();
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  }, [fetchStories]);

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

  const reportStory = useCallback(async (storyId) => {
    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId ? { ...s, reports: s.reports + 1 } : s
      )
    );

    try {
      await supabase
        .from('content_reports')
        .insert({
          target_type: 'post',
          target_id: storyId,
          reason: 'Inappropriate content',
          session_token_hash: 'anon_report'
        });
    } catch (err) {
      console.error('Error reporting story:', err);
    }
  }, []);

  const reportComment = useCallback(async (storyId, commentId) => {
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

    try {
      await supabase
        .from('content_reports')
        .insert({
          target_type: 'comment',
          target_id: commentId,
          reason: 'Inappropriate content',
          session_token_hash: 'anon_report'
        });
    } catch (err) {
      console.error('Error reporting comment:', err);
    }
  }, []);

  const deleteStory = useCallback(async (storyId) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    setSavedStories((prev) => {
      const next = new Set(prev);
      next.delete(storyId);
      return next;
    });

    try {
      await supabase
        .from('posts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', storyId);
    } catch (err) {
      console.error('Error deleting story:', err);
      await fetchStories();
    }
  }, [fetchStories]);

  function hideStory(storyId) {
    setHiddenStories((prev) => {
      const next = new Set(prev);
      next.add(storyId);
      return next;
    });
  }

  const editStory = useCallback(async (storyId, updates) => {
    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId ? { ...s, ...updates } : s
      )
    );

    try {
      await supabase
        .from('posts')
        .update({
          content: updates.content,
        })
        .eq('id', storyId);
    } catch (err) {
      console.error('Error editing story:', err);
      await fetchStories();
    }
  }, [fetchStories]);

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
