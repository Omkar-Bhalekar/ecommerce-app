import { Truck, RefreshCw, ShieldCheck, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const HERO_SLIDES = [
  {
    eyebrow: 'ShopSphere',
    title: 'Discover Your Perfect Style',
    subtitle: 'Explore fashion, footwear, accessories and lifestyle essentials.',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    secondaryText: 'Explore Collection',
    secondaryLink: '/products?sort=newest',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
  },
  {
    eyebrow: 'New Season',
    title: 'Footwear That Moves With You',
    subtitle: 'Fresh sneaker and boot drops, built for everyday comfort.',
    ctaText: 'Shop Footwear',
    ctaLink: '/products?category=Footwear',
    secondaryText: 'View All',
    secondaryLink: '/products',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200',
  },
  {
    eyebrow: 'Limited Time',
    title: 'Up To 50% Off Electronics',
    subtitle: 'Headphones, smartwatches and more at can\'t-miss prices.',
    ctaText: 'Shop the Sale',
    ctaLink: '/products?category=Electronics',
    secondaryText: 'Explore Collection',
    secondaryLink: '/products',
    image: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=1200',
  },
];

function HeroCarousel() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const active = HERO_SLIDES[slide];
  const prev = () => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => setSlide((s) => (s + 1) % HERO_SLIDES.length);

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:py-14">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-200">{active.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">{active.title}</h1>
          <p className="mt-3 max-w-lg text-slate-300">{active.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={active.ctaLink} className="btn-primary">{active.ctaText}</Link>
            <Link to={active.secondaryLink} className="btn-outline border-white/20 bg-transparent text-white hover:border-white">
              {active.secondaryText}
            </Link>
          </div>
        </div>
        <div className="relative">
          <img
            src={active.image}
            alt={active.title}
            className="h-56 w-full rounded-3xl object-cover shadow-2xl lg:h-72"
          />
          <button
            onClick={prev}
            aria-label="Previous banner"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-1.5 backdrop-blur transition hover:bg-white/30"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next banner"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-1.5 backdrop-blur transition hover:bg-white/30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="flex justify-center gap-2 pb-4">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Go to banner ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === slide ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [best, setBest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/products?sort=newest&limit=8'),
      api.get('/products?sort=popularity&limit=8'),
    ])
      .then(([c, a, b]) => {
        setCategories(c?.data?.data || []);
        setArrivals(a?.data?.data?.items || []);
        setBest(b?.data?.data?.items || []);
      })
      .catch((err) => {
        console.error('Home load error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <HeroCarousel />

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Truck, t: 'Free Shipping', d: 'On orders over ₹75' },
          { icon: RefreshCw, t: 'Easy Returns', d: '30-day hassle-free returns' },
          { icon: ShieldCheck, t: 'Secure Payment', d: 'Encrypted checkout' },
          { icon: Headphones, t: '24/7 Support', d: 'Chat with our stylists' },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="card flex items-center gap-4 p-5">
            <Icon className="text-accent" />
            <div>
              <p className="font-semibold">{t}</p>
              <p className="text-sm text-mute">{d}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link to="/products" className="text-sm font-semibold text-accent">View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => <CategoryCard key={c.category_id} category={c} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">New Arrivals</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {arrivals.map((p) => <ProductCard key={p.product_id} product={p} />)}
        </div>
      </section>

      <section className="mx-auto my-8 max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-accent to-blue-500 px-8 py-8 text-white">
        <p className="text-sm uppercase tracking-widest">Summer Sale</p>
        <h2 className="mt-2 text-3xl font-extrabold">Up to 50% OFF</h2>
        <p className="mt-2 text-blue-100">Limited-time markdowns on fashion, footwear and electronics.</p>
        <Link to="/products?sort=price_asc" className="btn-navy mt-4 bg-white text-navy hover:bg-slate-100">
          Shop the sale
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">Best Sellers</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {best.map((p) => <ProductCard key={p.product_id} product={p} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-6 text-2xl font-bold">What shoppers say</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { n: 'Maya K.', t: 'Fast shipping and the denim jacket fits perfectly.' },
            { n: 'Rahul S.', t: 'Checkout was simple. Love the personal styling booking.' },
            { n: 'Elena P.', t: 'Quality is better than I expected for the price.' },
          ].map((r) => (
            <div key={r.n} className="card p-6">
              <p className="text-mute">“{r.t}”</p>
              <p className="mt-4 font-semibold">{r.n}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
