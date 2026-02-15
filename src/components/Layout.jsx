import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const mobileItemClass = ({ isActive }) => `block border-4 border-black px-3 py-2 font-bold ${isActive ? 'bg-black text-white' : 'bg-white'}`;

export default function Layout({ children, onAdd, title, subtitle, showAdd = true }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4">
      <div className="mx-auto flex max-w-7xl gap-4">
        <Sidebar />
        <div className="relative flex min-h-[88vh] flex-1 flex-col border-4 border-black bg-[#fffef5] shadow-[8px_8px_0_#000]">
          <Header onAdd={onAdd} title={title} subtitle={subtitle} showAdd={showAdd} onToggleMobileMenu={() => setMobileMenuOpen((v) => !v)} />
          {mobileMenuOpen && (
            <div className="border-b-4 border-black bg-[#fffef5] p-3 md:hidden">
              <nav className="grid gap-2">
                <NavLink to="/dashboard" className={mobileItemClass} onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
                <NavLink to="/progress" className={mobileItemClass} onClick={() => setMobileMenuOpen(false)}>Progress</NavLink>
                <NavLink to="/settings" className={mobileItemClass} onClick={() => setMobileMenuOpen(false)}>Settings</NavLink>
              </nav>
            </div>
          )}
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
