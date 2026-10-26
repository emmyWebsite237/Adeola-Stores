'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Printer, ArrowRight, ShoppingBasket } from 'lucide-react';
import { formatNaira } from '@/lib/utils';

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('latest_order');
    if (saved) {
      try {
        setOrder(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-brand-line p-6 sm:p-10 shadow-card text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-brand-green-soft text-brand-green flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-xs font-bold text-brand-green uppercase tracking-wider block mb-1">
            Order Confirmed &amp; Received
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink">
            Thank you for shopping with Aunt Adeola!
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-md mx-auto">
            Your grocery order is now confirmed. We are packing your sealed items for dispatch.
          </p>
        </div>

        {order && (
          <div className="bg-brand-cream rounded-2xl p-5 border border-brand-line-2 text-left space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-brand-line-2 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">Order Reference</span>
                <span className="font-extrabold text-brand-ink text-sm">{order.reference}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">Payment Method</span>
                <span className="font-bold text-brand-green">{order.method}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">Delivery Zone</span>
                <span className="font-bold text-brand-ink">{order.zone}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[11px] font-extrabold uppercase text-brand-ink block mb-1">
                Ordered Groceries:
              </span>
              {order.items?.map((it: any) => (
                <div key={it.id} className="flex justify-between text-gray-700 py-1">
                  <span>
                    • {it.product.name} ({it.product.size}) × {it.quantity}
                  </span>
                  <span className="font-bold text-brand-ink">
                    {formatNaira(it.product.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-brand-line-2 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : formatNaira(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-brand-ink text-sm pt-2 border-t border-brand-line-2">
                <span>Total Paid</span>
                <span className="text-brand-green">{formatNaira(order.total)}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-gray-500">
              <p>
                <strong>Delivering to:</strong> {order.name} ({order.phone}), {order.address}, {order.city}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-full bg-white border border-brand-line hover:bg-gray-50 text-xs font-bold text-brand-ink flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <Link
            href="/account"
            className="px-6 py-2.5 rounded-full bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold shadow-md shadow-brand-green/20 flex items-center gap-1.5"
          >
            <span>Track Order Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
