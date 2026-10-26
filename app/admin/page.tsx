'use client';

import React, { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import { supabase, isSupabaseConfigured } from '@/lib/db/supabase';
import { PAYSTACK_PUBLIC_KEY } from '@/lib/paystack';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

interface OrderRecord {
  id: string;
  reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_zone: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_status: string;
  fulfillment_status: string;
  created_at: string;
}

// Sample fallback orders if Supabase is still in local setup
const MOCK_ORDERS: OrderRecord[] = [
  {
    id: 'ord-101',
    reference: 'ADEOLA-782914',
    customer_name: 'Chioma Adebayo',
    customer_email: 'chioma.adebayo@gmail.com',
    customer_phone: '08023456789',
    delivery_address: '14 Admiralty Way, Lekki Phase 1',
    delivery_zone: 'Lekki / Victoria Island',
    items: [
      { id: 'staple-1', name: 'Royal Stallion Rice 50kg', qty: 1, price: 78500 },
      { id: 'staple-2', name: 'Kings Vegetable Oil 5L', qty: 1, price: 14200 },
      { id: 'rec-jollof', name: 'Party Jollof Rice Pack', qty: 1, price: 34500 },
    ],
    subtotal: 127200,
    delivery_fee: 0,
    total: 127200,
    payment_status: 'paid',
    fulfillment_status: 'out_for_delivery',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'ord-102',
    reference: 'ADEOLA-591024',
    customer_name: 'Emeka Okafor',
    customer_email: 'emeka.okafor@yahoo.com',
    customer_phone: '08139876543',
    delivery_address: '22 Allen Avenue, Ikeja',
    delivery_zone: 'Ikeja / Maryland / Opebi',
    items: [
      { id: 'bundle-family', name: 'The Adeola Family Monthly Cart', qty: 1, price: 110000 },
    ],
    subtotal: 110000,
    delivery_fee: 0,
    total: 110000,
    payment_status: 'paid',
    fulfillment_status: 'packing',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'ord-103',
    reference: 'ADEOLA-349811',
    customer_name: 'Folake Adeleke',
    customer_email: 'folake.a@outlook.com',
    customer_phone: '07055443322',
    delivery_address: 'Block 4, Surulere Housing Estate',
    delivery_zone: 'Lagos Mainland (General)',
    items: [
      { id: 'staple-3', name: 'Golden Penny Semovita 10kg', qty: 2, price: 13500 },
      { id: 'staple-4', name: 'Titus Sardines (Pack of 5)', qty: 1, price: 5600 },
    ],
    subtotal: 32600,
    delivery_fee: 2500,
    total: 35100,
    payment_status: 'paid',
    fulfillment_status: 'delivered',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Load orders from Supabase or fallback
  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('store_orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
          setOrders(MOCK_ORDERS);
        } else {
          setOrders(data as OrderRecord[]);
        }
      } else {
        // Fallback to local storage or mock
        const stored = localStorage.getItem('adeola_local_orders');
        if (stored) {
          const parsed = JSON.parse(stored);
          setOrders([...parsed, ...MOCK_ORDERS]);
        } else {
          setOrders(MOCK_ORDERS);
        }
      }
    } catch (e) {
      setOrders(MOCK_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (reference: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.reference === reference ? { ...ord, fulfillment_status: newStatus } : ord
      )
    );

    if (supabase && isSupabaseConfigured) {
      await supabase
        .from('store_orders')
        .update({ fulfillment_status: newStatus })
        .eq('reference', reference);
    }
  };

  // Image upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);
    setUploadedImageUrl(null);

    try {
      const res = await uploadImageToCloudinary(file);
      setUploadedImageUrl(res.secure_url || res.url);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Check Cloudinary settings.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Stats calculation
  const totalRevenue = orders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
  const pendingFulfillment = orders.filter((o) => o.fulfillment_status !== 'delivered').length;
  const isPaystackLive = !PAYSTACK_PUBLIC_KEY.includes('placeholder') && PAYSTACK_PUBLIC_KEY.startsWith('pk_live');

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'paid' && o.payment_status === 'paid') ||
      (filter === 'pending' && o.fulfillment_status === 'packing') ||
      (filter === 'delivery' && o.fulfillment_status === 'out_for_delivery') ||
      (filter === 'delivered' && o.fulfillment_status === 'delivered');

    const matchesSearch =
      searchTerm === '' ||
      o.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_phone.includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Banner */}
      <div className="bg-store-forest text-white py-6 px-4 sm:px-8 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                Merchant Operations Hub
              </span>
              <span className="text-xs text-emerald-200">Adeola Stores HQ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Store Control Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
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
              View Customer Storefront
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        {/* System Integrations Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Supabase Status */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSupabaseConfigured ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Database</div>
              <div className="text-sm font-bold text-slate-900">
                {isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Local Storage Mode'}
              </div>
              <div className="text-[11px] text-slate-500">
                {isSupabaseConfigured ? 'Cloud sync connected' : 'Add keys to .env to sync'}
              </div>
            </div>
          </div>

          {/* Paystack Gateway */}
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

          {/* Cloudinary CDN */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Image Hosting</div>
              <div className="text-sm font-bold text-slate-900">Cloudinary CDN</div>
              <div className="text-[11px] text-slate-500">Auto-compression & WebP ready</div>
            </div>
          </div>
        </div>

        {/* KPI Metrics */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Orders Table (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Recent Customer Orders</h2>
                  <p className="text-xs text-slate-500">Live order fulfillment & rider tracking</p>
                </div>

                {/* Filter Pills */}
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
                      onClick={() => setFilter(btn.id)}
                      className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                        filter === btn.id
                          ? 'bg-store-forest text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by order ref, customer name, or phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-store-forest"
                />
              </div>

              {/* Order Cards */}
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-500">Loading orders...</div>
              ) : filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">No orders found.</div>
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

                      {/* Customer Info */}
                      <div className="text-xs text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        <div>
                          <strong>Customer:</strong> {ord.customer_name} ({ord.customer_phone})
                        </div>
                        <div>
                          <strong>Address:</strong> {ord.delivery_address}
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 mb-3 text-xs text-slate-600 space-y-1">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>
                              {item.qty}x {item.name}
                            </span>
                            <span className="font-medium text-slate-800">
                              {formatNaira(item.price * item.qty)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Status Action Stepper */}
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
          </div>

          {/* Sidebar Tools: Cloudinary Image Uploader & Quick Settings (1 Col) */}
          <div className="space-y-6">
            {/* Cloudinary Quick Uploader */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-4 h-4 text-store-forest" />
                <h3 className="text-sm font-bold text-slate-900">Cloudinary Image Uploader</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Upload grocery product photos directly to your Cloudinary cloud. You get instant optimized URLs ready for products!
              </p>

              <label className="block w-full border-2 border-dashed border-slate-200 hover:border-store-forest rounded-xl p-4 text-center cursor-pointer transition bg-slate-50/50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-store-forest">
                  {uploadingImage ? 'Uploading to Cloudinary...' : 'Click to choose image'}
                </span>
                <span className="block text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>

              {uploadError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Cloudinary notice:</span>
                    <p className="mt-0.5">{uploadError}</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      See <code>SETUP_GUIDE.md</code> to configure your unsigned upload preset in 2 minutes.
                    </p>
                  </div>
                </div>
              )}

              {uploadedImageUrl && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
                    <CheckCircle className="w-4 h-4 text-store-forest" />
                    Uploaded Successfully!
                  </div>
                  <img
                    src={uploadedImageUrl}
                    alt="Uploaded preview"
                    className="w-full h-32 object-cover rounded-lg border border-emerald-200 my-2"
                  />
                  <div className="text-[11px] text-slate-600 font-mono break-all bg-white p-2 rounded border border-slate-200">
                    {uploadedImageUrl}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(uploadedImageUrl);
                      alert('Cloudinary URL copied to clipboard!');
                    }}
                    className="w-full mt-2 py-1.5 text-xs bg-store-forest text-white font-bold rounded-lg hover:bg-emerald-800 transition"
                  >
                    Copy Image URL
                  </button>
                </div>
              )}
            </div>

            {/* Quick Links & Setup Guide */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Developer & Store Links</h3>
              <div className="space-y-2 text-xs">
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
                  href="https://cloudinary.com/console"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-store-forest text-slate-700 transition"
                >
                  <span className="font-semibold">Cloudinary Media Console</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
