import { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { useHabits } from '../hooks/useHabits';

const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const keyFor = (d) => new Date(d).toISOString().slice(0, 10);

function monthCells(base) {
  const y = base.getFullYear();
  const m = base.getMonth();
  const first = new Date(y, m, 1);
  const start = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const daysPrev = new Date(y, m, 0).getDate();
  const cells = [];
  for (let i = 0; i < start; i++) cells.push(new Date(y, m - 1, daysPrev - start + i + 1));
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
  while (cells.length < 42) cells.push(new Date(y, m + 1, cells.length - (start + daysInMonth) + 1));
  return cells;
}

export default function CalendarPage() {
  const { habits, updateHabit } = useHabits();
  const [current, setCurrent] = useState(new Date());
  const [selectedHabitId, setSelectedHabitId] = useState('');
  const [selectedDate, setSelectedDate] = useState(keyFor(new Date()));
  const [form, setForm] = useState({ achieved: '', notes: '', media: null });
  const [mediaError, setMediaError] = useState('');

  const selectedHabit = habits.find((h) => h.id === selectedHabitId) || habits[0];

  const cells = useMemo(() => monthCells(current), [current]);

  const entries = selectedHabit?.details?.entries || {};

  const loadDay = (dateKey) => {
    setSelectedDate(dateKey);
    const entry = entries[dateKey] || { achieved: '', notes: '', media: null };
    setForm(entry);
    setMediaError('');
  };

  const saveDay = async () => {
    if (!selectedHabit) return;
    const details = selectedHabit.details || {};
    const nextEntries = { ...(details.entries || {}), [selectedDate]: form };
    await updateHabit(selectedHabit.id, { details: { ...details, entries: nextEntries } });
  };

  const onPickMedia = (file) => {
    if (!file) return;
    if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        if (v.duration > 10) {
          setMediaError('Video must be 10 seconds or less.');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setForm((p) => ({ ...p, media: { name: file.name, type: file.type, dataUrl: reader.result } }));
          setMediaError('');
        };
        reader.readAsDataURL(file);
      };
      v.src = url;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, media: { name: file.name, type: file.type, dataUrl: reader.result } }));
      setMediaError('');
    };
    reader.readAsDataURL(file);
  };

  return (
    <Layout title="Calendar" subtitle="Track what you achieved each day" showAdd={false}>
      <section className="mb-4 border-4 border-black bg-white p-4 shadow-[6px_6px_0_#000]">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button className="border-4 border-black bg-white px-3 py-1 font-black" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))}>←</button>
          <h3 className="text-xl font-black">{current.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h3>
          <button className="border-4 border-black bg-white px-3 py-1 font-black" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))}>→</button>
        </div>

        <select className="mb-4 w-full border-4 border-black px-3 py-2 font-bold" value={selectedHabitId || selectedHabit?.id || ''} onChange={(e) => setSelectedHabitId(e.target.value)}>
          {habits.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-black">{week.map((d) => <div key={d}>{d}</div>)}</div>
        <div className="mt-2 grid grid-cols-7 gap-2">
          {cells.map((d) => {
            const k = keyFor(d);
            const inMonth = d.getMonth() === current.getMonth();
            const hasEntry = !!entries[k]?.achieved || !!entries[k]?.notes || !!entries[k]?.media;
            return (
              <button key={k} onClick={() => loadDay(k)} className={`min-h-16 border-4 border-black p-2 text-left font-bold ${inMonth ? 'bg-white' : 'bg-slate-100'} ${selectedDate === k ? 'ring-2 ring-blue-500' : ''}`}>
                <div>{d.getDate()}</div>
                {hasEntry && <div className="mt-1 inline-block bg-green-300 px-1 text-[10px]">Saved</div>}
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-4 border-black bg-[#ffef99] p-4 shadow-[6px_6px_0_#000]">
        <h3 className="text-xl font-black">{selectedDate}</h3>
        <input className="mt-3 w-full border-4 border-black px-3 py-2" placeholder="What did you achieve?" value={form.achieved || ''} onChange={(e) => setForm((p) => ({ ...p, achieved: e.target.value }))} />
        <textarea className="mt-3 w-full border-4 border-black px-3 py-2" rows={3} placeholder="Add notes" value={form.notes || ''} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />

        <label className="mt-3 block border-4 border-black bg-white px-3 py-2 font-black cursor-pointer">
          Add picture or 10s video
          <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => onPickMedia(e.target.files?.[0])} />
        </label>
        {mediaError && <p className="mt-2 font-bold text-red-700">{mediaError}</p>}

        {form.media?.dataUrl && (
          <div className="mt-3 border-4 border-black bg-white p-2">
            {form.media.type?.startsWith('video/') ? (
              <video src={form.media.dataUrl} controls className="max-h-44 w-full" />
            ) : (
              <img src={form.media.dataUrl} alt="Day proof" className="max-h-44 w-full object-cover" />
            )}
          </div>
        )}

        <button onClick={saveDay} className="mt-4 border-4 border-black bg-blue-300 px-4 py-2 font-black">Save Day Entry</button>
      </section>
    </Layout>
  );
}
