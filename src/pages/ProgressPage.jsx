import { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { useHabits } from '../hooks/useHabits';

const ranges = [7, 15, 30, 90];

export default function ProgressPage() {
  const { habits } = useHabits();
  const [days, setDays] = useState(30);

  const heatmapDays = useMemo(() => {
    const out = [];
    for (let i = 89; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = habits.reduce((sum, h) => sum + (h.completionHistory?.includes(key) ? 1 : 0), 0);
      out.push({ key, count });
    }
    return out;
  }, [habits]);

  const comparison = useMemo(() => habits.map((h) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const total = (h.completionHistory || []).filter((d) => new Date(d) >= cutoff).length;
    return { name: h.name, total };
  }), [habits]);

  const filteredHeat = heatmapDays.slice(-days);

  return (
    <Layout title="Progress" subtitle="Consistency over time" showAdd={false}>
      <div className="mb-4 flex flex-wrap gap-2">
        {ranges.map((r) => <button key={r} onClick={() => setDays(r)} className={`border-4 border-black px-3 py-1 font-black ${days === r ? 'bg-blue-300' : 'bg-white'}`}>{r} days</button>)}
      </div>

      <section className="mb-6 border-4 border-black bg-white p-4 shadow-[6px_6px_0_#000]">
        <h3 className="mb-3 text-xl font-black">Weekly Heatmap (last 90 days)</h3>
        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
          {filteredHeat.map((d) => (
            <div key={d.key} title={`${d.key}: ${d.count} completions`} className={`h-5 w-5 border border-black ${d.count === 0 ? 'bg-slate-100' : d.count < 2 ? 'bg-green-300' : d.count < 4 ? 'bg-green-500' : 'bg-green-700'}`} />
          ))}
        </div>
      </section>

      <section className="border-4 border-black bg-white p-4 shadow-[6px_6px_0_#000]">
        <h3 className="mb-3 text-xl font-black">Habit Comparison (last 30 days)</h3>
        <div className="space-y-3">
          {comparison.map((c) => (
            <div key={c.name}>
              <div className="mb-1 flex justify-between text-sm font-bold"><span>{c.name}</span><span>{c.total}</span></div>
              <div className="h-6 border-2 border-black bg-slate-100">
                <div className="h-full bg-red-400" style={{ width: `${Math.min(100, (c.total / 30) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
