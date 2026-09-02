import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ onSubmit }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const go = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/search?query=${encodeURIComponent(query)}`);
    onSubmit?.();
  };

  return (
    <form onSubmit={go} className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
<input
  value={q}
  onChange={(e) => setQ(e.target.value)}
  className="input"
  style={{ paddingLeft: '2.25rem' }}
  placeholder="Search products, brands..."
/>
    </form>
  );
}
