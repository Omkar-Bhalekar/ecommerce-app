import { Heart, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { token } = useAuth();
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const navigate = useNavigate();
  const saved = wishlist.some((w) => w.product_id === product.product_id);

  const onWish = async (e) => {
    e.preventDefault();
    if (!token) return navigate('/login');
    await toggleWishlist(product.product_id);
  };

  const onCart = async (e) => {
    e.preventDefault();
    if (!token) return navigate('/login');
    const variant = product.variants?.[0];
    await addToCart({ product_id: product.product_id, variant_id: variant?.variant_id, quantity: 1 });
  };

  return (
    <Link to={`/products/${product.product_id}`} className="card group overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <img
          src={product.image_url}
          alt={product.product_name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.old_price && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
            Sale
          </span>
        )}
        <button
          onClick={onWish}
          className={`absolute right-3 top-3 rounded-full bg-white p-2 shadow ${saved ? 'text-rose-500' : 'text-mute'}`}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-wide text-mute">{product.category_name || product.brand}</p>
        <h3 className="font-semibold leading-snug">{product.product_name}</h3>
        <div className="flex items-center gap-1 text-sm text-amber-500">
          <Star size={14} fill="currentColor" />
          <span className="text-ink">{Number(product.rating).toFixed(1)}</span>
          <span className="text-mute">({product.total_reviews})</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="font-bold">₹{Number(product.price).toFixed(2)}</span>
            {product.old_price && (
              <span className="ml-2 text-sm text-mute line-through">₹{Number(product.old_price).toFixed(2)}</span>
            )}
          </div>
          <button onClick={onCart} className="text-xs font-semibold text-accent hover:underline">
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}
