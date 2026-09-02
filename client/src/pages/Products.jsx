import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ items: [], pagination: { page: 1, pages: 1, total: 0 } });
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ brands: [], sizes: [], colors: [] });
  const [loading, setLoading] = useState(true);

  const query = Object.fromEntries(params.entries());

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data.data));
    api.get('/products/filters').then((r) => setFilters(r.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', { params: query })
      .then((r) => setData(r.data.data))
      .finally(() => setLoading(false));
  }, [params.toString()]);

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    next.set('page', '1');
    setParams(next);
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[260px_1fr]">
      <aside className="card h-fit space-y-6 p-5">
        <div>
          <p className="mb-2 font-semibold">Categories</p>
          {categories.map((c) => (
            <label key={c.category_id} className="flex items-center gap-2 py-1 text-sm">
              <input
                type="radio"
                name="cat"
                checked={String(query.category) === String(c.category_id)}
                onChange={() => set('category', c.category_id)}
              />
              {c.category_name}
            </label>
          ))}
          <button className="mt-1 text-xs text-accent" onClick={() => set('category', '')}>Clear</button>
        </div>
        <div>
          <p className="mb-2 font-semibold">Price Range</p>
          <div className="flex gap-2">
            <input className="input" placeholder="Min" defaultValue={query.minPrice} onBlur={(e) => set('minPrice', e.target.value)} />
            <input className="input" placeholder="Max" defaultValue={query.maxPrice} onBlur={(e) => set('maxPrice', e.target.value)} />
          </div>
        </div>
        <div>
          <p className="mb-2 font-semibold">Brand</p>
          {filters.brands.map((b) => (
            <label key={b} className="flex items-center gap-2 py-1 text-sm">
              <input type="radio" name="brand" checked={query.brand === b} onChange={() => set('brand', b)} />
              {b}
            </label>
          ))}
        </div>
        <div>
          <p className="mb-2 font-semibold">Size</p>
          <div className="flex flex-wrap gap-2">
            {filters.sizes.map((s) => (
              <button key={s} onClick={() => set('size', query.size === s ? '' : s)} className={`rounded-lg border px-2 py-1 text-xs ${query.size === s ? 'border-accent text-accent' : ''}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-semibold">Color</p>
          <div className="flex flex-wrap gap-2">
            {filters.colors.map((c) => (
              <button key={c} onClick={() => set('color', query.color === c ? '' : c)} className={`rounded-lg border px-2 py-1 text-xs ${query.color === c ? 'border-accent text-accent' : ''}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-semibold">Rating</p>
          {[4, 3, 2].map((r) => (
            <button key={r} className="block text-sm text-mute hover:text-navy" onClick={() => set('rating', r)}>
              {r}+ stars
            </button>
          ))}
        </div>
      </aside>
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Products</h1>
          <select className="input w-auto" value={query.sort || 'newest'} onChange={(e) => set('sort', e.target.value)}>
            <option value="newest">Newest</option>
            <option value="popularity">Popularity</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {data.items.map((p) => <ProductCard key={p.product_id} product={p} />)}
            </div>
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: data.pagination.pages || 1 }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    const next = new URLSearchParams(params);
                    next.set('page', String(p));
                    setParams(next);
                  }}
                  className={`h-9 w-9 rounded-lg ${Number(query.page || 1) === p ? 'bg-navy text-white' : 'bg-white'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
