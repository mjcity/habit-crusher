import { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { useHabits } from '../hooks/useHabits';

const colors = {
  yellow: 'bg-yellow-300',
  blue: 'bg-blue-300',
  red: 'bg-red-300',
  green: 'bg-green-300'
};

export default function DashboardPage() {
  const { habits, createHabit, markComplete } = useHabits();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', color: 'yellow' });
  const today = new Date().toISOString().slice(0, 10);

  const successRate = useMemo(() => {
    if (!habits.length) return 0;
    const done = habits.filter((h) => h.lastCompletedDate === today).length;
    return Math.round((done / habits.length) * 100);
  }, [habits, today]);

  const submit = async (e) => {
    e.preventDefault();
    await createHabit(form);
    setForm({ name: '', color: 'yellow' });
    setOpen(false);
  };

  return (
    <Layout onAdd={() => setOpen(true)} title="Dashboard" subtitle={`${successRate}% Success Rate`}>
      <section className="mb-5 border-4 border-black bg-[#ffef99] p-4 shadow-[6px_6px_0_#000]">
        <h3 className="text-2xl font-black">Daily Progress</h3>
        <p className="font-bold">{successRate}% Success Rate</p>
      </section>

      <section>
        <h3 className="mb-3 text-2xl font-black">Your Habits</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {habits.map((habit) => (
            <article key={habit.id} className={`border-4 border-black p-4 shadow-[6px_6px_0_#000] ${colors[habit.color] || colors.yellow}`}>
              <h4 className="text-xl font-black">{habit.name}</h4>
              <p className="font-bold">Current Streak: {habit.streakCount}</p>
              <p className="mb-4 font-bold">Best Streak: {habit.bestStreak}</p>
              <button onClick={() => markComplete(habit.id)} className="w-full border-4 border-black bg-white px-3 py-2 text-lg font-black shadow-[4px_4px_0_#000]">Mark Complete</button>
            </article>
          ))}
        </div>
        {!habits.length && <p className="mt-3 font-bold">No habits yet. Add your first one.</p>}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form onSubmit={submit} className="w-full max-w-md border-4 border-black bg-white p-4 shadow-[8px_8px_0_#000]">
            <h3 className="text-xl font-black">Add Habit</h3>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Habit name" className="mt-3 w-full border-4 border-black px-3 py-2" required />
            <select value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} className="mt-3 w-full border-4 border-black px-3 py-2">
              <option value="yellow">Yellow</option>
              <option value="blue">Blue</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
            </select>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="flex-1 border-4 border-black bg-green-300 py-2 font-black">Save</button>
              <button type="button" onClick={() => setOpen(false)} className="flex-1 border-4 border-black bg-white py-2 font-black">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
