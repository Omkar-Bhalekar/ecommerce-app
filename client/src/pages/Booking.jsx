import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Booking() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/bookings/slots').then((r) => setSlots(r.data.data));
    api.get('/bookings').then((r) => setBookings(r.data.data)).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    try {
      const { data } = await api.post('/bookings', { booking_date: date, booking_time: time });
      setMsg(`Booking confirmed (#${data.data.booking_id})`);
      const list = await api.get('/bookings');
      setBookings(list.data.data);
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Could not book slot');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Book a Personal Shopping Session</h1>
      <p className="mt-2 text-mute">Meet a stylist in-store or over video for a 45-minute session.</p>
      <form onSubmit={submit} className="card mt-8 space-y-5 p-8">
        {msg && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{msg}</p>}
        {err && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{err}</p>}
        <label className="block text-sm font-semibold">
          Calendar
          <input type="date" className="input mt-2" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <div>
          <p className="text-sm font-semibold">Available slots</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {slots.map((s) => (
              <button type="button" key={s} onClick={() => setTime(s)} className={`rounded-xl border px-4 py-2 text-sm ${time === s ? 'border-accent text-accent' : ''}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <button className="btn-primary" disabled={!date || !time}>Confirm Booking</button>
      </form>
      {bookings.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold">Your bookings</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {bookings.map((b) => (
              <li key={b.booking_id} className="card p-4">
                {b.booking_date} · {b.booking_time} · {b.booking_status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
