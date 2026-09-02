import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Package } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, wishlistItems: 0, savedAddresses: 0 });
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  useEffect(() => {
    api.get('/auth/stats').then((r) => setStats(r.data.data));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const { data } = await api.put('/auth/me', form);
    setUser(data.data);
    localStorage.setItem('ss_user', JSON.stringify(data.data));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-3 p-5"><Package className="text-accent" /><div><p className="text-2xl font-bold">{stats.totalOrders}</p><p className="text-sm text-mute">Total Orders</p></div></div>
        <div className="card flex items-center gap-3 p-5"><Heart className="text-accent" /><div><p className="text-2xl font-bold">{stats.wishlistItems}</p><p className="text-sm text-mute">Wishlist Items</p></div></div>
        <div className="card flex items-center gap-3 p-5"><MapPin className="text-accent" /><div><p className="text-2xl font-bold">{stats.savedAddresses}</p><p className="text-sm text-mute">Saved Addresses</p></div></div>
      </div>
      <form onSubmit={save} className="card mt-8 max-w-lg space-y-3 p-6">
        <p className="font-semibold">Account details</p>
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" value={user?.email || ''} disabled />
        <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <button className="btn-primary">Save changes</button>
      </form>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/orders" className="btn-outline">My orders</Link>
        <Link to="/addresses" className="btn-outline">Addresses</Link>
        <Link to="/booking" className="btn-outline">Bookings</Link>
        <button className="btn-navy" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
