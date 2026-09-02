import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get('query') || '';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api.get('/products/search', { params: { query } })
      .then((r) => setItems(r.data.data.items))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Search results</h1>
      <div className="mt-4 max-w-lg"><SearchBar /></div>
      {query && <p className="mt-3 text-mute">Showing results for “{query}”</p>}
      {loading ? <Loader /> : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.product_id} product={p} />)}
          {!items.length && <p className="text-mute">No products found.</p>}
        </div>
      )}
    </div>
  );
}
