'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Package, MapPin, Heart, Settings, CheckCircle2, Clock, Truck, ChevronDown, RefreshCw } from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import { useCartStore } from '@/lib/store/useCartStore';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'profile'>('orders');
  const [expandedOrder, setExpandedOrder] = useState<string | null>('LDM-82A9C1');
  const wishlist = useCartStore((s) => s.wishlist);
  const wishedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  // Sample order history
  const sampleOrders = [
    {
      id: 'LDM-82A9C1',
      date: '24 Oct 2026',
      total: 34500,
      status: 'dispatched', // placed | confirmed | dispatched | delivered
      items: [
        { name: 'Royal Stallion Rice', size: '10kg Bag', qty: 1, price: 21500 },
        { name: 'Pure Vegetable Oil', size: '2L Canister', qty: 1, price: 8000 },
        { name: 'Indomie Onion Chicken', size: '10 Packs', qty: 1, price: 5000 },
      ],
      address: '12 Admiralty Way, Lekki Phase 1, Lagos',
      eta: 'Out for delivery today with Rider Ibrahim',
    },
    {
      id: 'LDM-4018FD',
      date: '12 Oct 2026',
      total: 18200,
      status: 'delivered',
      items: [
        { name: 'Checkers Custard Powder', size: '1kg Cup', qty: 2, price: 7500 },
        { name: 'Peak Milk Refill Pouch', size: '850g Pouch', qty: 1, price: 10700 },
      ],
      address: '12 Admiralty Way, Lekki Phase 1, Lagos',
      eta: 'Delivered successfully',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl border border-brand-line p-6 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-green text-white text-xl font-extrabold flex items-center justify-center shadow-md">
            E
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-brand-ink">Emmy Ade</h1>
            <p className="text-xs text-brand-muted">emmy@example.com · +234 801 234 5678</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-brand-green-soft text-brand-green text-xs font-bold">
            Verified Customer
          </span>
        </div>
      </div>

      {/* Responsive Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 border-b border-brand-line-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
            activeTab === 'orders'
              ? 'bg-brand-green text-white shadow-sm'
              : 'bg-white text-brand-muted hover:text-brand-ink border border-brand-line'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({sampleOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
            activeTab === 'wishlist'
              ? 'bg-brand-green text-white shadow-sm'
              : 'bg-white text-brand-muted hover:text-brand-ink border border-brand-line'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
            activeTab === 'addresses'
              ? 'bg-brand-green text-white shadow-sm'
              : 'bg-white text-brand-muted hover:text-brand-ink border border-brand-line'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses</span>
        </button>
      </div>

      {/* Tab 1: Orders with Status Tracker */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {sampleOrders.map((ord) => {
            const isOpen = expandedOrder === ord.id;
            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-brand-line shadow-soft overflow-hidden transition-all"
              >
                {/* Collapsed Bar */}
                <button
                  type="button"
                  onClick={() => setExpandedOrder(isOpen ? null : ord.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-brand-green-soft text-brand-green flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-brand-ink">{ord.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-green-soft text-brand-green">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-muted mt-0.5">{ord.date} · {ord.items.length} Items</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm sm:text-base text-brand-ink">
                      {formatNaira(ord.total)}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Expanded Details */}
                {isOpen && (
                  <div className="p-5 sm:p-6 pt-0 border-t border-brand-line-2 space-y-6">
                    {/* Visual Status Ladder */}
                    <div className="pt-4">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-ink block mb-3">
                        Live Delivery Progress:
                      </span>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="space-y-1">
                          <div className="w-7 h-7 mx-auto rounded-full bg-brand-green text-white flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-[11px] block text-brand-green">Order Placed</span>
                        </div>

                        <div className="space-y-1">
                          <div className="w-7 h-7 mx-auto rounded-full bg-brand-green text-white flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-[11px] block text-brand-green">Confirmed</span>
                        </div>

                        <div className="space-y-1">
                          <div className="w-7 h-7 mx-auto rounded-full bg-brand-amber text-brand-ink flex items-center justify-center animate-pulse">
                            <Truck className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-[11px] block text-brand-amber-dark">Dispatched</span>
                        </div>

                        <div className="space-y-1">
                          <div className="w-7 h-7 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-[11px] block text-gray-400">Delivered</span>
                        </div>
                      </div>
                      <p className="text-xs text-brand-muted text-center mt-3 bg-brand-cream py-2 rounded-xl border border-brand-line-2">
                        {ord.eta}
                      </p>
                    </div>

                    {/* Ordered Items */}
                    <div className="space-y-2 pt-2 border-t border-brand-line-2">
                      <span className="text-[11px] font-bold uppercase text-brand-ink block">Items in this order:</span>
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs py-1 text-gray-700">
                          <span>• {it.name} ({it.size}) × {it.qty}</span>
                          <span className="font-bold text-brand-ink">{formatNaira(it.price * it.qty)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 text-xs text-brand-muted border-t border-brand-line-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <span><strong>Delivery Address:</strong> {ord.address}</span>
                      <Link href="/shop" className="text-brand-green font-bold hover:underline flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reorder Items</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {wishedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-brand-line p-12 text-center space-y-3">
              <Heart className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="font-bold text-base text-brand-ink">No saved items in your wishlist yet</p>
              <p className="text-xs text-brand-muted">Tap the heart icon on any food item to save it here for later.</p>
              <Link href="/shop" className="inline-block px-6 py-2.5 rounded-full bg-brand-green text-white font-bold text-xs">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-brand-green bg-brand-green-soft/30 shadow-soft space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-brand-green uppercase tracking-wide">Default Home Address</span>
              <span className="w-2 h-2 rounded-full bg-brand-green" />
            </div>
            <p className="font-bold text-sm text-brand-ink">Emmy Ade</p>
            <p className="text-xs text-brand-muted">12 Admiralty Way, Lekki Phase 1, Lagos</p>
            <p className="text-xs text-brand-muted">+234 801 234 5678</p>
          </div>
        </div>
      )}
    </div>
  );
}
