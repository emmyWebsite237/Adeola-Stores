'use client';

import { useState } from 'react';
import { Tag, Check, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { BUNDLE_PACKS } from '@/data/bundles';
import { PRODUCTS } from '@/data/products';
import { formatNaira } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';

export default function BundlesPage() {
  const [addedBundleId, setAddedBundleId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddBundle = (bundleId: string) => {
    // Add sample items matching bundle
    PRODUCTS.slice(0, 4).forEach((p) => addItem(p, 1));
    setAddedBundleId(bundleId);
    setTimeout(() => setAddedBundleId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-brand-ink via-[#1c2e22] to-brand-ink rounded-3xl p-6 sm:p-10 text-white shadow-card">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-coral text-white text-xs font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span>Market Bundles &amp; Household Packs</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Aunt Adeola Household Bundles
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Buying groceries piecemeal is expensive. Our curated market bundles pool your monthly and weekly staples together so you save thousands of Naira on every order.
          </p>
        </div>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {BUNDLE_PACKS.map((bundle) => {
          const isAdded = addedBundleId === bundle.id;

          return (
            <div
              key={bundle.id}
              className="bg-white rounded-3xl border border-brand-line shadow-card overflow-hidden flex flex-col justify-between hover:border-brand-green/30 transition-all"
            >
              <div>
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={bundle.image}
                    alt={bundle.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-coral text-white text-xs font-extrabold uppercase shadow-sm">
                    {bundle.badge}
                  </span>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-brand-green uppercase tracking-wider block mb-1">
                      {bundle.idealFor}
                    </span>
                    <h3 className="font-extrabold text-lg text-brand-ink leading-tight">
                      {bundle.name}
                    </h3>
                    <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                      {bundle.tagline}
                    </p>
                  </div>

                  {/* Included Items List */}
                  <div className="bg-brand-cream p-4 rounded-2xl border border-brand-line-2 space-y-2">
                    <span className="text-[11px] font-extrabold uppercase text-brand-ink block mb-2">
                      Included Pantry Staples ({bundle.items.length}):
                    </span>
                    {bundle.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-brand-ink">
                        <span>• {it.name}</span>
                        <span className="font-bold text-brand-green text-[11px]">{it.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="p-5 sm:p-6 pt-0 border-t border-brand-line-2 flex flex-col gap-3">
                <div className="flex items-baseline justify-between mt-3">
                  <div>
                    <span className="text-xl font-extrabold text-brand-ink block">
                      {formatNaira(bundle.price)}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      Original: {formatNaira(bundle.oldPrice)}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-brand-green bg-brand-green-soft px-2.5 py-1 rounded-full">
                    Save {formatNaira(bundle.savings)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddBundle(bundle.id)}
                  className={`w-full py-3 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                    isAdded
                      ? 'bg-brand-amber text-brand-ink'
                      : 'bg-brand-green hover:bg-brand-green-dark text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Pack Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add Entire Bundle to Basket</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
