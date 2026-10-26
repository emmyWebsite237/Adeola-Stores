'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { formatNaira } from '@/lib/utils';
import Link from 'next/link';

const POPULAR_SEARCHES = ['Rice', 'Indomie', 'Milk', 'Vegetable Oil', 'Spaghetti', 'Custard', 'Sardines'];

export default function MobileSearchRow() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProducts = query.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.short.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 text-brand-muted pointer-events-none">
          <Search className="w-4 h-4 text-brand-muted" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search rice, noodles, milk, oil..."
          className="w-full pl-10 pr-24 py-2.5 bg-[#f4f6f4] hover:bg-white focus:bg-white text-sm text-brand-ink placeholder:text-brand-muted rounded-full border border-brand-line focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 outline-none transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-14 text-brand-muted hover:text-brand-ink p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-1.5 px-3 py-1.5 rounded-full bg-brand-green text-white text-xs font-bold hover:bg-brand-green-dark transition-colors flex items-center gap-1"
        >
          <span>Search</span>
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-card border border-brand-line z-50 overflow-hidden divide-y divide-brand-line-2">
          {query.trim() === '' ? (
            <div className="p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-muted block mb-2">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      router.push(`/shop?q=${encodeURIComponent(term)}`);
                      setIsOpen(false);
                    }}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#f4f6f4] hover:bg-brand-green-soft hover:text-brand-green transition-colors text-brand-ink"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div>
              <div className="p-2">
                {filteredProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-brand-green-soft transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-brand-line-2">
                        <img src={p.image} alt={p.name} className="w-7 h-7 object-contain" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-brand-ink truncate">{p.name}</p>
                        <p className="text-[10px] text-brand-muted">{p.size}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-brand-green flex-shrink-0">
                      {formatNaira(p.price)}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href={`/shop?q=${encodeURIComponent(query.trim())}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3 bg-brand-cream hover:bg-brand-green-soft text-xs font-bold text-brand-green transition-colors"
              >
                <span>See all results for “{query}”</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-brand-muted">
              No matching products found for “<strong>{query}</strong>”. Try checking spelling or searching for “Rice”, “Indomie”, or “Milk”.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
