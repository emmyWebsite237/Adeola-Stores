'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  ShoppingBag,
  Check,
  Zap,
  Truck,
  ShieldCheck,
  Tag,
  ArrowRight,
  Flame,
  HeartHandshake
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { formatNaira } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';

interface StudentPack {
  id: string;
  name: string;
  tagline: string;
  price: number;
  oldPrice: number;
  savings: number;
  badge: string;
  items: { name: string; size: string }[];
  accentColor: string;
}

const STUDENT_PACKS: StudentPack[] = [
  {
    id: 'student-campus-survival',
    name: 'Student & Youth Campus Survival Pack',
    tagline: 'The ultimate monthly dorm restock. Fast cooking, high yield, and 100% hunger-proof for exams and lectures.',
    price: 24500,
    oldPrice: 28900,
    savings: 4400,
    badge: 'Campus #1 Best Seller',
    accentColor: 'from-amber-500 to-emerald-600',
    items: [
      { name: 'Indomie Hungryman Noodles', size: 'Carton of 24' },
      { name: 'Checkers Custard Powder', size: '1kg Refill Pouch' },
      { name: 'Peak Full Cream Evaporated Milk', size: '6 Tins' },
      { name: 'Golden Penny Spaghetti', size: '3 Packs' },
      { name: 'Table Eggs (Farm Fresh)', size: 'Crate of 30' },
    ],
  },
  {
    id: 'student-quick-noodles-protein',
    name: 'Hostel Quick Noodles & Protein Booster',
    tagline: 'When lectures run late and you need dinner ready in 8 minutes flat with real protein.',
    price: 15200,
    oldPrice: 17800,
    savings: 2600,
    badge: 'Quick 8-Min Meals',
    accentColor: 'from-orange-500 to-amber-600',
    items: [
      { name: 'Indomie Super Pack Onion Chicken', size: 'Carton of 40' },
      { name: 'Titus Sardines in Pure Soybean Oil', size: '4 Cans' },
      { name: 'Gino Magic Pepper Relish', size: 'Pack of 5' },
    ],
  },
  {
    id: 'student-breakfast-fuel',
    name: 'Dorm Breakfast & Midnight Study Fuel',
    tagline: 'Power through 8:00 AM classes and late-night cramming without skipping breakfast.',
    price: 12500,
    oldPrice: 14500,
    savings: 2000,
    badge: 'Exam Study Fuel',
    accentColor: 'from-emerald-600 to-teal-700',
    items: [
      { name: 'Milo Chocolate Malt Energy Drink', size: '500g Tin' },
      { name: 'Peak Full Cream Milk Powder', size: '400g Refill' },
      { name: 'Golden Penny Pure White Oats', size: '800g Pouch' },
      { name: 'Cabin Crisp Crackers', size: 'Family Pack' },
    ],
  },
  {
    id: 'student-mini-pantry-starter',
    name: 'Single Hosteler Mini-Pantry Starter Kit',
    tagline: 'Real homemade Jollof and white rice & stew without spending a fortune at open markets.',
    price: 18900,
    oldPrice: 22000,
    savings: 3100,
    badge: 'Cook Like Home',
    accentColor: 'from-teal-600 to-emerald-800',
    items: [
      { name: 'Royal Stallion Parboiled Rice', size: '5kg Handy Bag' },
      { name: 'Kings Pure Vegetable Cooking Oil', size: '1.5 Litres' },
      { name: 'Gino Concentrated Tomato Paste', size: 'Pack of 10' },
      { name: 'Knorr Chicken Seasoning Cubes', size: 'Pack of 50' },
    ],
  },
];

export default function StudentPage() {
  const [addedPackId, setAddedPackId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddPack = (packId: string) => {
    // Add sample products matching pack
    PRODUCTS.slice(0, 4).forEach((p) => addItem(p, 1));
    setAddedPackId(packId);
    setTimeout(() => setAddedPackId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Vibrant Campus & Student Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-[#14532d] to-teal-900 text-white p-6 sm:p-12 shadow-2xl overflow-hidden border border-emerald-700/40">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-amber-950 text-xs font-black uppercase tracking-wider shadow-sm">
            <GraduationCap className="w-4 h-4 text-amber-950" />
            <span>Campus &amp; Student Survival Store</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Pocket-Friendly Student Groceries &amp; Dorm Packs 🎓⚡
          </h1>

          <p className="text-xs sm:text-base text-emerald-100/90 leading-relaxed">
            Stop overpaying at campus gates or trekking to crowded markets. Get bulk noodles, custard, milk, eggs, and dorm cooking staples delivered straight to your hostel or campus residence in Lagos!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-extrabold border border-white/15 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Fast Lagos Hostel Delivery
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-extrabold border border-white/15 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Save up to ₦4,400 per pack
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-extrabold border border-white/15 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" /> Split Bill with Roommates
            </span>
          </div>
        </div>

        {/* Decorative Background Icons */}
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <GraduationCap className="w-80 h-80 text-amber-300" />
        </div>
      </div>

      {/* Student Packs Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-line-2 pb-4">
          <div>
            <h2 className="text-2xl font-black text-brand-ink tracking-tight flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500" /> Curated Campus Survival Bundles
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Carefully assembled with high-calorie, long-lasting staples tested by Nigerian students.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-green bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 w-fit">
            Promo Code <strong>WELCOME10</strong> works on all packs!
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {STUDENT_PACKS.map((pack) => {
            const isAdded = addedPackId === pack.id;

            return (
              <div
                key={pack.id}
                className="bg-white rounded-3xl border border-emerald-100 shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:border-emerald-300"
              >
                <div className="p-6 sm:p-8 space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="px-3.5 py-1 rounded-full bg-amber-400 text-amber-950 text-[11px] font-black uppercase tracking-wider shadow-xs">
                      {pack.badge}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Save {formatNaira(pack.savings)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-brand-ink group-hover:text-brand-green transition-colors">
                      {pack.name}
                    </h3>
                    <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                      {pack.tagline}
                    </p>
                  </div>

                  {/* Included Items Container */}
                  <div className="bg-emerald-50/50 rounded-2xl p-4 sm:p-5 border border-emerald-100/80 space-y-2.5">
                    <span className="text-[11px] font-black uppercase text-emerald-900 tracking-wider block">
                      Inside this Dorm Pack ({pack.items.length} Items):
                    </span>
                    <div className="space-y-1.5">
                      {pack.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-slate-800">
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            {it.name}
                          </span>
                          <span className="font-extrabold text-brand-green text-[11px] bg-white px-2 py-0.5 rounded-md border border-emerald-100 shadow-2xs">
                            {it.size}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pricing & Add to Cart Footer */}
                <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                  <div>
                    <div className="text-2xl font-black text-brand-ink">
                      {formatNaira(pack.price)}
                    </div>
                    <div className="text-xs text-slate-400 line-through">
                      Market price: {formatNaira(pack.oldPrice)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddPack(pack.id)}
                    className={`w-full sm:w-auto px-6 py-3.5 rounded-full font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-amber-400 text-amber-950'
                        : 'bg-gradient-to-r from-emerald-800 via-brand-green to-teal-800 hover:brightness-110 text-white shadow-emerald-900/20'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Pack Added to Basket!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add Pack to Basket</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campus Hostels Delivery Banner */}
      <div className="rounded-3xl bg-white border border-emerald-200/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
            <Truck className="w-3.5 h-3.5 text-brand-green" />
            <span>Hostel &amp; Campus Coverage</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            Delivering to UNILAG, LASU, YabaTech, PAU &amp; Off-Campus Hostels
          </h3>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Order individually or team up with roommates to hit ₦20,000 and unlock <strong>Free Lagos Delivery</strong>. Just enter your hostel name, room or off-campus street at checkout!
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs whitespace-nowrap shadow-md transition-all"
        >
          <span>Shop All Groceries</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
