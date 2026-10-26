'use client';

import Link from 'next/link';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { formatNaira } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { setQuantity, removeItem } = useCartStore();
  const lineTotal = item.product.price * item.quantity;

  return (
    <div className="flex items-center gap-3 sm:gap-4 py-4 border-b border-brand-line-2">
      {/* Product Thumb */}
      <Link
        href={`/product/${item.product.id}`}
        className="w-16 h-16 sm:w-20 sm:h-20 bg-[#fbfcfb] rounded-xl border border-brand-line-2 p-2 flex items-center justify-center flex-shrink-0"
      >
        <img
          src={item.product.image}
          alt={item.product.name}
          className="max-h-full max-w-full object-contain"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-bold text-brand-ink truncate">
          <Link href={`/product/${item.product.id}`} className="hover:text-brand-green">
            {item.product.name}
          </Link>
        </h4>
        <p className="text-[11px] text-brand-muted mt-0.5">
          {item.product.size} · {formatNaira(item.product.price)} each
        </p>

        {/* Stepper + Remove */}
        <div className="flex items-center gap-3 mt-2.5">
          <div className="inline-flex items-center bg-[#f4f6f4] rounded-full border border-brand-line h-7">
            <button
              type="button"
              onClick={() => setQuantity(item.product.id, item.quantity - 1)}
              className="w-6 h-7 flex items-center justify-center text-brand-ink hover:text-brand-green"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3 stroke-[2.5]" />
            </button>
            <span className="min-w-6 text-center text-xs font-extrabold px-1">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(item.product.id, item.quantity + 1)}
              className="w-6 h-7 flex items-center justify-center text-brand-ink hover:text-brand-green"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.product.id)}
            className="text-gray-400 hover:text-brand-coral p-1 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Line Total */}
      <div className="text-right flex-shrink-0">
        <span className="text-xs sm:text-sm font-extrabold text-brand-ink block">
          {formatNaira(lineTotal)}
        </span>
      </div>
    </div>
  );
}
