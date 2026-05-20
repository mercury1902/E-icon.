import { supabase, TABLES } from '../lib/supabaseClient';

function getLocalStorage(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full
  }
}

export async function createUserHabit(habit) {
  try {
    const { error } = await supabase
      .from(TABLES.USER_HABITS)
      .insert({
        id: habit.id,
        name: habit.name,
        description: habit.description || '',
        category: habit.category || 'General',
        icon: habit.icon || '⭐',
      });
    if (error) throw error;
    return { success: true };
  } catch {
    const habits = getLocalStorage('userHabits') || [];
    setLocalStorage('userHabits', [...habits, habit]);
    return { success: true, fallback: true };
  }
}

export async function updateUserHabit(id, updates) {
  try {
    const { error } = await supabase
      .from(TABLES.USER_HABITS)
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch {
    const habits = getLocalStorage('userHabits') || [];
    setLocalStorage('userHabits', habits.map((h) => (h.id === id ? { ...h, ...updates } : h)));
    return { success: true, fallback: true };
  }
}

export async function deleteUserHabit(id) {
  try {
    const { error } = await supabase
      .from(TABLES.USER_HABITS)
      .delete()
      .eq('id', id);
    if (error) throw error;
  } catch {
    const habits = getLocalStorage('userHabits') || [];
    setLocalStorage('userHabits', habits.filter((h) => h.id !== id));
  }

  try {
    const { error } = await supabase
      .from(TABLES.HABIT_LOG)
      .delete()
      .eq('habit_id', id);
    if (error) throw error;
  } catch {
    const log = getLocalStorage('habitLog') || {};
    delete log[id];
    setLocalStorage('habitLog', log);
  }

  return { success: true };
}

export async function toggleHabit(habitId, dateKey) {
  try {
    const { data: existing } = await supabase
      .from(TABLES.HABIT_LOG)
      .select('id')
      .eq('habit_id', habitId)
      .eq('log_date', dateKey)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from(TABLES.HABIT_LOG)
        .delete()
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from(TABLES.HABIT_LOG)
        .insert({ habit_id: habitId, log_date: dateKey });
      if (error) throw error;
    }
    return { success: true };
  } catch {
    const log = getLocalStorage('habitLog') || {};
    const habitDates = log[habitId] ? { ...log[habitId] } : {};
    if (habitDates[dateKey]) {
      delete habitDates[dateKey];
    } else {
      habitDates[dateKey] = true;
    }
    log[habitId] = habitDates;
    setLocalStorage('habitLog', log);
    return { success: true, fallback: true };
  }
}

export async function getHabitLog() {
  try {
    const { data, error } = await supabase
      .from(TABLES.HABIT_LOG)
      .select('*')
      .order('log_date', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return getLocalStorage('habitLog') || {};
  }
}
