'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  CheckCircle2,
  Clock,
  Truck,
  ChevronDown,
  RefreshCw,
  Camera,
  LogOut,
  Save,
  AlertCircle,
  Loader2,
  ShoppingBag,
  Wallet,
  KeyRound,
  PlusCircle,
  Lock,
  Calendar,
  Sparkles,
  X
} from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import { useCartStore } from '@/lib/store/useCartStore';
import { openPaystackModal } from '@/lib/paystack';
import { PRESET_AVATARS, PresetAvatar } from '@/data/avatars';
import {
  supabase,
  isSupabaseConfigured,
  getUserProfile,
  upsertUserProfile,
  fetchLiveOrders,
  UserProfile,
  StoreOrderRecord
} from '@/lib/db/supabase';

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'wallet' | 'profile' | 'addresses' | 'wishlist'>('orders');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<StoreOrderRecord[]>([]);
  const [expandedOrderRef, setExpandedOrderRef] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Profile form state
  const [phone, setPhone] = useState('');
  const [defaultAddress, setDefaultAddress] = useState('');
  const [defaultZone, setDefaultZone] = useState('Lagos Mainland');

  // Wallet State
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [topUpBusy, setTopUpBusy] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinBusy, setPinBusy] = useState(false);
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);

  // Avatar Modal State
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const wishlist = useCartStore((s) => s.wishlist);
  const wishedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const loadAccountData = async (currentUser: any) => {
    try {
      if (!supabase) return;

      // Fetch user profile from Supabase
      const userProf = await getUserProfile(currentUser.id);
      if (userProf) {
        setProfile(userProf);
        setPhone(userProf.phone || '');
        setDefaultAddress(userProf.default_address || '');
        setDefaultZone(userProf.default_zone || 'Lagos Mainland');
      } else {
        setPhone(currentUser.user_metadata?.phone || '');
      }

      // Fetch user's orders from Supabase
      const liveOrders = await fetchLiveOrders(currentUser.email);
      setOrders(liveOrders);
      if (liveOrders.length > 0) {
        setExpandedOrderRef(liveOrders[0].reference);
      }

      // Fetch wallet transactions
      const { data: txs } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (txs) {
        setWalletTransactions(txs);
      }
    } catch (err) {
      console.error('[Account Init Error]:', err);
    }
  };

  useEffect(() => {
    async function initUser() {
      setLoading(true);
      if (!supabase || !isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUser = sessionData.session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          await loadAccountData(currentUser);
        }
      } catch (err) {
        console.error('[Supabase Error]: Account init failed', err);
      } finally {
        setLoading(false);
      }
    }

    initUser();
  }, []);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setOrders([]);
    router.push('/');
    router.refresh();
  };

  // Avatar Rate-Limiting Calculation (1 change every 7 days)
  const canChangeAvatar = (): { allowed: boolean; nextDate?: string } => {
    if (!profile?.avatar_updated_at) return { allowed: true };
    const lastUpdate = new Date(profile.avatar_updated_at).getTime();
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (now - lastUpdate >= sevenDaysMs) {
      return { allowed: true };
    }
    const nextChange = new Date(lastUpdate + sevenDaysMs);
    return {
      allowed: false,
      nextDate: nextChange.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
  };

  // Profile Details Rate-Limiting Calculation (1 change every 30 days)
  const canChangeDetails = (): { allowed: boolean; nextDate?: string } => {
    if (!profile?.details_updated_at) return { allowed: true };
    const lastUpdate = new Date(profile.details_updated_at).getTime();
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    if (now - lastUpdate >= thirtyDaysMs) {
      return { allowed: true };
    }
    const nextChange = new Date(lastUpdate + thirtyDaysMs);
    return {
      allowed: false,
      nextDate: nextChange.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
  };

  const handleSelectCustomAvatarUrl = async (url: string) => {
    if (!user) return;
    const check = canChangeAvatar();
    if (!check.allowed) {
      setProfileFeedback({
        type: 'error',
        message: `Avatar changes are restricted to once a week. You can change again on ${check.nextDate}.`,
      });
      setAvatarModalOpen(false);
      return;
    }

    setSavingAvatar(true);
    try {
      const nowIso = new Date().toISOString();
      const updated = await upsertUserProfile({
        id: user.id,
        avatar_url: url,
        avatar_updated_at: nowIso,
      } as any);

      setProfile(updated);
      setProfileFeedback({ type: 'success', message: 'Profile avatar updated successfully!' });
      setAvatarModalOpen(false);
    } catch (err: any) {
      setProfileFeedback({ type: 'error', message: err.message || 'Failed to update avatar.' });
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleSelectPresetAvatar = async (avatar: PresetAvatar) => {
    await handleSelectCustomAvatarUrl(avatar.svgUrl);
  };

  const handleSelectGoogleAvatar = async () => {
    if (googleAvatar) {
      await handleSelectCustomAvatarUrl(googleAvatar);
    }
  };

  // Save Delivery Details (Rate limited to once per month)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const check = canChangeDetails();
    if (!check.allowed) {
      setProfileFeedback({
        type: 'error',
        message: `Profile delivery details can only be updated once a month. You can update again on ${check.nextDate}.`,
      });
      return;
    }

    setSavingProfile(true);
    setProfileFeedback(null);
    try {
      const nowIso = new Date().toISOString();
      const updated = await upsertUserProfile({
        id: user.id,
        phone: phone.trim(),
        default_address: defaultAddress.trim(),
        default_zone: defaultZone,
        details_updated_at: nowIso,
      } as any);

      setProfile(updated);
      setProfileFeedback({
        type: 'success',
        message: 'Delivery details saved! You can update again in 30 days.',
      });
    } catch (err: any) {
      setProfileFeedback({ type: 'error', message: err.message || 'Could not update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  // Wallet: Trigger Paystack Deposit
  const handleInitiateTopUp = () => {
    const finalAmount = customAmount ? Number(customAmount) : topUpAmount;
    if (!finalAmount || finalAmount < 500) {
      alert('Minimum wallet top-up is ₦500.');
      return;
    }

    const ref = 'WAL-DEP-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    setTopUpBusy(true);

    openPaystackModal({
      email: user.email,
      amount: finalAmount,
      reference: ref,
      metadata: {
        userId: user.id,
        customerName: profile?.full_name || user.email,
        type: 'wallet_deposit',
      },
      onSuccess: async (resp) => {
        try {
          const res = await fetch('/api/wallet/deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              amount: finalAmount,
              reference: resp.reference || ref,
            }),
          });

          const data = await res.json();
          if (res.ok) {
            setProfile((prev: any) => ({ ...prev, wallet_balance: data.newBalance }));
            setTopUpModalOpen(false);
            setCustomAmount('');
            setProfileFeedback({
              type: 'success',
              message: `₦${finalAmount.toLocaleString()} successfully deposited to your Ladydee Wallet!`,
            });
            await loadAccountData(user);
          } else {
            alert(data.error || 'Deposit failed');
          }
        } catch (e: any) {
          alert('Could not credit wallet: ' + e.message);
        } finally {
          setTopUpBusy(false);
        }
      },
      onClose: () => {
        setTopUpBusy(false);
      },
    });
  };

  // Wallet: Save 4-Digit PIN
  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(newPin)) {
      setPinFeedback('PIN must be exactly 4 numeric digits (e.g. 1234).');
      return;
    }
    if (newPin !== confirmPin) {
      setPinFeedback('PINs do not match. Please verify.');
      return;
    }

    setPinBusy(true);
    setPinFeedback(null);
    try {
      const res = await fetch('/api/wallet/set-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          pin: newPin,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfile((prev: any) => ({ ...prev, wallet_pin: newPin }));
        setPinModalOpen(false);
        setNewPin('');
        setConfirmPin('');
        setProfileFeedback({
          type: 'success',
          message: 'Your 4-digit Wallet Payment PIN is now active and secure!',
        });
      } else {
        setPinFeedback(data.error || 'Failed to set PIN.');
      }
    } catch (e: any) {
      setPinFeedback(e.message || 'Network error.');
    } finally {
      setPinBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh] text-brand-muted">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green mb-3" />
        <p className="text-xs font-bold">Loading account data...</p>
      </div>
    );
  }

  // If user is not logged in, show authenticated gateway
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-green-soft text-brand-green mx-auto flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-brand-ink">Customer Account Gateway</h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-2 max-w-md mx-auto">
            Sign in to track real-time orders, manage your saved Lagos addresses, or use your Ladydee Wallet.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-green text-white font-bold text-xs shadow-md shadow-brand-green/20 hover:bg-brand-green-dark transition-all"
          >
            Sign In to Account
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-brand-line text-brand-ink font-bold text-xs hover:border-brand-green transition-all"
          >
            Create New Account
          </Link>
        </div>
      </div>
    );
  }

  // Google sign in round picture detection
  const isGoogleUser = user?.app_metadata?.provider === 'google' || Boolean(user?.user_metadata?.avatar_url);
  const googleAvatar =
    profile?.google_avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.identities?.find((i: any) => i.provider === 'google')?.identity_data?.avatar_url ||
    user?.identities?.find((i: any) => i.provider === 'google')?.identity_data?.picture;
  const displayAvatar = profile?.avatar_url || googleAvatar;
  const usernameDisplay = profile?.username
    ? `@${profile.username}`
    : user?.user_metadata?.username
    ? `@${user.user_metadata.username}`
    : '@member';
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Valued Shopper';
  const initial = (profile?.username || displayName).charAt(0).toUpperCase();
  const walletBal = Number(profile?.wallet_balance || 0);

  const avatarCheck = canChangeAvatar();
  const detailsCheck = canChangeDetails();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl border border-brand-line p-6 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Avatar with Click to Choose Preset */}
          <div
            onClick={() => setAvatarModalOpen(true)}
            className="relative cursor-pointer group shrink-0 aspect-square w-16 h-16 min-w-[64px] min-h-[64px]"
            title={avatarCheck.allowed ? 'Click to choose profile avatar' : `Avatar locked until ${avatarCheck.nextDate}`}
          >
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={usernameDisplay}
                className="w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] rounded-full object-cover shrink-0 aspect-square overflow-hidden border-2 border-brand-green shadow-md group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-16 h-16 min-w-[64px] min-h-[64px] rounded-full bg-brand-green text-white text-2xl font-extrabold flex items-center justify-center shrink-0 aspect-square shadow-md group-hover:scale-105 transition-transform">
                {initial}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 group-hover:bg-brand-green text-white shadow-sm transition-colors">
              <Camera className="w-3 h-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-brand-ink">{usernameDisplay}</h1>
              {isGoogleUser ? (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold flex items-center gap-1 border border-blue-200">
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  </svg>
                  Google
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-brand-green-soft text-brand-green text-[10px] font-extrabold uppercase">
                  Verified Shopper
                </span>
              )}
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              {user.email} &bull; {phone || 'No phone set'}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              {avatarCheck.allowed ? (
                <span className="text-brand-green font-semibold cursor-pointer" onClick={() => setAvatarModalOpen(true)}>
                  Tap avatar to choose character &bull; Changes allowed weekly
                </span>
              ) : (
                <span>Next avatar change available: <strong>{avatarCheck.nextDate}</strong></span>
              )}
            </p>
          </div>
        </div>

        {/* Quick Balance & Sign Out */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-left">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 block">
              Ladydee Wallet
            </span>
            <span className="text-base font-extrabold text-emerald-950">
              ₦{walletBal.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {profileFeedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2 text-xs font-semibold ${
            profileFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {profileFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          )}
          <span>{profileFeedback.message}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 border-b border-brand-line-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-brand-green text-white shadow-sm'
              : 'bg-white text-brand-muted hover:text-brand-ink border border-brand-line'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 cursor-pointer ${
            activeTab === 'wallet'
              ? 'bg-brand-green text-white shadow-sm'
              : 'bg-white text-brand-muted hover:text-brand-ink border border-brand-line'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Ladydee Wallet (₦{walletBal.toLocaleString()})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-brand-green text-white shadow-sm'
              : 'bg-white text-brand-muted hover:text-brand-ink border border-brand-line'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profile &amp; Delivery</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 cursor-pointer ${
            activeTab === 'addresses'
              ? 'bg-brand-green text-white shadow-sm'
              : 'bg-white text-brand-muted hover:text-brand-ink border border-brand-line'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 cursor-pointer ${
            activeTab === 'wishlist'
              ? 'bg-brand-green text-white shadow-sm'
              : 'bg-white text-brand-muted hover:text-brand-ink border border-brand-line'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishedProducts.length})</span>
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-brand-line p-12 text-center space-y-4 shadow-soft">
              <div className="w-14 h-14 rounded-2xl bg-brand-green-soft text-brand-green mx-auto flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-brand-ink">No Orders Placed Yet</h3>
                <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
                  When you check out with Paystack or your Ladydee Wallet, your fulfillment and rider dispatch will appear here.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-green text-white text-xs font-bold shadow-md shadow-brand-green/20 hover:bg-brand-green-dark transition-all"
              >
                <span>Start Your Market Run</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => {
                const isExpanded = expandedOrderRef === ord.reference;
                return (
                  <div
                    key={ord.reference}
                    className="bg-white rounded-3xl border border-brand-line shadow-soft overflow-hidden transition-all"
                  >
                    <div
                      onClick={() => setExpandedOrderRef(isExpanded ? null : ord.reference)}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/60 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-extrabold text-sm text-brand-ink">
                            #{ord.reference}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              ord.fulfillment_status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.fulfillment_status === 'out_for_delivery'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.fulfillment_status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-brand-muted">
                          {new Date(ord.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })} &bull; {ord.items.length} items &bull; {ord.payment_method}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-base font-extrabold text-brand-green">
                          ₦{Number(ord.total).toLocaleString()}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-brand-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-5 pb-6 pt-2 border-t border-brand-line-2 bg-slate-50/50 space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div>
                            <span className="font-bold text-slate-700 block mb-1">Dispatch Destination:</span>
                            <p className="text-slate-600">{ord.delivery_address}</p>
                            <p className="text-slate-500 font-medium">{ord.delivery_zone}</p>
                            <p className="text-slate-500 mt-1">Recipient: {ord.customer_name} ({ord.customer_phone})</p>
                          </div>
                          <div>
                            <span className="font-bold text-slate-700 block mb-1">Settlement Details:</span>
                            <p className="text-slate-600">Method: <strong>{ord.payment_method}</strong></p>
                            <p className="text-slate-600">Subtotal: ₦{Number(ord.subtotal).toLocaleString()}</p>
                            <p className="text-slate-600">Delivery Fee: ₦{Number(ord.delivery_fee).toLocaleString()}</p>
                            <p className="text-emerald-700 font-bold text-sm mt-1">Total Paid: ₦{Number(ord.total).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="border-t border-slate-200 pt-3">
                          <span className="font-bold text-slate-700 block mb-2">Baskets &amp; Produce:</span>
                          <div className="space-y-1.5">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between text-slate-600">
                                <span>{it.name} &times; {it.qty}</span>
                                <span className="font-semibold">₦{(it.price * it.qty).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LADYDEE WALLET */}
      {activeTab === 'wallet' && (
        <div className="space-y-6 max-w-3xl">
          {/* Balance Showcase Card */}
          <div className="bg-gradient-to-br from-[#14532d] to-[#166534] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold mb-3">
                  <Wallet className="w-3.5 h-3.5" />
                  Ladydee Personal Shopper Balance
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                  ₦{walletBal.toLocaleString()}
                </h2>
                <p className="text-xs text-emerald-200 mt-2">
                  Instant one-click grocery settlements &bull; Zero debit card exposure
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setTopUpModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-700" />
                  <span>Top-Up Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPinFeedback(null);
                    setPinModalOpen(true);
                  }}
                  className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 border border-emerald-600 transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-amber-300" />
                  <span>{profile?.wallet_pin ? 'Change 4-Digit PIN' : 'Set 4-Digit PIN'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
            <KeyRound className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Protect Your Payment PIN:</strong> Your 4-digit PIN is required to authorize purchases from your wallet balance. Never share this PIN with anyone, including delivery riders or store support.
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-3xl border border-brand-line p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-extrabold text-brand-ink uppercase tracking-wider">
              Wallet History
            </h3>
            {walletTransactions.length === 0 ? (
              <div className="text-center py-8 text-xs text-brand-muted">
                No wallet transactions yet. Top up your balance to start paying for groceries with ease!
              </div>
            ) : (
              <div className="divide-y divide-brand-line-2">
                {walletTransactions.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {tx.description || (tx.type === 'deposit' ? 'Wallet Deposit' : 'Order Payment')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(tx.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })} &bull; Ref: {tx.reference}
                      </span>
                    </div>
                    <span
                      className={`font-extrabold text-sm ${
                        tx.amount > 0 ? 'text-emerald-700' : 'text-slate-800'
                      }`}
                    >
                      {tx.amount > 0 ? `+₦${Number(tx.amount).toLocaleString()}` : `-₦${Math.abs(Number(tx.amount)).toLocaleString()}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-brand-line p-6 sm:p-8 shadow-soft max-w-2xl space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-brand-ink">Profile Details</h2>
            <p className="text-xs text-brand-muted mt-1">
              Personal registration details are permanent for account security. Delivery details can be updated once per month.
            </p>
          </div>

          {/* Permanent Personal Details (Locked) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Permanent Registration Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Full Legal Name</label>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold">
                  {displayName}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Account Email</label>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold truncate">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Username</label>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold">
                  @{profile?.username || user.user_metadata?.username || 'member'}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Date of Birth</label>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold">
                  {profile?.date_of_birth || user.user_metadata?.date_of_birth || 'Not specified'}
                </div>
              </div>
            </div>
          </div>

          {/* Updatable Delivery Details (Once per Month) */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                Delivery Coordinates
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                {detailsCheck.allowed ? (
                  <span className="text-emerald-700 font-bold">Editable now</span>
                ) : (
                  <span>Next update available: <strong>{detailsCheck.nextDate}</strong></span>
                )}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                Phone Number (Dispatch Contact)
              </label>
              <input
                type="tel"
                value={phone}
                disabled={!detailsCheck.allowed}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0802 345 6789"
                className="w-full px-4 py-2.5 text-xs text-brand-ink bg-[#fbfcfb] rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                Default Lagos Address
              </label>
              <input
                type="text"
                value={defaultAddress}
                disabled={!detailsCheck.allowed}
                onChange={(e) => setDefaultAddress(e.target.value)}
                placeholder="e.g. Flat 4, 14 Admiralty Way, Lekki Phase 1"
                className="w-full px-4 py-2.5 text-xs text-brand-ink bg-[#fbfcfb] rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                Default Delivery Zone
              </label>
              <select
                value={defaultZone}
                disabled={!detailsCheck.allowed}
                onChange={(e) => setDefaultZone(e.target.value)}
                className="w-full px-4 py-2.5 text-xs text-brand-ink bg-[#fbfcfb] rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="Lagos Mainland">Lagos Mainland</option>
                <option value="Lagos Island & Victoria Island">Lagos Island &amp; Victoria Island</option>
                <option value="Lekki Phase 1 & Ikoyi">Lekki Phase 1 &amp; Ikoyi</option>
                <option value="Ikeja, Maryland, Opebi">Ikeja, Maryland, Opebi</option>
                <option value="Surulere, Yaba">Surulere, Yaba</option>
                <option value="Lagos Outskirts (Ajah, Ikorodu, Alimosho)">Lagos Outskirts</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={savingProfile || !detailsCheck.allowed}
              className="px-6 py-2.5 rounded-full bg-brand-green text-white font-bold text-xs flex items-center gap-2 hover:bg-brand-green-dark transition-all disabled:opacity-50 cursor-pointer"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Delivery Settings</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="bg-white rounded-3xl border border-brand-line p-6 sm:p-8 shadow-soft max-w-2xl space-y-4">
          <h2 className="text-lg font-extrabold text-brand-ink">Saved Delivery Addresses</h2>
          {defaultAddress ? (
            <div className="p-4 rounded-2xl border-2 border-brand-green bg-brand-green-soft/40 flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-brand-green text-white text-[10px] font-bold uppercase">
                  Default Address
                </span>
                <p className="font-bold text-xs text-brand-ink mt-2">{defaultAddress}</p>
                <p className="text-xs text-brand-muted mt-0.5">{defaultZone}</p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-brand-muted py-6 text-center">
              No saved address yet. Add your default address in the <strong>Profile &amp; Delivery</strong> tab above.
            </div>
          )}
        </div>
      )}

      {/* TAB 5: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          {wishedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-brand-line p-12 text-center text-xs text-brand-muted shadow-soft">
              Your wishlist is currently empty. Tap the heart icon on any product to save it here!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {wishedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Top-Up Wallet Modal */}
      {topUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-emerald-100 relative">
            <button
              onClick={() => setTopUpModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <PlusCircle className="w-6 h-6 text-brand-green" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900">Fund Ladydee Wallet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Securely deposit funds via Paystack (Debit Card, Direct Bank Transfer, or USSD).
            </p>

            {/* Amount Presets */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {[2000, 5000, 10000, 20000, 50000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setTopUpAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    !customAmount && topUpAmount === amt
                      ? 'bg-brand-green text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="mb-5">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Or Enter Custom Deposit (₦):
              </label>
              <input
                type="number"
                min="500"
                step="500"
                placeholder="e.g. 15000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-brand-green"
              />
            </div>

            <button
              type="button"
              disabled={topUpBusy}
              onClick={handleInitiateTopUp}
              className="w-full py-3.5 rounded-2xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {topUpBusy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting Paystack…</span>
                </>
              ) : (
                <span>
                  Deposit ₦{(customAmount ? Number(customAmount) : topUpAmount).toLocaleString()} via Paystack
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 4-Digit Security PIN Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-emerald-100 text-center relative">
            <button
              onClick={() => setPinModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6 text-brand-green" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              {profile?.wallet_pin ? 'Update 4-Digit PIN' : 'Create 4-Digit PIN'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Enter a secret 4-digit numeric code to authorize wallet payouts during checkout.
            </p>

            <form onSubmit={handleSavePin} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Enter 4-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="• • • •"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full text-center tracking-[0.8em] text-xl font-black py-2.5 px-4 rounded-xl border border-slate-200 focus:border-brand-green outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Confirm 4-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="• • • •"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full text-center tracking-[0.8em] text-xl font-black py-2.5 px-4 rounded-xl border border-slate-200 focus:border-brand-green outline-none"
                />
              </div>

              {pinFeedback && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
                  {pinFeedback}
                </div>
              )}

              <button
                type="submit"
                disabled={pinBusy || newPin.length !== 4 || confirmPin.length !== 4}
                className="w-full py-3 rounded-2xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {pinBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Security PIN</span>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Preset Avatar Picker Modal */}
      {avatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-emerald-100 relative">
            <button
              onClick={() => setAvatarModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Choose Profile Character
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Select one of our fresh Nigerian grocer characters. You can update this once every 7 days.
            </p>

            {!avatarCheck.allowed ? (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 mb-4">
                <strong>Weekly Limit Active:</strong> You recently updated your avatar. Next character selection unlocks on <strong>{avatarCheck.nextDate}</strong>.
              </div>
            ) : null}

            {googleAvatar && (
              <button
                type="button"
                disabled={!avatarCheck.allowed || savingAvatar}
                onClick={handleSelectGoogleAvatar}
                className="w-full flex items-center gap-3 p-3 mb-4 rounded-2xl border-2 border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 transition-all text-left cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <img
                  src={googleAvatar}
                  alt="Google Profile"
                  className="w-12 h-12 rounded-full object-cover shrink-0 aspect-square border-2 border-blue-500 shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                    Switch to Google Profile Picture
                  </p>
                  <p className="text-[10px] text-blue-700">Restore your real circular Google account photo</p>
                </div>
              </button>
            )}

            <div className="grid grid-cols-4 gap-3 mb-4">
              {PRESET_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  disabled={!avatarCheck.allowed || savingAvatar}
                  onClick={() => handleSelectPresetAvatar(av)}
                  className="flex flex-col items-center p-2 rounded-2xl border-2 hover:border-brand-green hover:bg-emerald-50/50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
                >
                  <img src={av.svgUrl} alt={av.name} className="w-14 h-14 rounded-full shrink-0 aspect-square shadow-sm group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-700 mt-1.5 text-center leading-tight">
                    {av.name}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-[10px] text-center text-slate-400">
              Signed in with Google? Your Google round profile picture is automatically used.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}