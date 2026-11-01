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
  ShoppingBag
} from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import { useCartStore } from '@/lib/store/useCartStore';
import {
  supabase,
  isSupabaseConfigured,
  getUserProfile,
  upsertUserProfile,
  fetchLiveOrders,
  UserProfile,
  StoreOrderRecord
} from '@/lib/db/supabase';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'wishlist'>('orders');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<StoreOrderRecord[]>([]);
  const [expandedOrderRef, setExpandedOrderRef] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Profile form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [defaultAddress, setDefaultAddress] = useState('');
  const [defaultZone, setDefaultZone] = useState('Lagos Mainland');

  const wishlist = useCartStore((s) => s.wishlist);
  const wishedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  // Load user session and Supabase data
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
          // Fetch user profile from Supabase
          const userProf = await getUserProfile(currentUser.id);
          if (userProf) {
            setProfile(userProf);
            setFullName(userProf.full_name || '');
            setPhone(userProf.phone || '');
            setDefaultAddress(userProf.default_address || '');
            setDefaultZone(userProf.default_zone || 'Lagos Mainland');
          } else {
            setFullName(currentUser.user_metadata?.full_name || '');
            setPhone(currentUser.user_metadata?.phone || '');
          }

          // Fetch user's orders from Supabase (strictly live, no fake mock data)
          const liveOrders = await fetchLiveOrders(currentUser.email);
          setOrders(liveOrders);
          if (liveOrders.length > 0) {
            setExpandedOrderRef(liveOrders[0].reference);
          }
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

  // Avatar Upload via Cloudinary bridged to Supabase
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    setProfileFeedback(null);
    try {
      const result = await uploadImageToCloudinary(file);
      const newAvatarUrl = result.secure_url || result.url;

      // Bridge and persist to Supabase User Profile
      const updated = await upsertUserProfile({
        id: user.id,
        full_name: fullName || user.email?.split('@')[0] || 'Customer',
        email: user.email,
        phone,
        avatar_url: newAvatarUrl,
        default_address: defaultAddress,
        default_zone: defaultZone,
      });

      setProfile(updated);
      setProfileFeedback({ type: 'success', message: 'Profile picture updated successfully!' });
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      setProfileFeedback({
        type: 'error',
        message: err.message || 'Failed to upload photo. Check Cloudinary upload preset.',
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Save Text-based Profile Metadata to Supabase
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSavingProfile(true);
    setProfileFeedback(null);
    try {
      const updated = await upsertUserProfile({
        id: user.id,
        full_name: fullName.trim(),
        email: user.email,
        phone: phone.trim(),
        default_address: defaultAddress.trim(),
        default_zone: defaultZone,
        avatar_url: profile?.avatar_url,
      });

      setProfile(updated);
      setProfileFeedback({ type: 'success', message: 'Profile settings saved successfully in Supabase!' });
    } catch (err: any) {
      console.error('Profile update error:', err);
      setProfileFeedback({ type: 'error', message: err.message || 'Could not update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh] text-brand-muted">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green mb-3" />
        <p className="text-xs font-bold">Loading account data from Supabase...</p>
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
            Sign in to track real-time orders, manage your saved Lagos addresses, or upload your profile picture.
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

  const displayName = profile?.full_name || fullName || user.email?.split('@')[0] || 'Valued Shopper';
  const displayAvatar = profile?.avatar_url;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl border border-brand-line p-6 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Avatar with Cloudinary Upload Badge */}
          <div className="relative group">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover border-2 border-brand-green shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-brand-green text-white text-2xl font-extrabold flex items-center justify-center shadow-md">
                {initial}
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-brand-ink hover:bg-brand-green text-white cursor-pointer shadow-md transition-colors"
              title="Upload profile picture to Cloudinary"
            >
              <Camera className="w-3.5 h-3.5" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-brand-ink">{displayName}</h1>
              <span className="px-2 py-0.5 rounded-full bg-brand-green-soft text-brand-green text-[10px] font-extrabold uppercase">
                Active
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">{user.email} · {phone || 'No phone set'}</p>
            {uploadingAvatar && (
              <p className="text-[10px] text-brand-green font-bold flex items-center gap-1 mt-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Uploading image to Cloudinary...
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
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
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
            activeTab === 'orders'
              ? 'bg-brand-green text-white shadow-sm'
              : 'bg-white text-brand-muted hover:text-brand-ink border border-brand-line'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
            activeTab === 'profile'
              ? 'bg-brand-green text-white shadow-sm'
              : 'bg-white text-brand-muted hover:text-brand-ink border border-brand-line'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profile Settings</span>
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

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
            activeTab === 'wishlist'
              ? 'bg-brand-green text-white shadow-sm'
              : 'bg-white text-brand-muted hover:text-brand-ink border border-brand-line'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishedProducts.length})</span>
        </button>
      </div>

      {/* TAB 1: REAL SUPABASE ORDERS (Zero Fake Mocks) */}
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
                  When you check out with Paystack or Pay on Delivery, your real-time fulfillment and rider dispatch will appear here.
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
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {ord.fulfillment_status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-brand-muted">
                          Placed on {new Date(ord.created_at).toLocaleDateString('en-NG')} · {ord.items.length} items · {ord.delivery_zone}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-brand-muted block uppercase font-bold">Total</span>
                          <span className="font-extrabold text-base text-brand-ink">{formatNaira(ord.total)}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-brand-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 sm:p-6 pt-0 border-t border-brand-line-2 bg-[#fcfdfc] space-y-4">
                        <div className="mt-4 p-4 rounded-2xl bg-white border border-brand-line space-y-2">
                          <p className="text-xs font-bold text-brand-ink">Delivery Address:</p>
                          <p className="text-xs text-gray-600">{ord.delivery_address}</p>
                          <p className="text-xs text-gray-600">Contact: {ord.customer_name} ({ord.customer_phone})</p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-bold text-brand-ink uppercase tracking-wider">Ordered Groceries:</p>
                          <div className="divide-y divide-brand-line-2 bg-white rounded-2xl border border-brand-line">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="p-3 flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-bold text-brand-ink">{it.qty}x {it.name}</span>
                                </div>
                                <span className="font-extrabold text-brand-green">{formatNaira(it.price * it.qty)}</span>
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

      {/* TAB 2: PROFILE SETTINGS (Supabase text metadata + Cloudinary Avatar) */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-brand-line p-6 sm:p-8 shadow-soft max-w-2xl">
          <div className="mb-6">
            <h2 className="text-lg font-extrabold text-brand-ink">Profile Settings</h2>
            <p className="text-xs text-brand-muted mt-1">
              Update your contact metadata and Lagos delivery information. Backed live by Supabase and Cloudinary.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Chioma Adebayo"
                required
                className="w-full px-4 py-2.5 text-xs text-brand-ink bg-[#fbfcfb] rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                Account Email (Read-Only)
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2.5 text-xs text-gray-500 bg-gray-100 rounded-xl border border-gray-200 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                Phone Number (Dispatch Contact)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0802 345 6789"
                className="w-full px-4 py-2.5 text-xs text-brand-ink bg-[#fbfcfb] rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                Default Lagos Address
              </label>
              <input
                type="text"
                value={defaultAddress}
                onChange={(e) => setDefaultAddress(e.target.value)}
                placeholder="e.g. Flat 4, 14 Admiralty Way, Lekki Phase 1"
                className="w-full px-4 py-2.5 text-xs text-brand-ink bg-[#fbfcfb] rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                Default Delivery Zone
              </label>
              <select
                value={defaultZone}
                onChange={(e) => setDefaultZone(e.target.value)}
                className="w-full px-4 py-2.5 text-xs text-brand-ink bg-[#fbfcfb] rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none"
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
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-full bg-brand-green text-white font-bold text-xs flex items-center gap-2 hover:bg-brand-green-dark transition-all disabled:opacity-50"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving to Supabase...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Settings</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="bg-white rounded-3xl border border-brand-line p-6 sm:p-8 shadow-soft max-w-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-brand-ink">Saved Delivery Addresses</h2>
          </div>
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
              No saved address yet. Add your default address in the <strong>Profile Settings</strong> tab above.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: WISHLIST */}
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
    </div>
  );
}
