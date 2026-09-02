import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';

export default function Payment() {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [error, setError] = useState('');

  useEffect(() => {
    const addressId = sessionStorage.getItem('ss_address');
    if (!addressId) {
      navigate('/checkout', { replace: true });
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.post('/orders', {
          address_id: Number(addressId),
          payment_method: 'WALLET',
        });
        await refreshCart();
        if (!cancelled) navigate(`/order-success?orderId=${data.data.order_id}`, { replace: true });
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Could not place order');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="rounded-xl bg-rose-50 p-4 text-rose-600">{error}</p>
        <button className="btn-primary mt-6" onClick={() => navigate('/checkout')}>
          Back to checkout
        </button>
      </div>
    );
  }

  return (
    <div className="py-20">
      <Loader />
      <p className="text-center text-sm text-mute">Creating your receipt…</p>
    </div>
  );
}
