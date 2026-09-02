import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cart, setCart] = useState({ items: [], summary: { subtotal: 0, shipping: 0, tax: 0, total: 0 } });
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState('');

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const refreshCart = async () => {
    if (!token) {
      setCart({ items: [], summary: { subtotal: 0, shipping: 0, tax: 0, total: 0 } });
      return;
    }
    const { data } = await api.get('/cart');
    setCart({ items: data.data.items, summary: data.data.summary });
  };

  const refreshWishlist = async () => {
    if (!token) {
      setWishlist([]);
      return;
    }
    const { data } = await api.get('/wishlist');
    setWishlist(data.data);
  };

  useEffect(() => {
    refreshCart().catch(() => {});
    refreshWishlist().catch(() => {});
  }, [token]);

  const addToCart = async (payload) => {
    const { data } = await api.post('/cart', payload);
    setCart({ items: data.data.items, summary: data.data.summary });
    notify('Added to cart');
  };

  const updateQty = async (itemId, quantity) => {
    const { data } = await api.put(`/cart/${itemId}`, { quantity });
    setCart({ items: data.data.items, summary: data.data.summary });
  };

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`/cart/${itemId}`);
    setCart({ items: data.data.items, summary: data.data.summary });
  };

  const toggleWishlist = async (productId) => {
    const exists = wishlist.some((w) => w.product_id === productId);
    const { data } = exists
      ? await api.delete(`/wishlist/${productId}`)
      : await api.post('/wishlist', { product_id: productId });
    setWishlist(data.data);
    notify(exists ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      toast,
      notify,
      refreshCart,
      refreshWishlist,
      addToCart,
      updateQty,
      removeItem,
      toggleWishlist,
    }),
    [cart, wishlist, toast]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-navy px-5 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
