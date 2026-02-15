import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

export default function SettingsPage() {
  const { changePassword, supabaseEnabled } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (form.newPassword.length < 8) return setMsg('Password must be at least 8 characters');
    if (form.newPassword !== form.confirmPassword) return setMsg('Passwords do not match');
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setMsg('Password updated.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMsg(err.message || 'Failed to update password');
    }
  };

  return (
    <Layout title="Settings" subtitle="Account preferences" showAdd={false}>
      <section className="max-w-xl border-4 border-black bg-yellow-200 p-4 shadow-[6px_6px_0_#000]">
        <h3 className="text-xl font-black">Change Password</h3>
        <form onSubmit={submit} className="mt-3 space-y-3">
          {!supabaseEnabled && <input type="password" placeholder="Current password" value={form.currentPassword} onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))} className="w-full border-4 border-black px-3 py-2" required />}
          <input type="password" placeholder="New password" value={form.newPassword} onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))} className="w-full border-4 border-black px-3 py-2" required />
          <input type="password" placeholder="Confirm new password" value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} className="w-full border-4 border-black px-3 py-2" required />
          <button className="border-4 border-black bg-black px-4 py-2 font-black text-white">Update Password</button>
          {msg && <p className="font-bold">{msg}</p>}
        </form>
      </section>
    </Layout>
  );
}
