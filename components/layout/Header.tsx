'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBasket,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChefHat,
  Tag,
  User as UserIcon,
  LogIn,
  ArrowRight,
  Trash2,
  ExternalLink,
  Phone
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { PRODUCTS } from '@/data/products';
import { formatNaira } from '@/lib/utils';
import { supabase, isSupabaseConfigured, getUserProfile, UserProfile } from '@/lib/db/supabase';
import { useSiteSettings } from '@/lib/useSiteSettings';
import MobileSearchRow from './MobileSearchRow';

export default function Header() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Cart store
  const { items, wishlist, removeItem, setQuantity, getTotal, getSubtotal } = useCartStore();
  const totalCount = useCartStore((s) => s.getTotalCount());
  const wishlistCount = wishlist.length;

  const wishedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  // Dynamic Supabase Auth State
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!supabase || !isSupabaseConfigured) return;

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null;
      setSessionUser(user);
      if (user) {
        getUserProfile(user.id).then((prof) => setUserProfile(prof));
      }
    });

    // Listen to real-time auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        setSessionUser(user);
        if (user) {
          const prof = await getUserProfile(user.id);
          setUserProfile(prof);
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const cleanPhone = (settings.phone || '').replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (settings.whatsapp || settings.phone || '').replace(/[^0-9]/g, '');

  const isGoogleUser = sessionUser?.app_metadata?.provider === 'google' || Boolean(sessionUser?.user_metadata?.avatar_url);
  const googleAvatar =
    userProfile?.google_avatar_url ||
    sessionUser?.user_metadata?.avatar_url ||
    sessionUser?.user_metadata?.picture ||
    sessionUser?.identities?.find((i: any) => i.provider === 'google')?.identity_data?.avatar_url ||
    sessionUser?.identities?.find((i: any) => i.provider === 'google')?.identity_data?.picture;
  const avatarToDisplay = userProfile?.avatar_url || googleAvatar;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-line shadow-soft transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Row 1: Brand & Primary Controls */}
          <div className="flex items-center justify-between gap-4 h-16 sm:h-20">
            {/* Left: Mobile Menu Toggle & Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-brand-muted hover:text-brand-ink rounded-lg focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-brand-green flex items-center justify-center text-white shadow-md shadow-brand-green/20 group-hover:scale-105 transition-transform">
                  <ShoppingBasket className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-brand-ink block leading-none">
                    Ladydee Minimart
                  </span>
                  <span className="text-[10px] text-brand-muted font-bold tracking-wide block uppercase">
                    Lagos, Nigeria
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link
                href="/shop"
                className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  pathname === '/shop'
                    ? 'bg-brand-green-soft text-brand-green font-bold'
                    : 'text-brand-muted hover:text-brand-green hover:bg-brand-green-soft'
                }`}
              >
                Shop All
              </Link>
              <Link
                href="/cook"
                className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname === '/cook'
                    ? 'bg-brand-green-soft text-brand-green font-bold'
                    : 'text-brand-muted hover:text-brand-green hover:bg-brand-green-soft'
                }`}
              >
                <ChefHat className="w-4 h-4 text-brand-green" />
                <span>Cook Tonight</span>
                <span className="px-1.5 py-0.2 rounded-full bg-brand-amber text-brand-ink text-[9px] font-extrabold">
                  Hot
                </span>
              </Link>
              <Link
                href="/bundles"
                className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname === '/bundles'
                    ? 'bg-brand-green-soft text-brand-green font-bold'
                    : 'text-brand-muted hover:text-brand-green hover:bg-brand-green-soft'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-brand-coral" />
                <span>Household Bundles</span>
              </Link>
              <Link
                href="/contact"
                className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  pathname === '/contact'
                    ? 'bg-brand-green-soft text-brand-green font-bold'
                    : 'text-brand-muted hover:text-brand-green hover:bg-brand-green-soft'
                }`}
              >
                Suggestions
              </Link>
            </nav>

            {/* Right: Actions (Wishlist, Cart, User) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Wishlist Button with Desktop Hover Card Preview */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setWishlistDrawerOpen(true)}
                  className="p-2 sm:p-2.5 text-brand-muted hover:text-brand-green hover:bg-brand-green-soft rounded-full relative transition-colors cursor-pointer"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-amber text-brand-ink text-[10px] font-extrabold flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Hover Card for Wishlist (Desktop) */}
                <div className="hidden lg:group-hover:block absolute right-0 top-full pt-2 w-72 z-50 animate-fadeIn">
                  <div className="bg-white rounded-2xl shadow-xl border border-brand-line p-4 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-brand-line-2">
                      <span className="font-extrabold text-brand-ink">
                        My Wishlist ({wishedProducts.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setWishlistDrawerOpen(true)}
                        className="text-[10px] text-brand-green font-bold hover:underline"
                      >
                        Open Panel &rarr;
                      </button>
                    </div>

                    {wishedProducts.length === 0 ? (
                      <p className="py-4 text-center text-brand-muted text-[11px]">
                        Your wishlist is empty.
                      </p>
                    ) : (
                      <div className="space-y-2 py-2 max-h-48 overflow-y-auto">
                        {wishedProducts.slice(0, 3).map((prod) => (
                          <div key={prod.id} className="flex items-center gap-2.5">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                            />
                            <div className="truncate flex-1">
                              <span className="font-bold text-slate-800 block truncate">{prod.name}</span>
                              <span className="text-[10px] text-brand-green font-extrabold">
                                {formatNaira(prod.price)}
                              </span>
                            </div>
                          </div>
                        ))}
                        {wishedProducts.length > 3 && (
                          <p className="text-[10px] text-center text-slate-400 pt-1 font-semibold">
                            +{wishedProducts.length - 3} more saved items
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cart Button with Desktop Hover Card Preview (Hidden on mobile since mobile has bottom nav cart) */}
              <div className="relative group hidden md:block">
                <button
                  type="button"
                  onClick={() => setCartDrawerOpen(true)}
                  className="p-2 sm:p-2.5 text-brand-muted hover:text-brand-green hover:bg-brand-green-soft rounded-full relative transition-colors cursor-pointer"
                  aria-label="Shopping Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {mounted && totalCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-brand-green text-white text-[10px] font-extrabold flex items-center justify-center">
                      {totalCount > 99 ? '99+' : totalCount}
                    </span>
                  )}
                </button>

                {/* Hover Card for Cart (Desktop) */}
                <div className="hidden lg:group-hover:block absolute right-0 top-full pt-2 w-80 z-50 animate-fadeIn">
                  <div className="bg-white rounded-2xl shadow-xl border border-brand-line p-4 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-brand-line-2">
                      <span className="font-extrabold text-brand-ink">
                        Shopping Basket ({totalCount})
                      </span>
                      <button
                        type="button"
                        onClick={() => setCartDrawerOpen(true)}
                        className="text-[10px] text-brand-green font-bold hover:underline"
                      >
                        Slide Out &rarr;
                      </button>
                    </div>

                    {items.length === 0 ? (
                      <p className="py-4 text-center text-brand-muted text-[11px]">
                        Your basket is empty.
                      </p>
                    ) : (
                      <div className="space-y-2 py-2 max-h-48 overflow-y-auto">
                        {items.slice(0, 3).map((it) => (
                          <div key={it.product.id} className="flex items-center gap-2.5">
                            <img
                              src={it.product.image}
                              alt={it.product.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                            />
                            <div className="truncate flex-1">
                              <span className="font-bold text-slate-800 block truncate">{it.product.name}</span>
                              <span className="text-[10px] text-slate-500">
                                {it.quantity} &times; {formatNaira(it.product.price)}
                              </span>
                            </div>
                            <span className="font-bold text-brand-ink text-xs">
                              {formatNaira(it.product.price * it.quantity)}
                            </span>
                          </div>
                        ))}
                        {items.length > 3 && (
                          <p className="text-[10px] text-center text-slate-400 pt-1 font-semibold">
                            +{items.length - 3} more grocery items in basket
                          </p>
                        )}

                        <div className="pt-2 border-t border-brand-line-2 flex justify-between items-center">
                          <span className="text-slate-500 font-bold">Subtotal:</span>
                          <span className="font-extrabold text-brand-green text-sm">
                            {formatNaira(getSubtotal())}
                          </span>
                        </div>

                        <Link
                          href="/checkout"
                          className="block text-center w-full py-2 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs transition-colors mt-2"
                        >
                          Checkout Now &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* User Account / Sign In Indicator */}
              {mounted && sessionUser ? (
                <Link
                  href="/account"
                  className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-full bg-brand-green-soft text-brand-green hover:bg-[#d8ebe0] transition-colors"
                  aria-label="Account Settings"
                >
                  {avatarToDisplay ? (
                    <img
                      src={avatarToDisplay}
                      alt="Avatar"
                      className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full object-cover shrink-0 aspect-square border border-brand-green overflow-hidden"
                    />
                  ) : (
                    <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-brand-green text-white text-xs font-bold flex items-center justify-center shrink-0 aspect-square">
                      {(userProfile?.username || userProfile?.full_name || sessionUser.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline font-bold text-xs max-w-[90px] truncate">
                    {userProfile?.username ? `@${userProfile.username}` : (userProfile?.full_name ? userProfile.full_name.split(' ')[0] : 'Account')}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 p-1.5 sm:px-3.5 sm:py-2 rounded-full border border-brand-line text-brand-ink hover:border-brand-green hover:text-brand-green hover:bg-brand-green-soft/40 transition-all text-xs font-bold"
                  aria-label="Sign In"
                >
                  <LogIn className="w-4 h-4 text-brand-green" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>
          </div>

          {/* Row 2: Full-width Search on Mobile */}
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
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-bold text-sm text-brand-ink hover:bg-brand-green-soft hover:text-brand-green transition-colors"
                >
                  Suggestions &amp; Contact Desk
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-bold text-sm text-brand-ink hover:bg-brand-green-soft hover:text-brand-green transition-colors"
                >
                  {sessionUser ? 'My Orders & Wallet' : 'Sign In / Register'}
                </Link>
              </div>
            </div>

            {/* Live Connected Store Details from Supabase site_settings */}
            <div className="pt-6 border-t border-brand-line text-xs text-brand-muted space-y-2">
              <p className="font-extrabold text-brand-ink">Need Help with your order?</p>
              <p className="flex items-center gap-1.5 font-bold text-emerald-800">
                <Phone className="w-3.5 h-3.5 text-brand-green" />
                <a href={`tel:${cleanPhone || '+2348000000000'}`} className="hover:underline">
                  Call or WhatsApp: {settings.phone || '080 000 0000'}
                </a>
              </p>
              <p className="text-[11px] text-slate-500">
                {settings.address || 'Ladydee Minimart Store, Lagos, Nigeria.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Cart Drawer */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setCartDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft">
            <div className="p-6 border-b border-brand-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-green" />
                <h3 className="text-base font-extrabold text-brand-ink">
                  Shopping Basket ({totalCount})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCartDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Basket Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-brand-green flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-800">Your basket is empty</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Add fresh yams, rice, oils, or recipe ingredients from our store.
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setCartDrawerOpen(false)}
                    className="inline-block px-5 py-2 rounded-full bg-brand-green text-white text-xs font-bold mt-2"
                  >
                    Start Shopping &rarr;
                  </Link>
                </div>
              ) : (
                items.map((it) => (
                  <div
                    key={it.product.id}
                    className="flex items-center justify-between p-3 rounded-2xl border border-brand-line bg-slate-50/60"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <img
                        src={it.product.image}
                        alt={it.product.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-bold text-xs text-slate-900 block truncate">
                          {it.product.name}
                        </span>
                        <span className="text-[11px] text-brand-green font-bold block">
                          {formatNaira(it.product.price)}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => setQuantity(it.product.id, Math.max(1, it.quantity - 1))}
                            className="w-5 h-5 rounded bg-white border border-slate-300 font-bold text-xs"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold text-slate-800">{it.quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(it.product.id, it.quantity + 1)}
                            className="w-5 h-5 rounded bg-white border border-slate-300 font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(it.product.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            {items.length > 0 && (
              <div className="p-6 border-t border-brand-line bg-white space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">Subtotal:</span>
                  <span className="font-extrabold text-base text-brand-green">
                    {formatNaira(getSubtotal())}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/cart"
                    onClick={() => setCartDrawerOpen(false)}
                    className="py-3 rounded-2xl border-2 border-brand-green text-brand-green text-center text-xs font-extrabold hover:bg-emerald-50 transition-colors"
                  >
                    View Cart
                  </Link>

                  <Link
                    href="/checkout"
                    onClick={() => setCartDrawerOpen(false)}
                    className="py-3 rounded-2xl bg-brand-green hover:bg-brand-green-dark text-white text-center text-xs font-extrabold transition-colors shadow-md"
                  >
                    Checkout &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-out Wishlist Drawer */}
      {wishlistDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setWishlistDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft">
            <div className="p-6 border-b border-brand-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-extrabold text-brand-ink">
                  My Wishlist ({wishedProducts.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setWishlistDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {wishedProducts.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-800">Your wishlist is empty</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Tap the heart icon on any grocery item to keep track of items you love.
                  </p>
                </div>
              ) : (
                wishedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between p-3 rounded-2xl border border-brand-line bg-slate-50/60"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-bold text-xs text-slate-900 block truncate">
                          {prod.name}
                        </span>
                        <span className="text-[11px] text-brand-green font-bold block">
                          {formatNaira(prod.price)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/product/${prod.id}`}
                      onClick={() => setWishlistDrawerOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-brand-green text-white text-[11px] font-bold hover:bg-brand-green-dark"
                    >
                      View
                    </Link>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-brand-line bg-white">
              <Link
                href="/account"
                onClick={() => setWishlistDrawerOpen(false)}
                className="block text-center w-full py-3 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-extrabold"
              >
                Manage Saved Items in Account &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}