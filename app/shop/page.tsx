'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  const queryParam = searchParams.get('q') || '';

  const [selectedCat, setSelectedCat] = useState<string>(catParam || 'all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Sync state if URL searchParam changes
  useMemo(() => {
    if (catParam) setSelectedCat(catParam);
  }, [catParam]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCat !== 'all' && p.category !== selectedCat) return false;
      // Search query filter
      if (queryParam) {
        const query = queryParam.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.short.toLowerCase().includes(query);
        if (!matches) return false;
      }
      // In stock filter
      if (inStockOnly && p.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'discount') {
        const discA = a.oldPrice ? a.oldPrice - a.price : 0;
        const discB = b.oldPrice ? b.oldPrice - b.price : 0;
        return discB - discA;
      }
      return 0; // featured default
    });
  }, [selectedCat, queryParam, inStockOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Title & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-brand-line-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink">
            {queryParam ? `Search results for “${queryParam}”` : selectedCat !== 'all' ? CATEGORIES.find(c => c.id === selectedCat)?.name || 'Supermarket Aisle' : 'All Groceries'}
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Showing {filteredProducts.length} verified sealed foodstuffs
          </p>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-brand-line text-xs font-bold text-brand-ink shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="relative inline-flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
              className="appearance-none bg-white border border-brand-line rounded-full px-4 py-2 pr-8 text-xs font-bold text-brand-ink outline-none focus:border-brand-green cursor-pointer shadow-sm"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-brand-muted absolute right-3 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-brand-line shadow-soft space-y-5">
            <div>
              <h3 className="text-xs font-extrabold text-brand-ink uppercase tracking-wider mb-3">
                Shop By Category
              </h3>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCat('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCat === 'all'
                      ? 'bg-brand-green-soft text-brand-green font-bold'
                      : 'text-brand-muted hover:bg-gray-50 hover:text-brand-ink'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] text-gray-400">{PRODUCTS.length}</span>
                </button>

                {CATEGORIES.map((cat) => {
                  const count = PRODUCTS.filter((p) => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCat(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                        selectedCat === cat.id
                          ? 'bg-brand-green-soft text-brand-green font-bold'
                          : 'text-brand-muted hover:bg-gray-50 hover:text-brand-ink'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] text-gray-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-brand-line-2">
              <h3 className="text-xs font-extrabold text-brand-ink uppercase tracking-wider mb-3">
                Availability
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-brand-ink">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-brand-green focus:ring-brand-green accent-brand-green"
                />
                <span>In Stock items only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-brand-line p-12 text-center space-y-3">
              <p className="font-bold text-base text-brand-ink">No items found matching your filters</p>
              <p className="text-xs text-brand-muted">Try selecting another aisle or clearing your search query.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCat('all');
                  setInStockOnly(false);
                }}
                className="px-5 py-2 rounded-full bg-brand-green text-white text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white p-6 shadow-xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-brand-line">
                <span className="font-bold text-base text-brand-ink">Filter Groceries</span>
                <button onClick={() => setDrawerOpen(false)} className="p-1 text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3">
                <p className="text-xs font-bold text-brand-muted uppercase">Categories</p>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedCat('all'); setDrawerOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${selectedCat === 'all' ? 'bg-brand-green-soft text-brand-green font-bold' : 'text-brand-ink'}`}
                  >
                    All Aisles
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCat(cat.id); setDrawerOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${selectedCat === cat.id ? 'bg-brand-green-soft text-brand-green font-bold' : 'text-brand-ink'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full py-3 rounded-full bg-brand-green text-white font-bold text-xs"
            >
              Apply Filters ({filteredProducts.length} Items)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
