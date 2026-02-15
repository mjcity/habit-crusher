import { FaCalendarDays, FaChartColumn, FaHammer, FaSliders } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';

const itemClass = ({ isActive }) =>
  `flex items-center gap-2 border-4 border-black px-3 py-2 font-bold ${isActive ? 'bg-black text-white shadow-[6px_6px_0_#000]' : 'bg-white text-black shadow-[4px_4px_0_#000]'}`;

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-4 border-black bg-[#f9f5e8] p-4 shadow-[8px_8px_0_#000] md:block">
      <h1 className="mb-6 text-2xl font-black tracking-tight">Habit Crusher</h1>
      <nav className="space-y-3 text-sm">
        <NavLink to="/dashboard" className={itemClass}><FaHammer /> Dashboard</NavLink>
        <NavLink to="/progress" className={itemClass}><FaChartColumn /> Progress</NavLink>
        <NavLink to="/calendar" className={itemClass}><FaCalendarDays /> Calendar</NavLink>
        <NavLink to="/settings" className={itemClass}><FaSliders /> Settings</NavLink>
      </nav>
    </aside>
  );
}
