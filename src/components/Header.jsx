import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaPlus, FaRightFromBracket, FaUser } from 'react-icons/fa6';
import { useAuth } from '../hooks/useAuth';

export default function Header({ onAdd, onToggleMobileMenu, title, subtitle, showAdd = true }) {
  const { currentUser, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-black bg-white px-4 py-4">
      <div className="flex items-center gap-3">
        <button onClick={onToggleMobileMenu} className="grid h-12 w-12 place-items-center border-4 border-black bg-white text-xl shadow-[4px_4px_0_#000] md:hidden" aria-label="Open menu"><FaBars /></button>
        <div>
          <h2 className="text-3xl font-black leading-tight">{title}</h2>
          <p className="font-semibold">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showAdd && <button onClick={onAdd} className="flex items-center gap-2 border-4 border-black bg-[#2563eb] px-4 py-2 font-bold text-white shadow-[4px_4px_0_#000]"><FaPlus /> Add Habit</button>}

        <div className="relative">
          <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2 border-4 border-black bg-white px-3 py-2 shadow-[4px_4px_0_#000]" aria-label="Open profile menu">
            <FaUser />
            <span className="hidden max-w-[180px] truncate md:inline">{currentUser?.name}</span>
          </button>
          {profileOpen && (
            <div className="absolute left-0 z-40 mt-2 w-64 max-w-[calc(100vw-2rem)] border-4 border-black bg-white p-2 shadow-[6px_6px_0_#000] md:left-auto md:right-0">
              <p className="border-b-4 border-black p-2 text-sm font-bold">{currentUser?.email}</p>
              <Link to="/settings" onClick={() => setProfileOpen(false)} className="mt-2 block border-4 border-black bg-yellow-300 px-3 py-2 font-bold">Account preferences</Link>
              <button onClick={async () => { setProfileOpen(false); await logout(); }} className="mt-2 flex w-full items-center gap-2 border-4 border-black bg-white px-3 py-2 font-bold"><FaRightFromBracket /> Log out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
