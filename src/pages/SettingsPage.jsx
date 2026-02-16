import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

export default function SettingsPage() {
  const { currentUser, updateProfile, changePassword, supabaseEnabled } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    sex: currentUser?.sex || '',
    age: currentUser?.age || '',
    avatarUrl: currentUser?.avatarUrl || '',
    avatarPosX: Number(currentUser?.avatarPosX ?? 50),
    avatarPosY: Number(currentUser?.avatarPosY ?? 50)
  });

  useEffect(() => {
    setProfile({
      name: currentUser?.name || '',
      sex: currentUser?.sex || '',
      age: currentUser?.age || '',
      avatarUrl: currentUser?.avatarUrl || '',
      avatarPosX: Number(currentUser?.avatarPosX ?? 50),
      avatarPosY: Number(currentUser?.avatarPosY ?? 50)
    });
  }, [currentUser]);

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

  const onPickAvatar = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile((p) => ({ ...p, avatarUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    try {
      await updateProfile(profile);
      setProfileMsg('Profile updated.');
    } catch (err) {
      setProfileMsg(err.message || 'Could not save profile.');
    }
  };

  return (
    <Layout title="Settings" subtitle="Account preferences" showAdd={false}>
      <section className="mb-5 max-w-xl border-4 border-black bg-white p-4 shadow-[6px_6px_0_#000]">
        <h3 className="text-xl font-black">Personal Details</h3>
        <p className="mt-1 text-sm font-semibold">{currentUser?.email}</p>
        <div className="mt-4 flex flex-col items-center">
          <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-black bg-slate-100">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Profile" className="h-full w-full object-cover" style={{ objectPosition: `${profile.avatarPosX}% ${profile.avatarPosY}%` }} /> : null}
          </div>
          <label className="mt-2 cursor-pointer font-black text-orange-500">Edit Photo<input type="file" accept="image/*" className="hidden" onChange={(e) => onPickAvatar(e.target.files?.[0])} /></label>
        </div>

        <div className="mt-3 space-y-2">
          <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className="w-full border-4 border-black px-3 py-2" />
          <input value={profile.sex} onChange={(e) => setProfile((p) => ({ ...p, sex: e.target.value }))} placeholder="Sex" className="w-full border-4 border-black px-3 py-2" />
          <input value={profile.age} onChange={(e) => setProfile((p) => ({ ...p, age: e.target.value }))} placeholder="Age" className="w-full border-4 border-black px-3 py-2" />

          <p className="text-xs font-bold">Center profile photo horizontally</p>
          <input type="range" min="0" max="100" value={profile.avatarPosX} onChange={(e) => setProfile((p) => ({ ...p, avatarPosX: Number(e.target.value) }))} className="w-full" />
          <p className="text-xs font-bold">Center profile photo vertically</p>
          <input type="range" min="0" max="100" value={profile.avatarPosY} onChange={(e) => setProfile((p) => ({ ...p, avatarPosY: Number(e.target.value) }))} className="w-full" />

          <button onClick={saveProfile} className="border-4 border-black bg-blue-300 px-4 py-2 font-black">Save Profile</button>
          {profileMsg && <p className="font-bold">{profileMsg}</p>}
        </div>
      </section>

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
