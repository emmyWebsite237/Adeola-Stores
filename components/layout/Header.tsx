'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBasket, Heart, ShoppingBag, Menu, X, ChefHat, Tag } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import MobileSearchRow from './MobileSearchRow';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCount = useCartStore((s) => s.getTotalCount());
  const wishlistCount = useCartStore((s) => s.wishlist.length);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-line shadow-soft transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Row 1: Brand & Primary Controls */}
          <div className="flex items-center justify-between gap-4 h-16 sm:h-20">
            {/* Left: Mobile Menu Toggle & Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 -ml-2 text-brand-ink hover:text-brand-green rounded-xl hover:bg-brand-green-soft transition-colors"
                aria-label="Open mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-green text-white flex items-center justify-center shadow-md shadow-brand-green/20 group-hover:scale-105 transition-transform">
                  <ShoppingBasket className="w-5 h-5" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-brand-ink">
                    Ladydee
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-brand-muted uppercase">
                    Minimart Store
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/shop"
                className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  pathname === '/shop'
                    ? 'bg-brand-green-soft text-brand-green font-bold'
                    : 'text-brand-muted hover:text-brand-green hover:bg-brand-green-soft'
                }`}
              >
                All Groceries
              </Link>
              <Link
                href="/cook"
                className={`px-3.5 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  pathname === '/cook'
                    ? 'bg-brand-green-soft text-brand-green font-bold'
                    : 'text-brand-muted hover:text-brand-green hover:bg-brand-green-soft'
                }`}
              >
                <ChefHat className="w-4 h-4 text-brand-green" />
                <span>Cook Tonight</span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-brand-amber text-brand-ink">
                  New
                </span>
              </Link>
              <Link
                href="/bundles"
                className={`px-3.5 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  pathname === '/bundles'
                    ? 'bg-brand-green-soft text-brand-green font-bold'
                    : 'text-brand-muted hover:text-brand-green hover:bg-brand-green-soft'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-brand-coral" />
                <span>Household Bundles</span>
              </Link>
            </nav>

            {/* Right: Actions (Wishlist, Cart, User) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/account"
                className="p-2 sm:p-2.5 text-brand-muted hover:text-brand-green hover:bg-brand-green-soft rounded-full relative transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-amber text-brand-ink text-[10px] font-extrabold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="p-2 sm:p-2.5 text-brand-muted hover:text-brand-green hover:bg-brand-green-soft rounded-full relative transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-brand-green text-white text-[10px] font-extrabold flex items-center justify-center">
                    {totalCount > 99 ? '99+' : totalCount}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-full bg-brand-green-soft text-brand-green hover:bg-[#d8ebe0] transition-colors"
              >
                <div className="w-7 h-7 sm:w-7 sm:h-7 rounded-full bg-brand-green text-white text-xs font-bold flex items-center justify-center">
                  E
                </div>
                <span className="hidden sm:inline font-bold text-xs">Emmy</span>
              </Link>
            </div>
          </div>

          {/* Row 2: Full-width Search on Mobile (Dedicated row, never wraps!) */}
          <div className="pb-3 pt-0">
            <MobileSearchRow />
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white p-6 shadow-xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-brand-line">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-green text-white flex items-center justify-center font-bold">
                    <ShoppingBasket className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-base text-brand-ink">Ladydee Minimart</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-brand-muted hover:text-brand-ink rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-2">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-bold text-sm text-brand-ink hover:bg-brand-green-soft hover:text-brand-green transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-bold text-sm text-brand-ink hover:bg-brand-green-soft hover:text-brand-green transition-colors"
                >
                  Shop All Groceries
                </Link>
                <Link
                  href="/cook"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm text-brand-ink hover:bg-brand-green-soft hover:text-brand-green transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-brand-green" />
                    Cook Tonight (Recipes)
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-brand-amber text-brand-ink">
                    Hot
                  </span>
                </Link>
                <Link
                  href="/bundles"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm text-brand-ink hover:bg-brand-green-soft hover:text-brand-green transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-brand-coral" />
                    Household Bundles
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-brand-coral-soft text-brand-coral">
                    Save
                  </span>
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-bold text-sm text-brand-ink hover:bg-brand-green-soft hover:text-brand-green transition-colors"
                >
                  My Orders &amp; Tracking
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-semibold text-xs text-brand-muted hover:bg-brand-green-soft hover:text-brand-green transition-colors"
                >
                  Staff Portal
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-line text-xs text-brand-muted space-y-2">
              <p className="font-semibold text-brand-ink">Need Help with your order?</p>
              <p>Call or WhatsApp: 080 000 0000</p>
              <p>Ladydee Minimart Store, Lagos, Nigeria.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
