'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, CreditCard, Banknote, CheckCircle2, User, AlertCircle, ArrowRight, Loader2, Wallet, KeyRound, X } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { DELIVERY_ZONES } from '@/data/products';
import { formatNaira } from '@/lib/utils';
import { openPaystackModal } from '@/lib/paystack';
import { supabase, isSupabaseConfigured, getUserProfile, upsertUserProfile } from '@/lib/db/supabase';
import AuthModal from '@/components/ui/AuthModal';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    zoneId,
    setZoneId,
    clearCart,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getTotal,
    getTotalCount,
  } = useCartStore();

  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lagos');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'wallet' | 'delivery'>('paystack');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [hasWalletPin, setHasWalletPin] = useState<boolean>(false);
  const [walletPinModalOpen, setWalletPinModalOpen] = useState(false);
  const [walletPinInput, setWalletPinInput] = useState('');
  const [walletPinBusy, setWalletPinBusy] = useState(false);
  const [walletPinError, setWalletPinError] = useState('');

  const [termsAccepted, setTermsAccepted] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const openCheckoutAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const loadUserProfileData = async (userId: string) => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        if (data.full_name) setName(data.full_name);
        if (data.phone) setPhone(data.phone);
        if (data.default_address) setAddress(data.default_address);
        if (data.wallet_balance !== undefined && data.wallet_balance !== null) {
          setWalletBalance(Number(data.wallet_balance));
        }
        setHasWalletPin(Boolean(data.wallet_pin));
        if (data.default_zone) {
          const matched = DELIVERY_ZONES.find(
            (z) => z.name.toLowerCase() === data.default_zone?.toLowerCase()
          );
          if (matched) setZoneId(matched.id);
        }
      }
    } catch (e) {
      console.warn('[Checkout]: Could not load profile details', e);
    }
  };

  const handleAuthSuccess = async (authUser: any) => {
    setUser(authUser);
    setEmail(authUser.email || '');
    if (authUser.id) {
      await loadUserProfileData(authUser.id);
    }
  };

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();
  const count = getTotalCount();
  const vat = Math.round((subtotal - discount) * 0.075);

  const selectedZone = DELIVERY_ZONES.find((z) => z.id === zoneId) || DELIVERY_ZONES[0];

  // ─── Fetch Auth & Profile Metadata from Supabase ─────────────────────────
  useEffect(() => {
    async function loadUserSession() {
      if (!supabase) {
        setAuthLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          setEmail(user.email || '');
          await loadUserProfileData(user.id);
        }
      } catch (err) {
        console.warn('Checkout auth initialization notice:', err);
      } finally {
        setAuthLoading(false);
      }
    }

    loadUserSession();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) {
          setEmail(currentUser.email || '');
          await loadUserProfileData(currentUser.id);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [setZoneId]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      setErrorMessage('You cannot pay until you sign up or sign in. Please log in below.');
      openCheckoutAuth('signin');
      return;
    }

    if (!name || !email || !phone || !address) {
      setErrorMessage('Please fill in all delivery details.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('You must accept the terms & conditions before completing payment.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your basket is empty.');
      return;
    }

    setBusy(true);

    // Save details to Supabase User Profile so it is remembered for future orders
    if (user && supabase) {
      try {
        await upsertUserProfile({
          id: user.id,
          full_name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          default_address: address.trim(),
          default_zone: selectedZone.name,
        });
      } catch (profileSaveErr) {
        console.warn('[Checkout]: Could not save profile for later:', profileSaveErr);
      }
    }

    const orderRef = 'LDM-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    // ─── If Ladydee Wallet Payment ──────────────────────────────────────────
    if (paymentMethod === 'wallet') {
      if (walletBalance < total) {
        setBusy(false);
        setErrorMessage(
          `Insufficient wallet balance (₦${walletBalance.toLocaleString()}). Your order total is ₦${total.toLocaleString()}. Please fund your wallet or select Paystack.`
        );
        return;
      }
      setBusy(false);
      setWalletPinError('');
      setWalletPinInput('');
      setWalletPinModalOpen(true);
      return;
    }

    // ─── If Online Payment (Paystack) ───────────────────────────────────────
    if (paymentMethod === 'paystack') {
      openPaystackModal({
        email,
        amount: total,
        reference: orderRef,
        metadata: {
          customerName: name,
          phone,
          zone: selectedZone.name,
          address,
        },
        onSuccess: async (resp) => {
          setBusy(false);
          const orderPayload = {
            reference: resp.reference || orderRef,
            user_id: user.id,
            name,
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' '),
            email,
            phone,
            address,
            city,
            zone: selectedZone.name,
            items: items.map((i) => ({
              id: i.product.id,
              name: i.product.name,
              qty: i.quantity,
              price: i.product.price,
            })),
            total,
            subtotal,
            deliveryFee,
            discount,
            vat,
            date: new Date().toISOString(),
            method: 'Paystack Online (Paid)',
            paymentMethod: 'paystack',
            payment_status: 'paid',
            fulfillment_status: 'confirmed',
          };

          // Store for confirmation receipt and local admin fallback
          sessionStorage.setItem('latest_order', JSON.stringify(orderPayload));
          try {
            const existing = JSON.parse(localStorage.getItem('adeola_local_orders') || '[]');
            localStorage.setItem('adeola_local_orders', JSON.stringify([orderPayload, ...existing]));
          } catch (e) {}

          // Post to backend API to log in Supabase
          try {
            await fetch('/api/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reference: resp.reference || orderRef,
                orderData: orderPayload,
              }),
            });
          } catch (e) {
            console.warn('API order logging notice:', e);
          }

          // Trigger email alert to admin store owner
          try {
            await fetch('/api/orders/notify-admin', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reference: resp.reference || orderRef,
                customer_name: name,
                customer_email: email,
                customer_phone: phone,
                delivery_address: address,
                delivery_zone: selectedZone.name,
                items: orderPayload.items,
                subtotal,
                delivery_fee: deliveryFee,
                total,
                payment_method: 'Paystack Online (Paid)',
              }),
            });
          } catch (notifyErr) {
            console.warn('[Admin Notify Notice]:', notifyErr);
          }

          clearCart();
          router.push('/checkout/confirmation');
        },
        onClose: () => {
          setBusy(false);
        },
      });
    } else {
      // Pay on Delivery blocked
      setBusy(false);
      setErrorMessage('Pay on delivery is temporarily unavailable. Please pay online via Paystack or via your Ladydee Wallet.');
    }
  };

  const handleConfirmWalletPayment = async () => {
    if (!walletPinInput || walletPinInput.length !== 4) {
      setWalletPinError('Please enter your 4-digit security PIN.');
      return;
    }

    setWalletPinBusy(true);
    setWalletPinError('');

    const orderRef = 'LDM-WAL-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    try {
      const res = await fetch('/api/wallet/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          pin: walletPinInput.trim(),
          amount: total,
          orderReference: orderRef,
          description: `Order payment for ${items.length} grocery items`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setWalletPinError(data.error || 'Wallet payment failed. Please check your PIN.');
        setWalletPinBusy(false);
        return;
      }

      setWalletPinBusy(false);
      setWalletPinModalOpen(false);

      const orderPayload = {
        reference: orderRef,
        user_id: user.id,
        name,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        email,
        phone,
        address,
        city,
        zone: selectedZone.name,
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          qty: i.quantity,
          price: i.product.price,
        })),
        total,
        subtotal,
        deliveryFee,
        discount,
        vat,
        date: new Date().toISOString(),
        method: 'Ladydee Customer Wallet (Paid)',
        paymentMethod: 'wallet',
        payment_status: 'paid',
        fulfillment_status: 'confirmed',
      };

      sessionStorage.setItem('latest_order', JSON.stringify(orderPayload));
      try {
        const existing = JSON.parse(localStorage.getItem('adeola_local_orders') || '[]');
        localStorage.setItem('adeola_local_orders', JSON.stringify([orderPayload, ...existing]));
      } catch (e) {}

      // Log order to Supabase
      try {
        await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: orderRef,
            orderData: orderPayload,
          }),
        });
      } catch (e) {
        console.warn('API order logging notice:', e);
      }

      // Send email alert to admin store owner
      try {
        await fetch('/api/orders/notify-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: orderRef,
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            delivery_address: address,
            delivery_zone: selectedZone.name,
            items: orderPayload.items,
            subtotal,
            delivery_fee: deliveryFee,
            total,
            payment_method: 'Ladydee Customer Wallet (Paid)',
          }),
        });
      } catch (notifyErr) {
        console.warn('[Admin Notify Notice]:', notifyErr);
      }

      clearCart();
      router.push('/checkout/confirmation');
    } catch (err: any) {
      setWalletPinBusy(false);
      setWalletPinError(err.message || 'Payment processing error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink">Secure Checkout</h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Confirm your delivery address in Lagos/Nigeria, then complete your payment safely.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          {/* Guest Barrier: Must be logged in to enter details and pay */}
          {!authLoading && !user && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-3xl p-6 shadow-soft space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-sm">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Account Required to Fill Details &amp; Pay
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    You cannot enter delivery details or pay for products without an account. Please sign in or create an account so your delivery information is safely saved for later, and your order can be tracked.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => openCheckoutAuth('signin')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md shadow-brand-green/20 text-center transition-colors cursor-pointer"
                >
                  Sign In to Continue
                </button>
                <button
                  type="button"
                  onClick={() => openCheckoutAuth('signup')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white border border-brand-line hover:border-brand-green text-brand-ink font-bold text-xs text-center transition-colors cursor-pointer"
                >
                  Create New Account
                </button>
              </div>
            </div>
          )}

          {/* Authenticated Customer Banner */}
          {!authLoading && user && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                <span>
                  Logged in as <strong>{user.email}</strong>. Details below are saved to your profile for later.
                </span>
              </div>
              <Link href="/account" className="font-bold text-brand-green hover:underline shrink-0 ml-2">
                Edit Profile
              </Link>
            </div>
          )}

          {/* Customer Details Form */}
          <div className="bg-white rounded-3xl border border-brand-line p-6 shadow-soft space-y-4 relative overflow-hidden">
            {!user && (
              <div
                onClick={() => openCheckoutAuth('signin')}
                className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-3xl z-10 cursor-pointer flex items-center justify-center p-4 hover:bg-white/40 transition-all"
                title="Click to Sign In or Sign Up"
              >
                <div className="bg-white border border-amber-300 shadow-xl rounded-2xl px-6 py-3.5 text-center flex items-center gap-2.5 text-xs font-bold text-slate-900 hover:scale-105 transition-transform">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Sign In or Sign Up to unlock delivery details &amp; pay</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-brand-ink uppercase tracking-wider">
                1. Recipient &amp; Delivery Details
              </h3>
              {!user && (
                <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-brand-ink block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  disabled={!user}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={!user ? 'Please sign in first' : 'e.g. Adeola Johnson'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-brand-line text-xs font-semibold outline-none transition-all ${
                    !user
                      ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-brand-ink focus:border-brand-green'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-ink block mb-1">Phone Number (Calling/WhatsApp)</label>
                <input
                  type="tel"
                  required
                  disabled={!user}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={!user ? 'Please sign in first' : '080 1234 5678'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-brand-line text-xs font-semibold outline-none transition-all ${
                    !user
                      ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-brand-ink focus:border-brand-green'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-brand-ink block mb-1">Email Address (For Receipt)</label>
                <input
                  type="email"
                  required
                  disabled={!user}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={!user ? 'Please sign in first' : 'you@example.com'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-brand-line text-xs font-semibold outline-none transition-all ${
                    !user
                      ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-brand-ink focus:border-brand-green'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-brand-ink block mb-1">Street Address / Estate / Flat</label>
                <input
                  type="text"
                  required
                  disabled={!user}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={!user ? 'Please sign in first' : 'e.g. House 4, Palmview Estate, Lekki'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-brand-line text-xs font-semibold outline-none transition-all ${
                    !user
                      ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-brand-ink focus:border-brand-green'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-ink block mb-1">City / State</label>
                <input
                  type="text"
                  required
                  disabled={!user}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-brand-line text-xs font-semibold outline-none transition-all ${
                    !user
                      ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-brand-ink focus:border-brand-green'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-ink block mb-1">Delivery Zone</label>
                <select
                  disabled={!user}
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-brand-line text-xs font-semibold outline-none transition-all ${
                    !user
                      ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-brand-ink focus:border-brand-green cursor-pointer'
                  }`}
                >
                  {DELIVERY_ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.fee === 0 ? 'FREE' : formatNaira(z.fee)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-brand-ink block mb-1">Delivery Instructions / Landmarks (Optional)</label>
                <textarea
                  rows={2}
                  disabled={!user}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={!user ? 'Sign in to add special delivery instructions' : 'e.g. Call before coming, gate color is blue'}
                  className={`w-full px-3.5 py-2 rounded-xl border border-brand-line text-xs font-semibold outline-none transition-all ${
                    !user
                      ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-brand-ink focus:border-brand-green'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl border border-brand-line p-6 shadow-soft space-y-3">
            <h3 className="text-xs font-extrabold text-brand-ink uppercase tracking-wider">
              2. Select Payment Method
            </h3>

            <div className="space-y-3">
              {/* Option 1: Paystack */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  !user
                    ? 'opacity-60 cursor-not-allowed border-brand-line bg-slate-50'
                    : paymentMethod === 'paystack'
                    ? 'border-brand-green bg-brand-green-soft text-brand-green-dark shadow-sm cursor-pointer'
                    : 'border-brand-line bg-white hover:border-gray-300 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payMethod"
                    disabled={!user}
                    checked={paymentMethod === 'paystack'}
                    onChange={() => setPaymentMethod('paystack')}
                    className="accent-brand-green"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm block">Pay Online via Paystack</span>
                    <span className="text-[11px] text-brand-muted">Debit Card, Bank Transfer, USSD, OPay</span>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-brand-green" />
              </label>

              {/* Option 2: Ladydee Wallet */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  !user
                    ? 'opacity-60 cursor-not-allowed border-brand-line bg-slate-50'
                    : paymentMethod === 'wallet'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm cursor-pointer ring-1 ring-emerald-500'
                    : 'border-brand-line bg-white hover:border-emerald-300 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payMethod"
                    disabled={!user}
                    checked={paymentMethod === 'wallet'}
                    onChange={() => setPaymentMethod('wallet')}
                    className="accent-brand-green"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm block">Pay with Ladydee Wallet</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                        Balance: ₦{walletBalance.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[11px] text-brand-muted">
                      {walletBalance >= total ? (
                        <span className="text-emerald-700 font-semibold">Ready &bull; 4-Digit PIN required</span>
                      ) : (
                        <span className="text-amber-700 font-semibold">
                          Insufficient funds (Need ₦{(total - walletBalance).toLocaleString()} more &bull; Top up in Account)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <Wallet className="w-5 h-5 text-emerald-700" />
              </label>

              {/* Option 3: Pay on Delivery (Disabled with Harsh / Coming Soon Style) */}
              <div
                className="flex items-center justify-between p-4 rounded-2xl border-2 border-amber-300 bg-amber-50/70 text-slate-500 cursor-not-allowed select-none opacity-85"
                title="Pay on delivery is temporarily unavailable"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payMethod"
                    disabled
                    checked={false}
                    className="accent-slate-400 cursor-not-allowed"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm line-through text-slate-600">
                        Pay on Delivery
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wider animate-pulse">
                        Coming Soon ⏳
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-900/80 font-medium">
                      Cash/POS upon arrival is temporarily disabled while logistics is being upgraded.
                    </span>
                  </div>
                </div>
                <Banknote className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Terms & Conditions & 18+ Checkbox */}
          <div className="p-4 bg-brand-cream rounded-2xl border border-brand-line-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-700">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded text-brand-green focus:ring-brand-green accent-brand-green"
              />
              <span>
                I agree to the{' '}
                <Link href="/terms" className="text-brand-green font-bold underline" target="_blank">
                  Terms of Service
                </Link>
                , the{' '}
                <Link href="/privacy" className="text-brand-green font-bold underline" target="_blank">
                  Privacy Policy
                </Link>
                , and confirm I am <strong>18 years of age or older</strong>.
              </span>
            </label>
          </div>
        </div>

        {/* Right: Sticky Summary */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-28">
          <div className="bg-white rounded-3xl border border-brand-line p-6 shadow-soft space-y-4">
            <h3 className="text-xs font-extrabold text-brand-ink uppercase tracking-wider">
              Order Review ({count} Items)
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex justify-between text-xs py-1.5 border-b border-brand-line-2">
                  <div className="truncate pr-2">
                    <span className="font-bold text-brand-ink block truncate">{it.product.name}</span>
                    <span className="text-[10px] text-brand-muted">Qty: {it.quantity} × {formatNaira(it.product.price)}</span>
                  </div>
                  <span className="font-bold text-brand-ink flex-shrink-0">
                    {formatNaira(it.product.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal</span>
                <span className="font-bold text-brand-ink">{formatNaira(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brand-green font-bold">
                  <span>Discount</span>
                  <span>−{formatNaira(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-muted">
                <span>Delivery ({selectedZone.name})</span>
                <span className="font-bold text-brand-ink">
                  {deliveryFee === 0 ? <strong className="text-brand-green">FREE</strong> : formatNaira(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-brand-muted">
                <span>VAT (7.5%)</span>
                <span className="font-bold text-brand-ink">{formatNaira(vat)}</span>
              </div>
              <div className="pt-3 border-t border-brand-line-2 flex justify-between items-baseline text-base font-extrabold text-brand-ink">
                <span>Total Due</span>
                <span className="text-xl text-brand-green">{formatNaira(total)}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-brand-coral-soft text-brand-coral text-xs rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            {!user ? (
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => openCheckoutAuth('signin')}
                  className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-black text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all text-center cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Fill Details &amp; Pay</span>
                </button>
                <p className="text-[11px] text-center text-slate-500">
                  New customer?{' '}
                  <button
                    type="button"
                    onClick={() => openCheckoutAuth('signup')}
                    className="text-brand-green font-bold hover:underline"
                  >
                    Create account here
                  </button>
                </p>
              </div>
            ) : (
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3.5 rounded-full bg-brand-green hover:bg-brand-green-dark text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{busy ? 'Processing Payment…' : `Pay ${formatNaira(total)}`}</span>
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Interactive Auth Popup Modal for Checkout */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        title="Account Required to Fill Details & Pay"
        subtitle="You cannot enter delivery details or complete payment without an account. Please sign in or create an account so your details are saved."
        onSuccess={handleAuthSuccess}
      />

      {/* 4-Digit Wallet PIN Authorization Modal */}
      {walletPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-emerald-100 text-center relative">
            <button
              type="button"
              onClick={() => {
                setWalletPinModalOpen(false);
                setWalletPinError('');
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6 text-brand-green" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Authorize Wallet Payment
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Enter your 4-digit Ladydee Security PIN to complete payment of{' '}
              <strong className="text-emerald-800 font-extrabold">{formatNaira(total)}</strong>
            </p>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 mb-4 text-xs flex justify-between items-center">
              <span className="text-emerald-800 font-bold">Wallet Balance:</span>
              <span className="font-extrabold text-emerald-950 text-sm">{formatNaira(walletBalance)}</span>
            </div>

            <div className="space-y-3">
              <input
                type="password"
                maxLength={4}
                autoFocus
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="• • • •"
                value={walletPinInput}
                onChange={(e) => setWalletPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full text-center tracking-[1em] text-2xl font-extrabold py-3 px-4 rounded-2xl border-2 border-slate-200 focus:border-brand-green focus:ring-0 outline-none transition-all"
              />

              {walletPinError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
                  {walletPinError}
                </div>
              )}

              <button
                type="button"
                disabled={walletPinBusy || walletPinInput.length !== 4}
                onClick={handleConfirmWalletPayment}
                className="w-full py-3 rounded-2xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {walletPinBusy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying PIN…</span>
                  </>
                ) : (
                  <span>Confirm &amp; Deduct {formatNaira(total)}</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setWalletPinModalOpen(false);
                  setWalletPinError('');
                }}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel and Pay Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
