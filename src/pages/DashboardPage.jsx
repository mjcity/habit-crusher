import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useHabits } from '../hooks/useHabits';

const colors = {
  yellow: 'bg-yellow-300',
  blue: 'bg-blue-300',
  red: 'bg-red-300',
  green: 'bg-green-300'
};

const emptyForm = { name: '', color: 'yellow', description: '', targetDate: '', progress: 0, points: 0, notes: '', media: null };

export default function DashboardPage() {
  const { habits, createHabit, updateHabit, markComplete } = useHabits();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const daysSoFar = now.getDate();

  const successRate = useMemo(() => {
    if (!habits.length) return 0;
    const completionsThisMonth = habits.reduce((sum, h) => {
      const monthly = (h.completionHistory || []).filter((d) => d.startsWith(monthKey)).length;
      return sum + monthly;
    }, 0);
    const maxPossible = habits.length * daysSoFar;
    return maxPossible ? Math.round((completionsThisMonth / maxPossible) * 100) : 0;
  }, [habits, monthKey, daysSoFar]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (habit) => {
    setEditingId(habit.id);
    setForm({
      name: habit.name,
      color: habit.color,
      description: habit.details?.description || '',
      targetDate: habit.details?.targetDate || '',
      progress: Number(habit.details?.progress || 0),
      points: Number(habit.details?.points || 0),
      notes: habit.details?.notes || '',
      media: habit.details?.media || null
    });
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateHabit(editingId, {
        name: form.name,
        color: form.color,
        details: { progress: Number(form.progress || 0), points: Number(form.points || 0), notes: form.notes, media: form.media, description: form.description, targetDate: form.targetDate }
      });
    } else {
      await createHabit({ name: form.name, color: form.color, description: form.description, targetDate: form.targetDate });
    }
    setOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const onPickMedia = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, media: { name: file.name, type: file.type, dataUrl: reader.result } }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Layout onAdd={openCreate} title="Dashboard" subtitle={`${successRate}% Monthly Success Rate`}>
      <section className="mb-5 border-4 border-black bg-[#ffef99] p-4 shadow-[6px_6px_0_#000]">
        <h3 className="text-2xl font-black">Monthly Progress</h3>
        <p className="font-bold">{successRate}% Monthly Success Rate</p>
      </section>

      <section>
        <h3 className="mb-3 text-2xl font-black">Your Habits</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {habits.map((habit) => {
            const details = habit.details || {};
            return (
              <article key={habit.id} className={`border-4 border-black p-4 shadow-[6px_6px_0_#000] ${colors[habit.color] || colors.yellow}`}>
                <h4 className="text-xl font-black">{habit.name}</h4>
                {details.description && <p className="mb-1 font-semibold">{details.description}</p>}
                {details.targetDate && <p className="mb-1 text-sm font-bold">Target Date: {details.targetDate}</p>}
                <p className="font-bold">Current Streak: {habit.streakCount}</p>
                <p className="font-bold">Best Streak: {habit.bestStreak}</p>
                <p className="font-bold">Progress: {Number(details.progress || 0)}%</p>
                <p className="mb-2 font-bold">Points: {Number(details.points || 0)}</p>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Number(details.progress || 0)}
                  onChange={(e) => updateHabit(habit.id, { details: { ...details, progress: Number(e.target.value) } })}
                  className="mb-3 w-full accent-black"
                />

                {details.media?.dataUrl && (
                  <div className="mb-3 border-4 border-black bg-white p-1">
                    {details.media.type?.startsWith('video/') ? (
                      <video src={details.media.dataUrl} controls className="max-h-40 w-full" />
                    ) : (
                      <img src={details.media.dataUrl} alt="Habit proof" className="max-h-40 w-full object-cover" />
                    )}
                  </div>
                )}

                <div className="grid gap-2 sm:grid-cols-3">
                  <button onClick={() => markComplete(habit.id)} className="border-4 border-black bg-white px-3 py-2 font-black shadow-[4px_4px_0_#000]">Mark Complete</button>
                  <button onClick={() => openEdit(habit)} className="border-4 border-black bg-blue-300 px-3 py-2 font-black shadow-[4px_4px_0_#000]">Edit Habit</button>
                  <button onClick={() => navigate(`/calendar?habit=${habit.id}`)} className="border-4 border-black bg-yellow-200 px-3 py-2 font-black shadow-[4px_4px_0_#000]">Calendar</button>
                </div>
              </article>
            );
          })}
        </div>
        {!habits.length && <p className="mt-3 font-bold">No habits yet. Add your first one.</p>}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid items-start justify-items-center overflow-y-auto bg-black/40 p-4 pt-8 md:place-items-center">
          <form onSubmit={submit} className="w-full max-w-md border-4 border-black bg-white p-4 shadow-[8px_8px_0_#000]">
            <h3 className="text-xl font-black">{editingId ? 'Edit Habit' : 'Add Habit'}</h3>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Habit name" className="mt-3 w-full border-4 border-black px-3 py-2" required />
            <select value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} className="mt-3 w-full border-4 border-black px-3 py-2">
              <option value="yellow">Yellow</option>
              <option value="blue">Blue</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
            </select>

            <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Habit description / notes" className="mt-3 w-full border-4 border-black px-3 py-2" />
            <input type="date" value={form.targetDate} onChange={(e) => setForm((p) => ({ ...p, targetDate: e.target.value }))} className="mt-3 h-12 w-full max-w-full appearance-none border-4 border-black bg-white px-3 py-2" />
            {editingId && <button type="button" onClick={() => navigate(`/calendar?habit=${editingId}`)} className="mt-3 w-full border-4 border-black bg-yellow-200 px-3 py-2 font-black">Open Calendar for this Habit</button>}

            {editingId && (
              <>
                <label className="mt-3 block text-sm font-bold">Progress</label>
                <input type="range" min="0" max="100" value={form.progress} onChange={(e) => setForm((p) => ({ ...p, progress: Number(e.target.value) }))} className="w-full accent-black" />
                <input type="number" min="0" max="100" value={form.progress} onChange={(e) => setForm((p) => ({ ...p, progress: Number(e.target.value) }))} className="mt-1 w-full border-4 border-black px-3 py-2" />

                <label className="mt-3 block text-sm font-bold">Points</label>
                <input type="number" min="0" value={form.points} onChange={(e) => setForm((p) => ({ ...p, points: Number(e.target.value) }))} className="w-full border-4 border-black px-3 py-2" />

                <label className="mt-3 block text-sm font-bold">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} className="w-full border-4 border-black px-3 py-2" rows={3} placeholder="Progress notes" />

                <label className="mt-3 block border-4 border-black bg-white px-3 py-2 font-bold cursor-pointer">
                  Add Photo/Video Proof
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => onPickMedia(e.target.files?.[0])} />
                </label>
              </>
            )}

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
