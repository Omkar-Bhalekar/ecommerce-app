import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart, wishlist } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const count = cart.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Link to="/" className="shrink-0">
          <p className="text-xl font-extrabold tracking-tight text-navy">ShopSphere</p>
          <p className="hidden text-[10px] uppercase tracking-[0.18em] text-mute sm:block">
            Everything you love
          </p>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-mute lg:flex">
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'text-navy' : 'hover:text-navy')}>
            Shop
          </NavLink>
          <NavLink to="/products?category=1" className="hover:text-navy">Men</NavLink>
          <NavLink to="/products?category=2" className="hover:text-navy">Women</NavLink>
          <NavLink to="/booking" className="hover:text-navy">Styling</NavLink>
          <NavLink to="/contact" className="hover:text-navy">Contact</NavLink>
        </nav>
        <div className="ml-auto hidden flex-1 max-w-md md:block">
          <SearchBar />
        </div>
        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <button className="md:hidden" onClick={() => navigate('/search')} aria-label="Search">
            <Search size={20} />
          </button>
          <Link to="/wishlist" className="relative" aria-label="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative" aria-label="Cart">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-1 text-sm font-medium">
                <User size={18} />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="hidden text-xs text-mute hover:text-navy sm:inline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary px-3 py-2 text-xs">
              Sign in
            </Link>
          )}
        </div>
      </div>
      {open && (
        <div className="space-y-3 border-t border-slate-100 px-4 py-4 lg:hidden">
          <SearchBar onSubmit={() => setOpen(false)} />
          <Link to="/products" onClick={() => setOpen(false)} className="block">Shop all</Link>
          <Link to="/booking" onClick={() => setOpen(false)} className="block">Book a session</Link>
          <Link to="/orders" onClick={() => setOpen(false)} className="block">My orders</Link>
          <Link to="/contact" onClick={() => setOpen(false)} className="block">Contact</Link>
        </div>
      )}
    </header>
  );
}
