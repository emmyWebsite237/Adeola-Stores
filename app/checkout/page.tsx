'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, CreditCard, Banknote, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { DELIVERY_ZONES } from '@/data/products';
import { formatNaira } from '@/lib/utils';
import { openPaystackModal } from '@/lib/paystack';

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

  const [name, setName] = useState('Emmy Ade');
  const [email, setEmail] = useState('emmy@example.com');
  const [phone, setPhone] = useState('08012345678');
  const [address, setAddress] = useState('12 Admiralty Way, Lekki Phase 1');
  const [city, setCity] = useState('Lagos');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'delivery'>('paystack');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();
  const count = getTotalCount();
  const vat = Math.round((subtotal - discount) * 0.075);

  const selectedZone = DELIVERY_ZONES.find((z) => z.id === zoneId) || DELIVERY_ZONES[0];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

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

    const orderRef = 'LDM-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    // If online payment (Paystack)
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

          clearCart();
          router.push('/checkout/confirmation');
        },
        onClose: () => {
          setBusy(false);
        },
      });
    } else {
      // Pay on Delivery
      setTimeout(() => {
        setBusy(false);
        sessionStorage.setItem(
          'latest_order',
          JSON.stringify({
            reference: orderRef,
            name,
            email,
            phone,
            address,
            city,
            zone: selectedZone.name,
            items,
            total,
            subtotal,
            deliveryFee,
            date: new Date().toISOString(),
            method: 'Pay on Delivery (Pending)',
          })
        );
        clearCart();
        router.push('/checkout/confirmation');
      }, 1000);
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
          {/* Customer Details */}
          <div className="bg-white rounded-3xl border border-brand-line p-6 shadow-soft space-y-4">
            <h3 className="text-xs font-extrabold text-brand-ink uppercase tracking-wider">
              1. Recipient &amp; Delivery Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-brand-ink block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-line text-xs font-semibold text-brand-ink outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-ink block mb-1">Phone Number (Calling/WhatsApp)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-line text-xs font-semibold text-brand-ink outline-none focus:border-brand-green"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-brand-ink block mb-1">Email Address (For Receipt)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-line text-xs font-semibold text-brand-ink outline-none focus:border-brand-green"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-brand-ink block mb-1">Street Address / Estate / Flat</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House 4, Palmview Estate, Lekki"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-line text-xs font-semibold text-brand-ink outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-ink block mb-1">City / State</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-line text-xs font-semibold text-brand-ink outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-ink block mb-1">Delivery Zone</label>
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-line text-xs font-semibold text-brand-ink outline-none focus:border-brand-green bg-white cursor-pointer"
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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before coming, gate color is blue"
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-line text-xs font-semibold text-brand-ink outline-none focus:border-brand-green"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl border border-brand-line p-6 shadow-soft space-y-3">
            <h3 className="text-xs font-extrabold text-brand-ink uppercase tracking-wider">
              2. Select Payment Method
            </h3>

            <div className="space-y-2.5">
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'paystack'
                    ? 'border-brand-green bg-brand-green-soft text-brand-green-dark shadow-sm'
                    : 'border-brand-line bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payMethod"
                    checked={paymentMethod === 'paystack'}
                    onChange={() => setPaymentMethod('paystack')}
                    className="accent-brand-green"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm block">Pay Online via Paystack</span>
                    <span className="text-[11px] text-brand-muted">Debit Card, Direct Bank Transfer, USSD, OPay</span>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-brand-green" />
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'delivery'
                    ? 'border-brand-green bg-brand-green-soft text-brand-green-dark shadow-sm'
                    : 'border-brand-line bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payMethod"
                    checked={paymentMethod === 'delivery'}
                    onChange={() => setPaymentMethod('delivery')}
                    className="accent-brand-green"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm block">Pay on Delivery</span>
                    <span className="text-[11px] text-brand-muted">Cash or POS transfer upon arrival (Lagos Only)</span>
                  </div>
                </div>
                <Banknote className="w-5 h-5 text-brand-amber" />
              </label>
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
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
                </Link>{' '}
                and the{' '}
                <Link href="/returns" className="text-brand-green font-bold underline" target="_blank">
                  Return &amp; Refund Policy
                </Link>
                .
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

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 rounded-full bg-brand-green hover:bg-brand-green-dark text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{busy ? 'Processing Payment…' : `Pay ${formatNaira(total)}`}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
