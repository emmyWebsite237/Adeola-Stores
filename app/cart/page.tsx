'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ShieldCheck, Tag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { DELIVERY_ZONES } from '@/data/products';
import { formatNaira } from '@/lib/utils';
import FreeDeliveryMeter from '@/components/cart/FreeDeliveryMeter';
import CartItemRow from '@/components/cart/CartItemRow';

export default function CartPage() {
  const {
    items,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    zoneId,
    setZoneId,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getTotal,
    getTotalCount,
  } = useCartStore();

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();
  const count = getTotalCount();
  const vat = Math.round((subtotal - discount) * 0.075);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoCode.trim()) return;
    const ok = applyCoupon(promoCode);
    if (!ok) {
      setPromoError('Invalid coupon code or minimum subtotal not met.');
    } else {
      setPromoCode('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-brand-green-soft text-brand-green flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-brand-ink">Your basket is currently empty</h1>
        <p className="text-xs sm:text-sm text-brand-muted max-w-sm mx-auto">
          You haven't added any groceries to your basket yet. Check out popular staples or authentic recipes to get started!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-green hover:bg-brand-green-dark text-white font-bold text-xs"
          >
            Start Shopping
          </Link>
          <Link
            href="/cook"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-brand-line hover:bg-brand-cream text-brand-ink font-bold text-xs"
          >
            Browse Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-brand-line-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink">Review Your Basket</h1>
          <p className="text-xs text-brand-muted mt-0.5">{count} item{count === 1 ? '' : 's'} ready for delivery</p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold text-gray-400 hover:text-brand-coral flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Basket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items List & Milestone Meter */}
        <div className="lg:col-span-7 space-y-6">
          <FreeDeliveryMeter />

          <div className="bg-white rounded-3xl border border-brand-line p-5 sm:p-6 shadow-soft divide-y divide-brand-line-2">
            {items.map((it) => (
              <CartItemRow key={it.id} item={it} />
            ))}
          </div>

          {/* Delivery Zone Selector */}
          <div className="bg-white rounded-3xl border border-brand-line p-5 sm:p-6 shadow-soft space-y-3">
            <h3 className="text-xs font-extrabold text-brand-ink uppercase tracking-wider">
              Choose Your Delivery Destination
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DELIVERY_ZONES.map((zone) => {
                const isSelected = zoneId === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setZoneId(zone.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-brand-green bg-brand-green-soft text-brand-green-dark shadow-sm'
                        : 'border-brand-line bg-white hover:border-gray-300 text-brand-ink'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{zone.name}</span>
                      <span className="text-xs font-extrabold">
                        {zone.fee === 0 ? 'FREE' : formatNaira(zone.fee)}
                      </span>
                    </div>
                    <span className="text-[10px] text-brand-muted block mt-0.5">{zone.eta}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Summary Card & Pay Button */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-28">
          <div className="bg-white rounded-3xl border border-brand-line p-6 shadow-soft space-y-5">
            <h3 className="text-sm font-extrabold text-brand-ink uppercase tracking-wider">
              Order Summary
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal ({count} items)</span>
                <span className="font-bold text-brand-ink">{formatNaira(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-brand-green font-bold">
                  <span>Promo Discount ({coupon?.code})</span>
                  <span>−{formatNaira(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-brand-muted">
                <span>Delivery Fee</span>
                <span className="font-bold text-brand-ink">
                  {deliveryFee === 0 ? <strong className="text-brand-green font-bold">FREE</strong> : formatNaira(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between text-brand-muted">
                <span>VAT (7.5%)</span>
                <span className="font-bold text-brand-ink">{formatNaira(vat)}</span>
              </div>

              <div className="pt-3 border-t border-brand-line-2 flex justify-between items-baseline text-base font-extrabold text-brand-ink">
                <span>Total Amount</span>
                <span className="text-xl text-brand-green">{formatNaira(total)}</span>
              </div>
            </div>

            {/* Promo Code Box */}
            <div className="pt-3 border-t border-brand-line-2">
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-green-soft text-brand-green text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon '{coupon.code}' Applied!</span>
                  </div>
                  <button type="button" onClick={removeCoupon} className="text-brand-coral hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Try WELCOME10 or ADEOLA5"
                    className="flex-1 px-3 py-2 bg-[#f4f6f4] rounded-xl text-xs uppercase font-bold text-brand-ink outline-none focus:bg-white border border-brand-line"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-ink text-white font-bold text-xs hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && <p className="text-[11px] text-brand-coral mt-1.5">{promoError}</p>}
            </div>

            {/* Checkout Action */}
            <Link
              href="/checkout"
              className="w-full py-3.5 rounded-full bg-brand-green hover:bg-brand-green-dark text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all text-center"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
              <span>Paystack 256-bit encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
