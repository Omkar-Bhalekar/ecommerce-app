import { useEffect, useMemo, useState } from 'react';
import { Heart, Star, Truck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [tab, setTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [variantId, setVariantId] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => {
      setProduct(r.data.data);
      setVariantId(r.data.data.variants?.[0]?.variant_id || null);
    });
    api.get(`/reviews/${id}`).then((r) => setReviews(r.data.data));
  }, [id]);

  const variant = useMemo(
    () => product?.variants?.find((v) => v.variant_id === variantId),
    [product, variantId]
  );
  const saved = wishlist.some((w) => w.product_id === Number(id));

  if (!product) return <Loader />;

  const requireAuth = () => {
    if (!token) {
      navigate('/login');
      return false;
    }
    return true;
  };

  const add = async () => {
    if (!requireAuth()) return;
    await addToCart({ product_id: product.product_id, variant_id: variantId, quantity: qty });
  };

  const buy = async () => {
    await add();
    navigate('/checkout');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!requireAuth()) return;
    await api.post('/reviews', { product_id: product.product_id, ...review });
    const { data } = await api.get(`/reviews/${id}`);
    setReviews(data.data);
    setReview({ rating: 5, comment: '' });
  };

  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];
  const sizes = product.variants.filter((v) => !variant?.color || v.color === variant.color);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <img src={product.images?.[0] || product.image_url} alt={product.product_name} className="h-[28rem] w-full rounded-3xl object-cover" />
          <div className="grid grid-cols-4 gap-3">
            {(product.images || []).map((src) => (
              <img key={src} src={src} alt="" className="h-24 w-full rounded-xl object-cover" />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-mute">{product.category_name}</p>
          <h1 className="mt-1 text-3xl font-extrabold">{product.product_name}</h1>
          <div className="mt-2 flex items-center gap-2 text-amber-500">
            <Star size={16} fill="currentColor" />
            <span className="text-ink">{Number(product.rating).toFixed(1)}</span>
            <span className="text-mute">({product.total_reviews} reviews)</span>
          </div>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-extrabold">₹{Number(product.price).toFixed(2)}</span>
            {product.old_price && <span className="text-mute line-through">₹{Number(product.old_price).toFixed(2)}</span>}
          </div>
          <p className="mt-4 text-mute">{product.description}</p>

          {colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">Color</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => {
                  const v = product.variants.find((x) => x.color === c);
                  return (
                    <button
                      key={c}
                      onClick={() => setVariantId(v.variant_id)}
                      className={`rounded-xl border px-3 py-1.5 text-sm ${variant?.color === c ? 'border-accent text-accent' : ''}`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((v) => (
                  <button
                    key={v.variant_id}
                    onClick={() => setVariantId(v.variant_id)}
                    className={`rounded-xl border px-3 py-1.5 text-sm ${variantId === v.variant_id ? 'border-accent text-accent' : ''}`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-xl border">
              <button className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
              <span className="w-8 text-center">{qty}</span>
              <button className="px-3 py-2" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button className="btn-primary" onClick={add}>Add to Cart</button>
            <button className="btn-navy" onClick={buy}>Buy Now</button>
            <button className={saved ? 'text-rose-500' : 'text-mute'} onClick={() => requireAuth() && toggleWishlist(product.product_id)}>
              <Heart fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-mute">
            <Truck size={16} /> Free shipping over ₹75 · Easy 30-day returns
          </p>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex gap-6 border-b">
          {['description', 'reviews', 'shipping'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`pb-3 capitalize ${tab === t ? 'border-b-2 border-accent font-semibold' : 'text-mute'}`}>
              {t === 'shipping' ? 'Shipping & Returns' : t}
            </button>
          ))}
        </div>
        <div className="py-6">
          {tab === 'description' && <p className="text-mute">{product.description}</p>}
          {tab === 'shipping' && (
            <p className="text-mute">Orders ship within 2 business days. Returns accepted within 30 days in original condition.</p>
          )}
          {tab === 'reviews' && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.review_id} className="card p-4">
                    <p className="font-semibold">{r.name} · {r.rating}/5</p>
                    <p className="text-sm text-mute">{r.comment}</p>
                  </div>
                ))}
              </div>
              {user && (
                <form onSubmit={submitReview} className="card space-y-3 p-5">
                  <p className="font-semibold">Write a review</p>
                  <select className="input" value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
                  </select>
                  <textarea className="input min-h-24" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} placeholder="Comment" />
                  <button className="btn-primary">Submit review</button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      <h2 className="mt-8 text-2xl font-bold">Related Products</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(product.related || []).map((p) => <ProductCard key={p.product_id} product={p} />)}
      </div>
    </div>
  );
}
