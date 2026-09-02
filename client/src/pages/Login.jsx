import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [forgot, setForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    setError('');
    const { data } = await api.post('/auth/forgot-password', { email: form.email });
    setInfo(data.message);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold">{forgot ? 'Reset password' : 'Welcome back'}</h1>
        <p className="mt-1 text-sm text-mute">ShopSphere account access</p>
        {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
        {info && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{info}</p>}
        {forgot ? (
          <form onSubmit={reset} className="mt-6 space-y-4">
            <input className="input" name="email" value={form.email} onChange={onChange} placeholder="Email" required />
            <button className="btn-primary w-full">Send reset instructions</button>
            <button type="button" className="w-full text-sm text-accent" onClick={() => setForgot(false)}>
              Back to login
            </button>
          </form>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input className="input" name="email" type="email" value={form.email} onChange={onChange} placeholder="Email" required />
            <input className="input" name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" required />
            <button type="button" className="text-sm text-accent" onClick={() => setForgot(true)}>
              Forgot Password
            </button>
            <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
            <button type="button" className="btn-outline w-full" onClick={() => setInfo('Google login is a UI demo for this project.')}>
              Continue with Google
            </button>
            <p className="text-center text-sm text-mute">
              New here? <Link to="/register" className="font-semibold text-accent">Register</Link>
            </p>
            <p className="text-center text-xs text-mute">Demo: alex@shopsphere.com / Password123!</p>
          </form>
        )}
      </div>
    </div>
  );
}
