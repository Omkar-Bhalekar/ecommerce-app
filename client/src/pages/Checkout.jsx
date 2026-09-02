import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const steps = ['Shipping', 'Pay', 'Receipt'];

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '', phone: '', address_line: '', apartment: '', city: '', state: '', postal_code: '',
  });

  useEffect(() => {
    api.get('/addresses').then((r) => {
      setAddresses(r.data.data);
      const def = r.data.data.find((a) => a.is_default) || r.data.data[0];
      if (def) setSelected(def.address_id);
    });
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const placeAndShowReceipt = async (addressId) => {
    setError('');
    if (!cart.items.length) {
      setError('Your cart is empty.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        address_id: Number(addressId),
        payment_method: 'WALLET',
      });
      await refreshCart();
      navigate(`/order-success?orderId=${data.data.order_id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/addresses', { ...form, is_default: addresses.length === 0 });
    await placeAndShowReceipt(data.data.address_id);
  };

  const payNow = () => {
    if (!selected) {
      setError('Select a shipping address first.');
      return;
    }
    placeAndShowReceipt(selected);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex justify-center gap-6 text-sm font-semibold">
        {steps.map((s, i) => (
          <span key={s} className={i === 0 ? 'text-accent' : 'text-mute'}>{i + 1}. {s}</span>
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="card p-6">
          <h1 className="text-2xl font-bold">Shipping Address</h1>
          {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
          <div className="mt-4 space-y-3">
            {addresses.map((a) => (
              <label key={a.address_id} className="flex cursor-pointer items-start gap-3 rounded-xl border p-4">
                <input type="radio" checked={selected === a.address_id} onChange={() => setSelected(a.address_id)} />
                <div>
                  <p className="font-semibold">{a.full_name} {a.is_default ? '(Default)' : ''}</p>
                  <p className="text-sm text-mute">{a.address_line}, {a.city}, {a.state} {a.postal_code}</p>
                </div>
              </label>
            ))}
          </div>
          {addresses.length > 0 && (
            <button className="btn-primary mt-4" onClick={payNow} disabled={loading}>
              {loading ? 'Placing order...' : 'Pay Now'}
            </button>
          )}
          <form onSubmit={addAddress} className="mt-8 grid gap-3 sm:grid-cols-2">
            <h2 className="sm:col-span-2 font-semibold">Add a new address</h2>
            {['full_name', 'phone', 'address_line', 'apartment', 'city', 'state', 'postal_code'].map((k) => (
              <input key={k} className="input" name={k} placeholder={k.replace('_', ' ')} value={form[k]} onChange={onChange} required={k !== 'apartment'} />
            ))}
            <button className="btn-navy sm:col-span-2" disabled={loading}>
              {loading ? 'Placing order...' : 'Save address & Pay Now'}
            </button>
          </form>
        </div>
        <aside className="card h-fit p-6">
          <h2 className="font-bold">Order summary</h2>
          {cart.items.map((i) => (
            <div key={i.cart_item_id} className="mt-3 flex justify-between text-sm">
              <span>{i.product_name} × {i.quantity}</span>
              <span>₹{(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{cart.summary.total?.toFixed(2)}</span>
          </div>
          <p className="mt-3 text-xs text-mute">Pay Now confirms the order and opens your receipt. No payment form is shown.</p>
        </aside>
      </div>
    </div>
  );
}
