import { CheckCircle2, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      setError('No order to show.');
      return;
    }
    api
      .get(`/orders/${orderId}`)
      .then((r) => setOrder(r.data.data))
      .catch(() => setError('Could not load receipt.'));
  }, [orderId]);

  if (!order && !error) return <Loader />;

  const subtotal = order?.items?.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0) || 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-6 text-center print:hidden">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
        <h1 className="mt-3 text-3xl font-extrabold">Thank You for Your Order!</h1>
        <p className="mt-2 text-mute">Your receipt is ready. Payment was skipped and the order is confirmed.</p>
      </div>

      {error && <p className="rounded-xl bg-rose-50 p-3 text-center text-sm text-rose-600">{error}</p>}

      {order && (
        <div id="receipt" className="card overflow-hidden">
          <div className="flex items-start justify-between bg-navy px-6 py-5 text-white">
            <div>
              <p className="text-lg font-extrabold">ShopSphere</p>
              <p className="text-xs text-slate-300">Official order receipt</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">Order #{order.order_id}</p>
              <p className="text-slate-300">{new Date(order.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-mute">Billed / shipped to</p>
              <p className="mt-1 font-semibold">{order.full_name}</p>
              <p className="text-sm text-mute">
                {order.address_line}
                {order.apartment ? `, ${order.apartment}` : ''}
                <br />
                {order.city}, {order.state} {order.postal_code}
                <br />
                {order.phone}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-mute">Payment</p>
              <p className="mt-1 font-semibold">{order.payment?.payment_method || 'WALLET'}</p>
              <p className="text-sm text-emerald-600">{order.payment?.payment_status || 'SUCCESS'}</p>
              <p className="mt-2 text-sm text-mute">Status: {order.order_status}</p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-slate-100 text-left text-mute">
                  <th className="py-2 font-medium">Item</th>
                  <th className="py-2 font-medium">Qty</th>
                  <th className="py-2 text-right font-medium">Price</th>
                  <th className="py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((i) => (
                  <tr key={i.order_item_id} className="border-b border-slate-50">
                    <td className="py-3">
                      <p className="font-medium">{i.product_name}</p>
                      {(i.size || i.color) && (
                        <p className="text-xs text-mute">{[i.size, i.color].filter(Boolean).join(' · ')}</p>
                      )}
                    </td>
                    <td className="py-3">{i.quantity}</td>
                    <td className="py-3 text-right">₹{Number(i.price).toFixed(2)}</td>
                    <td className="py-3 text-right">₹{(Number(i.price) * i.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
              <div className="flex justify-between text-mute">
                <span>Items subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-bold">
                <span>Amount paid</span>
                <span>₹{Number(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-3 print:hidden">
        <button className="btn-outline" onClick={() => window.print()}>
          <Printer size={16} /> Print receipt
        </button>
        <Link to="/orders" className="btn-primary">View Order</Link>
        <Link to="/products" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}
