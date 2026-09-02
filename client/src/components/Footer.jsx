import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 bg-navy text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-xl font-extrabold text-white">ShopSphere</h3>
          <p className="mt-2 text-sm">Everything You Love, All in One Place</p>
        </div>
        <div>
          <p className="font-semibold text-white">Shop</p>
          <div className="mt-3 space-y-2 text-sm">
            <Link to="/products?category=1" className="block hover:text-white">Men</Link>
            <Link to="/products?category=2" className="block hover:text-white">Women</Link>
            <Link to="/products?category=3" className="block hover:text-white">Footwear</Link>
            <Link to="/products?category=6" className="block hover:text-white">Electronics</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-white">Help</p>
          <div className="mt-3 space-y-2 text-sm">
            <Link to="/contact" className="block hover:text-white">Contact</Link>
            <Link to="/booking" className="block hover:text-white">Personal shopping</Link>
            <Link to="/orders" className="block hover:text-white">Track order</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-white">Newsletter</p>
          <p className="mt-3 text-sm">Get new arrivals and exclusive offers.</p>
          <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input className="input bg-white/10 text-white placeholder:text-slate-400" placeholder="Email" />
            <button className="btn-primary">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} ShopSphere. Built as a full-stack college project.
      </div>
    </footer>
  );
}
