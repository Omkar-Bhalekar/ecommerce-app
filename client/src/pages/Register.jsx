import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold">Create your account</h1>
        {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input className="input" name="name" value={form.name} onChange={onChange} placeholder="Name" required />
          <input className="input" name="email" type="email" value={form.email} onChange={onChange} placeholder="Email" required />
          <input className="input" name="phone" value={form.phone} onChange={onChange} placeholder="Phone" required />
          <input className="input" name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" required />
          <input className="input" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} placeholder="Confirm Password" required />
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
          <p className="text-center text-sm text-mute">
            Already have an account? <Link to="/login" className="font-semibold text-accent">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
