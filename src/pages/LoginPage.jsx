import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#f1f5f9] p-4">
      <form onSubmit={submit} className="w-full max-w-md border-4 border-black bg-white p-6 shadow-[8px_8px_0_#000]">
        <h1 className="text-3xl font-black">Habit Crusher</h1>
        <p className="mb-4 font-bold">Welcome back</p>
        {error && <p className="mb-3 border-2 border-black bg-red-200 p-2 font-bold">{error}</p>}
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="mb-3 w-full border-4 border-black px-3 py-2" required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="w-full border-4 border-black px-3 py-2" required />
        <button className="mt-4 w-full border-4 border-black bg-blue-400 py-2 font-black">Login</button>
        <p className="mt-3 text-center font-semibold">New here? <Link to="/signup" className="underline">Create account</Link></p>
      </form>
    </div>
  );
}
