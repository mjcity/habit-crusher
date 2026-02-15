import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#f1f5f9] p-4">
      <form onSubmit={submit} className="w-full max-w-md border-4 border-black bg-white p-6 shadow-[8px_8px_0_#000]">
        <h1 className="text-3xl font-black">Create account</h1>
        {error && <p className="my-3 border-2 border-black bg-red-200 p-2 font-bold">{error}</p>}
        <input placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mb-3 w-full border-4 border-black px-3 py-2" required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="mb-3 w-full border-4 border-black px-3 py-2" required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="w-full border-4 border-black px-3 py-2" required />
        <button className="mt-4 w-full border-4 border-black bg-green-300 py-2 font-black">Sign up</button>
        <p className="mt-3 text-center font-semibold">Already have an account? <Link to="/login" className="underline">Login</Link></p>
      </form>
    </div>
  );
}
