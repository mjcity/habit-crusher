import { createContext, useEffect, useMemo, useState } from 'react';
import { supabase, supabaseEnabled } from '../lib/supabase';

export const HabitContext = createContext(null);

const isoDay = (d = new Date()) => new Date(d).toISOString().slice(0, 10);
const dayDiff = (a, b) => Math.round((new Date(a) - new Date(b)) / 86400000);

function computeStreak(habit, today) {
  const last = habit.lastCompletedDate;
  if (!last) return { streak: 1, best: Math.max(1, habit.bestStreak || 0) };
  const diff = dayDiff(today, last);
  if (diff === 0) return { streak: habit.streakCount || 0, best: habit.bestStreak || 0, alreadyDone: true };
  const nextStreak = diff === 1 ? (habit.streakCount || 0) + 1 : 1;
  return { streak: nextStreak, best: Math.max(nextStreak, habit.bestStreak || 0) };
}

export function HabitProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabaseEnabled) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      if (!userId) {
        if (mounted) setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('habits').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!mounted) return;
      if (!error && data) {
        setHabits(data.map((h) => ({
          id: h.id,
          userId: h.user_id,
          name: h.name,
          color: h.color || 'yellow',
          streakCount: h.streak_count || 0,
          bestStreak: h.best_streak || 0,
          lastCompletedDate: h.last_completed_date || null,
          completionHistory: h.completion_history || [],
          details: h.details || { progress: 0, points: 0, notes: '', media: null },
          createdAt: new Date(h.created_at).getTime()
        })));
      }
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const createHabit = async ({ name, color, description, targetDate }) => {
    const cleanName = name?.trim();
    if (!cleanName) throw new Error('Habit name is required');

    if (supabaseEnabled) {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      if (!userId) throw new Error('Please log in again');
      const payload = {
        user_id: userId,
        name: cleanName,
        color: color || 'yellow',
        streak_count: 0,
        best_streak: 0,
        completion_history: [],
        details: { progress: 0, points: 0, notes: '', media: null, description: description || '', targetDate: targetDate || '' }
      };
      const { data, error } = await supabase.from('habits').insert(payload).select().single();
      if (error) throw error;
      setHabits((prev) => [{
        id: data.id,
        userId: data.user_id,
        name: data.name,
        color: data.color,
        streakCount: data.streak_count || 0,
        bestStreak: data.best_streak || 0,
        lastCompletedDate: data.last_completed_date || null,
        completionHistory: data.completion_history || [],
        details: data.details || { progress: 0, points: 0, notes: '', media: null },
        createdAt: new Date(data.created_at).getTime()
      }, ...prev]);
      return;
    }
  };

  const updateHabit = async (id, updates) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    const nextDetails = { ...(habit.details || {}), ...(updates.details || {}) };
    const payload = {
      name: updates.name ?? habit.name,
      color: updates.color ?? habit.color,
      details: nextDetails
    };

    const { data, error } = await supabase.from('habits').update(payload).eq('id', id).select().single();
    if (error) throw error;

    setHabits((prev) => prev.map((h) => h.id === id ? {
      ...h,
      name: data.name,
      color: data.color,
      details: data.details || nextDetails
    } : h));
  };

  const markComplete = async (id) => {
    const today = isoDay();
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    const { streak, best, alreadyDone } = computeStreak(habit, today);
    if (alreadyDone) return;

    const historySet = new Set([...(habit.completionHistory || []), today]);
    const completionHistory = Array.from(historySet).sort();

    if (supabaseEnabled) {
      const existingDetails = habit.details || { progress: 0, points: 0 };
      const payload = {
        streak_count: streak,
        best_streak: best,
        last_completed_date: today,
        completion_history: completionHistory,
        details: {
          ...existingDetails,
          progress: Math.min(100, Number(existingDetails.progress || 0) + 10),
          points: Number(existingDetails.points || 0) + 10
        }
      };
      const { data, error } = await supabase.from('habits').update(payload).eq('id', id).select().single();
      if (error) throw error;
      setHabits((prev) => prev.map((h) => h.id === id ? {
        ...h,
        streakCount: data.streak_count,
        bestStreak: data.best_streak,
        lastCompletedDate: data.last_completed_date,
        completionHistory: data.completion_history || [],
        details: data.details || h.details
      } : h));
      return;
    }
  };

  return <HabitContext.Provider value={useMemo(() => ({ habits, loading, createHabit, updateHabit, markComplete }), [habits, loading])}>{children}</HabitContext.Provider>;
}

