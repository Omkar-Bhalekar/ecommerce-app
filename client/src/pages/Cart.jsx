import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Cart() {
  const { cart, updateQty, removeItem } = useCart();
  const [promo, setPromo] = useState('');
  const [applied, setApplied] = useState(false);
  const discount = applied ? 5 : 0;
  const total = Math.max(0, (cart.summary.total || 0) - discount);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        {cart.items.length === 0 ? (
          <p className="mt-6 text-mute">Your cart is empty. <Link to="/products" className="text-accent">Shop now</Link></p>
        ) : (
          cart.items.map((item) => (
            <CartItem key={item.cart_item_id} item={item} onQty={updateQty} onRemove={removeItem} />
          ))
        )}
      </div>
      <aside className="card h-fit space-y-3 p-6">
        <h2 className="text-lg font-bold">Order Summary</h2>
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{cart.summary.subtotal?.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm"><span>Shipping</span><span>{cart.summary.shipping === 0 ? 'Free' : `₹${cart.summary.shipping.toFixed(2)}`}</span></div>
        <div className="flex justify-between text-sm"><span>Tax</span><span>₹{cart.summary.tax?.toFixed(2)}</span></div>
        {applied && <div className="flex justify-between text-sm text-emerald-600"><span>Promo</span><span>-₹5.00</span></div>}
        <div className="flex justify-between border-t pt-3 font-bold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        <div className="flex gap-2 pt-2">
          <input className="input" placeholder="Promo Code" value={promo} onChange={(e) => setPromo(e.target.value)} />
          <button className="btn-outline" onClick={() => setApplied(promo.toUpperCase() === 'SPHERE5')}>Apply</button>
        </div>
        <p className="text-xs text-mute">Try SPHERE5 for ₹5 off (frontend demo).</p>
        <Link to="/checkout" className={`btn-primary w-full ${!cart.items.length ? 'pointer-events-none opacity-50' : ''}`}>
          Pay Now
        </Link>
      </aside>
    </div>
  );
}
