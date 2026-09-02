import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    api.get('/orders').then((r) => setOrders(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">My Orders</h1>
      {orders.length === 0 && <p className="mt-6 text-mute">No orders yet.</p>}
      <div className="mt-6 space-y-4">
        {orders.map((o) => (
          <div key={o.order_id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">Order #{o.order_id}</p>
                <p className="text-sm text-mute">{new Date(o.created_at).toLocaleString()}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{o.order_status}</span>
              <p className="font-bold">₹{Number(o.total_amount).toFixed(2)}</p>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {o.items.map((i) => (
                <img key={i.order_item_id} src={i.image_url} alt={i.product_name} className="h-16 w-16 rounded-lg object-cover" />
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <button className="btn-outline text-xs" onClick={() => setOpen(open === o.order_id ? null : o.order_id)}>View Details</button>
              <button className="btn-primary text-xs" onClick={() => alert(`Tracking: Order #${o.order_id} is ${o.order_status}`)}>Track Order</button>
            </div>
            {open === o.order_id && (
              <div className="mt-4 space-y-2 text-sm">
                {o.items.map((i) => (
                  <div key={i.order_item_id} className="flex justify-between">
                    <span>{i.product_name} × {i.quantity} {i.size ? `(${i.size}/${i.color})` : ''}</span>
                    <span>₹{Number(i.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Link to="/products" className="mt-6 inline-block text-sm text-accent">Continue shopping</Link>
    </div>
  );
}
