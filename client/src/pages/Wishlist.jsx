import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const move = async (p) => {
    if (!token) return navigate('/login');
    await addToCart({ product_id: p.product_id, quantity: 1 });
    await toggleWishlist(p.product_id);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="mt-6 text-mute">No saved items yet.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((p) => (
            <div key={p.wishlist_id} className="card overflow-hidden">
              <Link to={`/products/${p.product_id}`}>
                <img src={p.image_url} alt={p.product_name} className="h-56 w-full object-cover" />
              </Link>
              <div className="space-y-2 p-4">
                <h3 className="font-semibold">{p.product_name}</h3>
                <p className="font-bold">₹{Number(p.price).toFixed(2)}</p>
                <div className="flex gap-2">
                  <button className="btn-primary flex-1 text-xs" onClick={() => move(p)}>Move to cart</button>
                  <button className="btn-outline text-xs" onClick={() => toggleWishlist(p.product_id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
