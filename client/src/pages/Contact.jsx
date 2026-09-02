import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Contact() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', message: '' });
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/messages', form);
    setMsg('Thanks — we received your message.');
    setForm({ ...form, message: '' });
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2">
      <div>
        <h1 className="text-3xl font-extrabold">Contact us</h1>
        <p className="mt-2 text-mute">Questions about an order, returns, or styling? We are here.</p>
        <div className="mt-8 space-y-4">
          <p className="flex items-center gap-3"><Mail className="text-accent" />  hello@shopsphere.com</p>
          <p className="flex items-center gap-3"><Phone className="text-accent" />  +1 (415) 555-0199</p>
          <p className="flex items-center gap-3"><MapPin className="text-accent" />  221B Market Street, San Francisco</p>
        </div>
      </div>
      <form onSubmit={submit} className="card space-y-4 p-8">
        {msg && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{msg}</p>}
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <textarea className="input min-h-32" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
        <button className="btn-primary">Submit</button>
      </form>
    </div>
  );
}
