'use client';

import { Truck, CheckCircle2 } from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';

export default function FreeDeliveryMeter() {
  const { getSubtotal, getFreeDeliveryThreshold, getFreeDeliveryGap } = useCartStore();
  const subtotal = getSubtotal();
  const threshold = getFreeDeliveryThreshold();
  const gap = getFreeDeliveryGap();
  const isFree = gap === 0 && subtotal > 0;
  const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));

  if (subtotal === 0) return null;

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        isFree
          ? 'bg-brand-green-soft border-[#c1e7cb] text-brand-green-dark'
          : 'bg-white border-brand-line text-brand-ink'
      }`}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        {isFree ? (
          <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0" />
        ) : (
          <Truck className="w-5 h-5 text-brand-amber flex-shrink-0" />
        )}
        <p className="text-xs sm:text-sm font-bold">
          {isFree ? (
            <span>🎉 Congratulations! You unlocked <strong>FREE Delivery</strong> across Lagos!</span>
          ) : (
            <span>
              Add <strong className="text-brand-green">{formatNaira(gap)}</strong> more to get <strong>FREE Lagos Delivery</strong>!
            </span>
          )}
        </p>
      </div>

      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isFree ? 'bg-brand-green' : 'bg-gradient-to-r from-brand-amber to-brand-green'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
