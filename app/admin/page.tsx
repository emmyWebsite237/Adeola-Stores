'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Package,
  TrendingUp,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  Upload,
  RefreshCw,
  Database,
  ExternalLink,
  Search,
  AlertCircle,
  ChefHat,
  Edit3,
  Trash2,
  Plus,
  X,
  Save,
  Loader2,
  ShoppingBasket,
  Share2,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  Sliders
} from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import {
  supabase,
  isSupabaseConfigured,
  fetchLiveOrders,
  fetchLiveRecipes,
  upsertLiveRecipe,
  deleteLiveRecipe,
  updateOrderStatus,
  StoreOrderRecord,
  StoreRecipeRecord
} from '@/lib/db/supabase';
import { PAYSTACK_PUBLIC_KEY } from '@/lib/paystack';
import DataMissing from '@/components/ui/DataMissing';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '@/lib/useSiteSettings';

// ─── Active Tab Type ────────────────────────────────────────────────────────
type AdminTab = 'orders' | 'recipes' | 'settings' | 'tools';

// ─── Recipe Form State ──────────────────────────────────────────────────────
interface RecipeFormState {
  id: string;
  slug: string;
  name: string;
  headline: string;
  image: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  difficulty: string;
  category: string;
  description: string;
  instructions: string[];
  ingredients: Array<{
    productId: string;
    name: string;
    amount: string;
    required: boolean;
  }>;
}

const EMPTY_RECIPE: RecipeFormState = {
  id: '',
  slug: '',
  name: '',
  headline: '',
  image: '',
  prep_time: '',
  cook_time: '',
  servings: 4,
  difficulty: 'Medium',
  category: '',
  description: '',
  instructions: [''],
  ingredients: [{ productId: '', name: '', amount: '', required: true }],
};

export default function AdminDashboardPage() {
  // ─── State ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  // Orders
  const [orders, setOrders] = useState<StoreOrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Recipes
  const [recipes, setRecipes] = useState<StoreRecipeRecord[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState<RecipeFormState | null>(null);
  const [recipeSaving, setRecipeSaving] = useState(false);
  const [recipeDeleting, setRecipeDeleting] = useState<string | null>(null);
  const [recipeFeedback, setRecipeFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Copied asset feedback
  const [copiedAsset, setCopiedAsset] = useState<string | null>(null);

  // Store & Social Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // ─── Data Fetching (Supabase Only – Zero Mocks) ────────────────────────
  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      if (!supabase || !isSupabaseConfigured) {
        console.warn('[Admin]: Supabase not configured — orders will be empty.');
        setOrders([]);
        return;
      }
      const data = await fetchLiveOrders();
      setOrders(data);
    } catch (e) {
      console.error('[Admin]: Failed to load orders', e);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const loadRecipes = useCallback(async () => {
    setRecipesLoading(true);
    try {
      if (!supabase || !isSupabaseConfigured) {
        console.warn('[Admin]: Supabase not configured — recipes will be empty.');
        setRecipes([]);
        return;
      }
      const data = await fetchLiveRecipes();
      setRecipes(data);
    } catch (e) {
      console.error('[Admin]: Failed to load recipes', e);
      setRecipes([]);
    } finally {
      setRecipesLoading(false);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data?.settings) {
          setSiteSettings((prev) => ({ ...prev, ...data.settings }));
        }
      }
    } catch (e) {
      console.warn('[Admin]: Failed to load settings', e);
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadRecipes();
    loadSettings();
  }, [loadOrders, loadRecipes, loadSettings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsFeedback(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: siteSettings }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSettingsFeedback({ type: 'error', message: data.error || 'Failed to save settings' });
      } else {
        setSettingsFeedback({ type: 'success', message: 'Settings successfully updated and published to the live store!' });
        setTimeout(() => setSettingsFeedback(null), 4000);
      }
    } catch (err: any) {
      setSettingsFeedback({ type: 'error', message: err.message || 'Error saving settings' });
    } finally {
      setSettingsSaving(false);
    }
  };

  // ─── Order Actions ─────────────────────────────────────────────────────
  const handleUpdateStatus = async (reference: string, newStatus: string) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((ord) =>
        ord.reference === reference ? { ...ord, fulfillment_status: newStatus } : ord
      )
    );
    await updateOrderStatus(reference, newStatus);
  };

  // ─── Recipe CRUD ───────────────────────────────────────────────────────
  const handleEditRecipe = (recipe: StoreRecipeRecord) => {
    setEditingRecipe({
      id: recipe.id,
      slug: recipe.slug,
      name: recipe.name,
      headline: recipe.headline || '',
      image: recipe.image || '',
      prep_time: recipe.prep_time || '',
      cook_time: recipe.cook_time || '',
      servings: recipe.servings || 4,
      difficulty: recipe.difficulty || 'Medium',
      category: recipe.category || '',
      description: recipe.description || '',
      instructions: recipe.instructions || [''],
      ingredients: recipe.ingredients || [{ productId: '', name: '', amount: '', required: true }],
    });
    setRecipeFeedback(null);
  };

  const handleNewRecipe = () => {
    setEditingRecipe({
      ...EMPTY_RECIPE,
      id: `recipe-${Date.now()}`,
      slug: `recipe-${Date.now()}`,
    });
    setRecipeFeedback(null);
  };

  const handleSaveRecipe = async () => {
    if (!editingRecipe) return;
    if (!editingRecipe.name.trim()) {
      setRecipeFeedback({ type: 'error', message: 'Recipe name is required.' });
      return;
    }

    setRecipeSaving(true);
    setRecipeFeedback(null);
    try {
      await upsertLiveRecipe({
        id: editingRecipe.id,
        slug: editingRecipe.slug || editingRecipe.name.toLowerCase().replace(/\s+/g, '-'),
        name: editingRecipe.name,
        headline: editingRecipe.headline,
        image: editingRecipe.image,
        prep_time: editingRecipe.prep_time,
        cook_time: editingRecipe.cook_time,
        servings: editingRecipe.servings,
        difficulty: editingRecipe.difficulty,
        category: editingRecipe.category,
        description: editingRecipe.description,
        instructions: editingRecipe.instructions.filter((s) => s.trim()),
        ingredients: editingRecipe.ingredients.filter((i) => i.name.trim()),
      });
      setRecipeFeedback({ type: 'success', message: `"${editingRecipe.name}" saved to Supabase!` });
      setEditingRecipe(null);
      await loadRecipes();
    } catch (err: any) {
      setRecipeFeedback({ type: 'error', message: err.message || 'Failed to save recipe.' });
    } finally {
      setRecipeSaving(false);
    }
  };

  const handleDeleteRecipe = async (recipeId: string, recipeName: string) => {
    if (!confirm(`Permanently delete "${recipeName}"? This cannot be undone.`)) return;
    setRecipeDeleting(recipeId);
    try {
      await deleteLiveRecipe(recipeId);
      setRecipeFeedback({ type: 'success', message: `"${recipeName}" deleted.` });
      await loadRecipes();
    } catch (err: any) {
      setRecipeFeedback({ type: 'error', message: err.message || 'Failed to delete recipe.' });
    } finally {
      setRecipeDeleting(null);
    }
  };

  // ─── Recipe Form Helpers ───────────────────────────────────────────────
  const updateInstruction = (idx: number, value: string) => {
    if (!editingRecipe) return;
    const updated = [...editingRecipe.instructions];
    updated[idx] = value;
    setEditingRecipe({ ...editingRecipe, instructions: updated });
  };

  const addInstruction = () => {
    if (!editingRecipe) return;
    setEditingRecipe({ ...editingRecipe, instructions: [...editingRecipe.instructions, ''] });
  };

  const removeInstruction = (idx: number) => {
    if (!editingRecipe) return;
    setEditingRecipe({
      ...editingRecipe,
      instructions: editingRecipe.instructions.filter((_, i) => i !== idx),
    });
  };

  const updateIngredient = (idx: number, field: string, value: any) => {
    if (!editingRecipe) return;
    const updated = [...editingRecipe.ingredients];
    (updated[idx] as any)[field] = value;
    setEditingRecipe({ ...editingRecipe, ingredients: updated });
  };

  const addIngredient = () => {
    if (!editingRecipe) return;
    setEditingRecipe({
      ...editingRecipe,
      ingredients: [...editingRecipe.ingredients, { productId: '', name: '', amount: '', required: true }],
    });
  };

  const removeIngredient = (idx: number) => {
    if (!editingRecipe) return;
    setEditingRecipe({
      ...editingRecipe,
      ingredients: editingRecipe.ingredients.filter((_, i) => i !== idx),
    });
  };

  // ─── Static Asset Copy Helper ───────────────────────────────────────────
  const copyAssetPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedAsset(path);
    setTimeout(() => setCopiedAsset(null), 2500);
  };

  // ─── Computed Stats ────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
  const pendingFulfillment = orders.filter((o) => o.fulfillment_status !== 'delivered').length;
  const isPaystackLive = !PAYSTACK_PUBLIC_KEY.includes('placeholder') && PAYSTACK_PUBLIC_KEY.startsWith('pk_live');

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      orderFilter === 'all' ||
      (orderFilter === 'paid' && o.payment_status === 'paid') ||
      (orderFilter === 'pending' && o.fulfillment_status === 'packing') ||
      (orderFilter === 'delivery' && o.fulfillment_status === 'out_for_delivery') ||
      (orderFilter === 'delivered' && o.fulfillment_status === 'delivered');

    const matchesSearch =
      orderSearch === '' ||
      o.reference.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_phone.includes(orderSearch);

    return matchesFilter && matchesSearch;
  });

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen pb-16">
      {/* ─── Top Banner ──────────────────────────────────────────────────── */}
      <div className="bg-store-forest text-white py-6 px-4 sm:px-8 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <ShoppingBasket className="w-4 h-4 text-white" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                Merchant Operations Hub
              </span>
              <span className="text-xs text-emerald-200">Ladydee Stores HQ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Store Control Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { loadOrders(); loadRecipes(); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-store-gold hover:bg-amber-400 text-slate-900 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Storefront
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        {/* ─── System Status Cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSupabaseConfigured ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Database</div>
              <div className="text-sm font-bold text-slate-900">
                {isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Not Configured'}
              </div>
              <div className="text-[11px] text-slate-500">
                {isSupabaseConfigured ? 'Cloud sync connected' : 'Add keys to .env to enable'}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPaystackLive ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Payments (Paystack)</div>
              <div className="text-sm font-bold text-slate-900">
                {isPaystackLive ? 'Live Mode Active' : 'Test / Sandbox Mode'}
              </div>
              <div className="text-[11px] text-slate-500">
                {isPaystackLive ? 'Real Naira card settlements' : 'Test cards accepted'}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Product Assets</div>
              <div className="text-sm font-bold text-slate-900">GitHub &amp; Static WebP</div>
              <div className="text-[11px] text-slate-500">Direct repository hosting</div>
            </div>
          </div>
        </div>

        {/* ─── KPI Metrics ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold mb-1">Total Sales Volume</div>
            <div className="text-2xl font-extrabold text-slate-900">{formatNaira(totalRevenue)}</div>
            <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> All recorded orders
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold mb-1">Total Orders</div>
            <div className="text-2xl font-extrabold text-slate-900">{orders.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Processed in store</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold mb-1">Pending Dispatch</div>
            <div className="text-2xl font-extrabold text-amber-600">{pendingFulfillment}</div>
            <div className="text-[11px] text-amber-700 mt-1">Requires rider dispatch</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold mb-1">Average Order Value</div>
            <div className="text-2xl font-extrabold text-store-forest">
              {formatNaira(orders.length ? Math.round(totalRevenue / orders.length) : 0)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Per transaction</div>
          </div>
        </div>

        {/* ─── Tab Navigation ────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
          {([
            { id: 'orders' as AdminTab, label: 'Orders & Fulfillment', icon: Package },
            { id: 'recipes' as AdminTab, label: 'Cook Tonight (Recipes)', icon: ChefHat },
            { id: 'settings' as AdminTab, label: 'Store & Social Handles', icon: Share2 },
            { id: 'tools' as AdminTab, label: 'Tools & Links', icon: Upload },
          ]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === id
                  ? 'bg-store-forest text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: ORDERS & FULFILLMENT (Supabase-only, zero mock data)
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Customer Orders</h2>
                <p className="text-xs text-slate-500">Live order fulfillment &amp; rider tracking (Supabase)</p>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'paid', label: 'Paid' },
                  { id: 'pending', label: 'Packing' },
                  { id: 'delivery', label: 'En Route' },
                  { id: 'delivered', label: 'Delivered' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setOrderFilter(btn.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                      orderFilter === btn.id
                        ? 'bg-store-forest text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by order ref, customer name, or phone…"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest"
              />
            </div>

            {/* Orders List */}
            {ordersLoading ? (
              <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-store-forest" />
                Loading orders from Supabase…
              </div>
            ) : !isSupabaseConfigured ? (
              <DataMissing
                title="Supabase Not Configured"
                message="Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env to see live orders."
              />
            ) : filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No orders found. When customers check out, their orders will appear here in real-time.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.reference}
                    className="border border-slate-200 rounded-xl p-4 hover:border-emerald-300 transition bg-slate-50/50"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900 font-mono">
                            #{ord.reference}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              ord.payment_status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.payment_status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {new Date(ord.created_at).toLocaleString('en-NG')} • {ord.delivery_zone}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-base text-slate-900">
                          {formatNaira(ord.total)}
                        </div>
                        <div className="text-[11px] text-slate-500">{ord.items.length} items</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      <div><strong>Customer:</strong> {ord.customer_name} ({ord.customer_phone})</div>
                      <div><strong>Address:</strong> {ord.delivery_address}</div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 mb-3 text-xs text-slate-600 space-y-1">
                      {ord.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.qty}x {item.name}</span>
                          <span className="font-medium text-slate-800">{formatNaira(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-store-forest" />
                        <span>Status:</span>
                        <span className="font-bold text-slate-800 capitalize">
                          {ord.fulfillment_status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {ord.fulfillment_status !== 'packing' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.reference, 'packing')}
                            className="px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold"
                          >
                            Set Packing
                          </button>
                        )}
                        {ord.fulfillment_status !== 'out_for_delivery' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.reference, 'out_for_delivery')}
                            className="px-2.5 py-1 text-[11px] rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-semibold"
                          >
                            Dispatch Rider
                          </button>
                        )}
                        {ord.fulfillment_status !== 'delivered' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.reference, 'delivered')}
                            className="px-2.5 py-1 text-[11px] rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold shadow-xs"
                          >
                            Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: COOK TONIGHT RECIPE CRUD
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            {recipeFeedback && (
              <div
                className={`p-4 rounded-2xl flex items-center gap-2 text-xs font-semibold ${
                  recipeFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {recipeFeedback.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span>{recipeFeedback.message}</span>
              </div>
            )}

            {/* Recipe Editor Modal */}
            {editingRecipe && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    {editingRecipe.id.startsWith('recipe-') ? 'New Recipe' : `Edit: ${editingRecipe.name}`}
                  </h3>
                  <button
                    onClick={() => setEditingRecipe(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Recipe Name</label>
                    <input
                      type="text"
                      value={editingRecipe.name}
                      onChange={(e) => setEditingRecipe({ ...editingRecipe, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest"
                      placeholder="e.g. Smoky Lagos Party Jollof Rice"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Category</label>
                    <input
                      type="text"
                      value={editingRecipe.category}
                      onChange={(e) => setEditingRecipe({ ...editingRecipe, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest"
                      placeholder="e.g. Rice & Grains"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Headline</label>
                    <input
                      type="text"
                      value={editingRecipe.headline}
                      onChange={(e) => setEditingRecipe({ ...editingRecipe, headline: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest"
                      placeholder="Short catchy subtitle"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Image URL</label>
                    <input
                      type="text"
                      value={editingRecipe.image}
                      onChange={(e) => setEditingRecipe({ ...editingRecipe, image: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest"
                      placeholder="e.g. /images/products/jollof-paste.webp"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Prep Time</label>
                    <input
                      type="text"
                      value={editingRecipe.prep_time}
                      onChange={(e) => setEditingRecipe({ ...editingRecipe, prep_time: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest"
                      placeholder="e.g. 20 mins"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Cook Time</label>
                    <input
                      type="text"
                      value={editingRecipe.cook_time}
                      onChange={(e) => setEditingRecipe({ ...editingRecipe, cook_time: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest"
                      placeholder="e.g. 45 mins"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Servings</label>
                    <input
                      type="number"
                      value={editingRecipe.servings}
                      onChange={(e) => setEditingRecipe({ ...editingRecipe, servings: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Difficulty</label>
                    <select
                      value={editingRecipe.difficulty}
                      onChange={(e) => setEditingRecipe({ ...editingRecipe, difficulty: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Description</label>
                  <textarea
                    value={editingRecipe.description}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest resize-y"
                    placeholder="Detailed description of this recipe…"
                  />
                </div>

                {/* Instructions Editor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold text-slate-600 uppercase">Cooking Steps</label>
                    <button
                      type="button"
                      onClick={addInstruction}
                      className="text-[11px] font-bold text-store-forest hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Step
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editingRecipe.instructions.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[10px] font-bold text-slate-400 mt-2.5 w-5 shrink-0">{idx + 1}.</span>
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => updateInstruction(idx, e.target.value)}
                          className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest"
                          placeholder={`Step ${idx + 1}…`}
                        />
                        {editingRecipe.instructions.length > 1 && (
                          <button
                            onClick={() => removeInstruction(idx)}
                            className="p-1.5 text-red-400 hover:text-red-600 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ingredients Editor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold text-slate-600 uppercase">Ingredients</label>
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="text-[11px] font-bold text-store-forest hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Ingredient
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editingRecipe.ingredients.map((ing, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                        <input
                          type="text"
                          value={ing.name}
                          onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                          className="col-span-4 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest"
                          placeholder="Ingredient name"
                        />
                        <input
                          type="text"
                          value={ing.amount}
                          onChange={(e) => updateIngredient(idx, 'amount', e.target.value)}
                          className="col-span-3 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest"
                          placeholder="Amount"
                        />
                        <input
                          type="text"
                          value={ing.productId}
                          onChange={(e) => updateIngredient(idx, 'productId', e.target.value)}
                          className="col-span-3 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest"
                          placeholder="Product ID"
                        />
                        <label className="col-span-1 flex items-center gap-1 text-[10px] text-slate-500">
                          <input
                            type="checkbox"
                            checked={ing.required}
                            onChange={(e) => updateIngredient(idx, 'required', e.target.checked)}
                            className="rounded text-store-forest"
                          />
                          Req
                        </label>
                        <button
                          onClick={() => removeIngredient(idx)}
                          className="col-span-1 p-1.5 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save / Cancel */}
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                  <button
                    onClick={handleSaveRecipe}
                    disabled={recipeSaving}
                    className="px-5 py-2.5 rounded-xl bg-store-forest text-white text-xs font-bold flex items-center gap-2 hover:bg-emerald-800 transition disabled:opacity-50"
                  >
                    {recipeSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {recipeSaving ? 'Saving…' : 'Save Recipe to Supabase'}
                  </button>
                  <button
                    onClick={() => setEditingRecipe(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Recipe List */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Cook Tonight Recipes</h2>
                  <p className="text-xs text-slate-500">Manage the recipe-to-cart experience for customers</p>
                </div>
                <button
                  onClick={handleNewRecipe}
                  className="px-4 py-2 rounded-xl bg-store-forest text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-800 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Recipe
                </button>
              </div>

              {recipesLoading ? (
                <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-store-forest" />
                  Loading recipes from Supabase…
                </div>
              ) : !isSupabaseConfigured ? (
                <DataMissing
                  title="Supabase Not Configured"
                  message="Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env to manage recipes. The client storefront will still display the static recipes from data/recipes.ts."
                />
              ) : recipes.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No recipes in Supabase yet. Click &ldquo;New Recipe&rdquo; to create one, or seed data from the SQL editor.
                </div>
              ) : (
                <div className="space-y-3">
                  {recipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {recipe.image && (
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 truncate">{recipe.name}</h4>
                          <p className="text-[11px] text-slate-500 truncate">{recipe.headline}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span>{recipe.category}</span>
                            <span>•</span>
                            <span>{recipe.difficulty}</span>
                            <span>•</span>
                            <span>Serves {recipe.servings}</span>
                            <span>•</span>
                            <span>{recipe.ingredients?.length || 0} ingredients</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleEditRecipe(recipe)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1 transition"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRecipe(recipe.id, recipe.name)}
                          disabled={recipeDeleting === recipe.id}
                          className="px-3 py-1.5 rounded-lg border border-red-200 text-[11px] font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 transition disabled:opacity-50"
                        >
                          {recipeDeleting === recipe.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: STORE & SOCIAL SETTINGS (Live sync to Supabase)
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-store-forest flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Store Contact &amp; Social Handles</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Manage all public social links, customer hotlines, and address. Updates appear live on your storefront instantly.
                </p>
              </div>

              {settingsFeedback && (
                <div
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn ${
                    settingsFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {settingsFeedback.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span>{settingsFeedback.message}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              {/* Group 1: Hotlines & Direct Messaging */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-store-forest" />
                  <span>1. Direct Hotlines &amp; Messaging</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Customer Service Phone Line
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={siteSettings.phone}
                        onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                        placeholder="e.g. +234 800 000 0000"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-store-forest outline-none text-slate-900"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Displayed on header top bar, footer, and contact desk.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      WhatsApp Business Number
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={siteSettings.whatsapp}
                        onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })}
                        placeholder="e.g. +234 800 000 0000"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-store-forest outline-none text-slate-900"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-slate-400">
                        Links to direct chat on WhatsApp across footer and contact page.
                      </span>
                      {siteSettings.whatsapp && (
                        <a
                          href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-emerald-600 hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-2.5 h-2.5" /> Test Link
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 2: Support Email & Warehouse Location */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-store-forest" />
                  <span>2. Official Email &amp; Lagos Warehouse Address</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Support Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={siteSettings.email}
                        onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                        placeholder="e.g. support@ladydeestores.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-store-forest outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Storefront Physical Address / Hub
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={siteSettings.address}
                        onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                        placeholder="e.g. Ladydee Minimart Store, Lagos, Nigeria"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-store-forest outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Delivery Coverage Zones (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={siteSettings.delivery_zones}
                      onChange={(e) => setSiteSettings({ ...siteSettings, delivery_zones: e.target.value })}
                      placeholder="e.g. Ikeja, Lekki, Victoria Island, Surulere, Yaba, Maryland"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-store-forest outline-none text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Public Social Media Handles */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-store-forest" />
                  <span>3. Public Social Media Handles (Displays in Store Footer)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Instagram */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Instagram Profile / URL
                    </label>
                    <div className="relative">
                      <Instagram className="w-4 h-4 text-pink-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={siteSettings.instagram}
                        onChange={(e) => setSiteSettings({ ...siteSettings, instagram: e.target.value })}
                        placeholder="e.g. @ladydeeminimart or https://instagram.com/ladydeeminimart"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-store-forest outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Facebook */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Facebook Page / URL
                    </label>
                    <div className="relative">
                      <Facebook className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={siteSettings.facebook}
                        onChange={(e) => setSiteSettings({ ...siteSettings, facebook: e.target.value })}
                        placeholder="e.g. ladydeeminimart or https://facebook.com/ladydeeminimart"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-store-forest outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Twitter / X */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Twitter / X Profile or URL
                    </label>
                    <div className="relative">
                      <Twitter className="w-4 h-4 text-slate-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={siteSettings.twitter}
                        onChange={(e) => setSiteSettings({ ...siteSettings, twitter: e.target.value })}
                        placeholder="e.g. @ladydeeminimart or https://twitter.com/ladydeeminimart"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-store-forest outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  {/* TikTok */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      TikTok Profile or URL
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={siteSettings.tiktok}
                        onChange={(e) => setSiteSettings({ ...siteSettings, tiktok: e.target.value })}
                        placeholder="e.g. @ladydeeminimart or https://tiktok.com/@ladydeeminimart"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-store-forest outline-none text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 4: Announcement Bar */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-store-forest" />
                  <span>4. Top Announcement Notification Banner</span>
                </h3>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Announcement Banner Text (Appears at top of every store page)
                  </label>
                  <input
                    type="text"
                    value={siteSettings.announcement}
                    onChange={(e) => setSiteSettings({ ...siteSettings, announcement: e.target.value })}
                    placeholder="e.g. Free delivery on orders over ₦50,000 across Lagos"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-store-forest outline-none text-slate-900"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="px-6 py-3 rounded-xl bg-store-forest hover:bg-emerald-900 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60"
                >
                  {settingsSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save &amp; Publish Store Settings</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={loadSettings}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Discard Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 4: TOOLS & LINKS (Static assets + external developer links)
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Local Catalog Product Image Asset Picker */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-store-forest" />
                <h3 className="text-sm font-bold text-slate-900">Store Product Assets (GitHub Hosted)</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                All 86 store products use optimized WebP images stored directly in GitHub (<code>/public/images/products/</code>). Click any asset path below to copy it for use in recipes or new inventory items:
              </p>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs font-mono">
                {[
                  '/images/products/kings-pure-vegetable-oil.webp',
                  '/images/products/knorr-chicken-seasoning-cubes.webp',
                  '/images/products/milo-big-tin.webp',
                  '/images/products/peak-full-cream-milk-powder-refill.webp',
                  '/images/products/super-pack-indomie-carton.webp',
                  '/images/products/indomie-onion-flavor-carton.webp',
                  '/images/products/spaghetti-golden-penny-carton.webp',
                  '/images/products/my-choice-rice-wholesale-bag.webp',
                  '/images/products/gino-tomato-party-jollof-paste.webp',
                  '/images/products/titus-sardines-can.webp',
                  '/images/products/exeter-corned-beef-can.webp',
                  '/images/products/golden-morn-big-size.webp',
                  '/images/products/coca-cola-plastic-pack.webp',
                  '/images/products/pepsi-plastic-pack.webp',
                  '/images/products/fanta-orange-plastic-pack.webp',
                  '/images/products/st-louis-sugar-cube-box.webp',
                  '/images/products/kisskids-diapers.webp',
                  '/images/products/bama-mayonnaise.webp',
                  '/images/products/sonia-tomato-paste.webp',
                  '/images/products/custard-3-in-1-refill.webp',
                  '/images/products/cornflakes-roll.webp'
                ].map((asset) => (
                  <div
                    key={asset}
                    onClick={() => copyAssetPath(asset)}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:border-store-forest bg-slate-50/50 cursor-pointer transition"
                  >
                    <span className="truncate">{asset}</span>
                    <span className="text-[10px] text-store-forest font-bold shrink-0 ml-2">
                      {copiedAsset === asset ? 'Copied!' : 'Copy'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links & Setup Guide */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Developer &amp; Platform Portals</h3>
              <div className="space-y-2 text-xs">
                <a
                  href="https://github.com/emmyWebsite237/Adeola-Stores"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-store-forest text-slate-700 transition"
                >
                  <span className="font-semibold">GitHub Repository (Code &amp; Assets)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a
                  href="https://dashboard.paystack.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-store-forest text-slate-700 transition"
                >
                  <span className="font-semibold">Paystack Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-store-forest text-slate-700 transition"
                >
                  <span className="font-semibold">Supabase Cloud Database</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-store-forest text-slate-700 transition"
                >
                  <span className="font-semibold">Vercel Deployment Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
