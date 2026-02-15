import { useContext } from 'react';
import { HabitContext } from '../context/HabitContext';

export const useHabits = () => {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used inside HabitProvider');
  return ctx;
};
