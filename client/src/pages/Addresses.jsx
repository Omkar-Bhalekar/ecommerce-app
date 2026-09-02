import { useEffect, useState } from 'react';
import api from '../services/api';

const empty = { full_name: '', phone: '', address_line: '', apartment: '', city: '', state: '', postal_code: '', is_default: false };

export default function Addresses() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  const load = () => api.get('/addresses').then((r) => setList(r.data.data));
  useEffect(() => { load(); }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/addresses/${editId}`, form);
    else await api.post('/addresses', form);
    setForm(empty);
    setEditId(null);
    load();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">Addresses</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {list.map((a) => (
          <div key={a.address_id} className="card p-5">
            <p className="font-semibold">{a.full_name} {a.is_default ? '· Default' : ''}</p>
            <p className="text-sm text-mute">{a.address_line} {a.apartment}, {a.city}, {a.state} {a.postal_code}</p>
            <p className="text-sm text-mute">{a.phone}</p>
            <div className="mt-3 flex gap-2">
              <button className="btn-outline text-xs" onClick={() => { setEditId(a.address_id); setForm({ ...a, is_default: !!a.is_default }); }}>Edit</button>
              <button className="btn-outline text-xs" onClick={async () => { await api.delete(`/addresses/${a.address_id}`); load(); }}>Delete</button>
              {!a.is_default && (
                <button className="btn-primary text-xs" onClick={async () => { await api.patch(`/addresses/${a.address_id}/default`); load(); }}>Set default</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="card mt-8 grid gap-3 p-6 sm:grid-cols-2">
        <h2 className="sm:col-span-2 font-semibold">{editId ? 'Edit address' : 'Add address'}</h2>
        {['full_name', 'phone', 'address_line', 'apartment', 'city', 'state', 'postal_code'].map((k) => (
          <input key={k} className="input" name={k} placeholder={k.replace('_', ' ')} value={form[k] || ''} onChange={onChange} required={k !== 'apartment'} />
        ))}
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" name="is_default" checked={!!form.is_default} onChange={onChange} /> Set as default
        </label>
        <button className="btn-primary sm:col-span-2">{editId ? 'Update' : 'Add address'}</button>
      </form>
    </div>
  );
}
