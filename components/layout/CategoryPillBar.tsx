'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/data/products';
import { Wheat, Coffee, Milk, Wine, Cookie, UtensilsCrossed, Baby, Sparkles } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  wheat: Wheat,
  cup: Coffee,
  droplet: Milk,
  beverage: Wine,
  cookie: Cookie,
  pot: UtensilsCrossed,
  baby: Baby,
};

export default function CategoryPillBar() {
  const searchParams = useSearchParams();
  const currentCat = searchParams.get('cat');

  return (
    <div className="bg-[#fafbf9] border-b border-brand-line-2 py-2.5 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 min-w-max">
        <Link
          href="/shop"
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            !currentCat
              ? 'bg-brand-green text-white shadow-sm'
              : 'bg-white text-brand-ink border border-brand-line hover:border-brand-green hover:text-brand-green'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Aisles</span>
        </Link>

        {CATEGORIES.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || Wheat;
          const isActive = currentCat === cat.id;

          return (
            <Link
              key={cat.id}
              href={`/shop?cat=${cat.id}`}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? 'bg-brand-green text-white shadow-sm'
                  : 'bg-white text-brand-ink border border-brand-line hover:border-brand-green hover:text-brand-green'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-brand-green'}`} />
              <span>{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
