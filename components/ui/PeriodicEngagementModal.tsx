'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  Mail,
  Sparkles,
  ShoppingBag,
  ChefHat,
  Tag,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';

// 10 minutes in milliseconds (600,000 ms)
const ENGAGEMENT_INTERVAL_MS = 10 * 60 * 1000;

export default function PeriodicEngagementModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  // Card 1: Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  // Card 3: Promo code state
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Do not show on admin routes or checkout
    if (
      pathname?.startsWith('/admin') ||
      pathname?.startsWith('/admin-portal') ||
      pathname?.startsWith('/adeadmin112') ||
      pathname?.startsWith('/checkout')
    ) {
      return;
    }

    // Retrieve previous card index from session storage to alternate
    const lastIndexStr = sessionStorage.getItem('ladydee_engagement_card_idx');
    let nextIndex = 0;
    if (lastIndexStr !== null) {
      nextIndex = (parseInt(lastIndexStr, 10) + 1) % 4;
    }

    const timer = setTimeout(() => {
      // Don't show if user is currently checking out
      if (window.location.pathname.startsWith('/checkout') || window.location.pathname.startsWith('/admin')) {
        return;
      }
      setCardIndex(nextIndex);
      setIsOpen(true);
      sessionStorage.setItem('ladydee_engagement_card_idx', nextIndex.toString());
    }, ENGAGEMENT_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [pathname, isOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
    setNewsletterSuccess(false);
    setNewsletterError('');
    setCopiedCode(false);
  };

  const handleSubscribeNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError('');

    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }

    setNewsletterLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setNewsletterError(data.error || 'Could not subscribe right now.');
      } else {
        setNewsletterSuccess(true);
        setTimeout(() => {
          handleDismiss();
        }, 2500);
      }
    } catch (err: any) {
      setNewsletterError(err.message || 'Subscription failed. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('ADEOLA1000');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-line overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-brand-muted hover:text-brand-ink rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── CARD 0: NEWSLETTER & PRICE DROPS ── */}
        {cardIndex === 0 && (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-green-soft text-brand-green mx-auto flex items-center justify-center shadow-sm">
              <Mail className="w-7 h-7 text-brand-green" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-green-soft text-brand-green text-[11px] font-extrabold uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Market Price Updates</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-brand-ink">
                Lagos Grocery Deals &amp; Discounts
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed max-w-sm mx-auto">
                Subscribe to receive weekly price drops on rice, cooking oils, and fresh carton arrivals directly to your inbox.
              </p>
            </div>

            {newsletterSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-brand-green" />
                <span>You are subscribed! Watch your inbox for grocery discounts.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribeNewsletter} className="space-y-3 pt-2">
                {newsletterError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{newsletterError}</span>
                  </div>
                )}
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all disabled:opacity-60"
                >
                  {newsletterLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Get Free Weekly Deals</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── CARD 1: COOK TONIGHT COMBO ── */}
        {cardIndex === 1 && (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-amber/20 text-brand-ink mx-auto flex items-center justify-center shadow-sm">
              <ChefHat className="w-7 h-7 text-brand-ink" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-amber text-brand-ink text-[11px] font-extrabold uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Chef&apos;s Recommendation</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-brand-ink">
                Sunday Party Jollof Combo
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed max-w-sm mx-auto">
                Get Gino Party Jollof Paste, Kings Pure Vegetable Oil, and Knorr Seasoning Cubes packed together in one click!
              </p>
            </div>

            <div className="p-3 bg-brand-cream rounded-2xl border border-brand-line-2 text-left text-xs space-y-1 text-brand-ink">
              <div className="font-extrabold text-[11px] uppercase tracking-wider text-brand-green">
                Ingredients in Bundle:
              </div>
              <p>• Gino Tomato Party Jollof Paste (400g)</p>
              <p>• Kings Pure Vegetable Oil (1L Bottle)</p>
              <p>• Knorr Chicken Seasoning Cubes (50 Cubes)</p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/cook"
                onClick={handleDismiss}
                className="w-full py-3 px-6 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Cook Tonight Combos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ── CARD 2: FLASH VOUCHER CODE ── */}
        {cardIndex === 2 && (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center shadow-sm">
              <Tag className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-extrabold uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Active Shopper Bonus</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-brand-ink">
                Save ₦1,000 on Today&apos;s Order
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed max-w-sm mx-auto">
                Thanks for shopping with us! Use the voucher code below on checkout for orders over ₦15,000.
              </p>
            </div>

            {/* Voucher Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-purple-300 flex items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Promo Code</span>
                <span className="text-lg font-black tracking-widest text-purple-700">ADEOLA1000</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs shadow-md shadow-brand-green/20 transition-all"
            >
              Continue Shopping Groceries
            </button>
          </div>
        )}

        {/* ── CARD 3: PRODUCT SUGGESTION DESK ── */}
        {cardIndex === 3 && (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center shadow-sm">
              <MessageSquare className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-extrabold uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Customer Stocking Desk</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-brand-ink">
                Can&apos;t Find Your Grocery Brand?
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed max-w-sm mx-auto">
                Our grocery procurement staff visits major Lagos wholesale hubs daily. Tell us what item or pack you need and we will stock it!
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/contact?topic=product-suggestion"
                onClick={handleDismiss}
                className="w-full py-3 px-6 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all"
              >
                <span>Suggest a Grocery Item</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Footer Dismiss / Cancel */}
        <div className="text-center pt-3 border-t border-slate-100 mt-4">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-[11px] text-gray-400 hover:text-brand-ink transition-colors font-medium"
          >
            Cancel, keep browsing
          </button>
        </div>
      </div>
    </div>
  );
}
