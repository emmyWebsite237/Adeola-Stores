'use client';

import Link from 'next/link';
import { Heart, Plus, Minus } from 'lucide-react';
import { Product } from '@/types/product';
import { formatNaira, calculateDiscount } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact }: ProductCardProps) {
  const { addItem, setQuantity, getItemQuantity, toggleWishlist, isInWishlist } = useCartStore();
  const quantity = getItemQuantity(product.id);
  const isWished = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.oldPrice);
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group bg-white rounded-2xl border border-brand-line hover:border-brand-green/30 hover:shadow-card transition-all flex flex-col justify-between overflow-hidden relative">
      {/* Product Media Box */}
      <div className="relative aspect-square bg-[#fbfcfb] p-4 flex items-center justify-center overflow-hidden">
        <Link href={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Tags */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-brand-coral text-white text-[10px] font-extrabold uppercase">
              −{discount}%
            </span>
          )}
          {product.badge === 'bestseller' && (
            <span className="px-2 py-0.5 rounded-full bg-brand-amber text-brand-ink text-[10px] font-extrabold uppercase">
              Popular
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 rounded-full bg-gray-500 text-white text-[10px] font-extrabold uppercase">
              Out of stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWished
              ? 'bg-brand-coral text-white shadow-sm'
              : 'bg-white/80 hover:bg-white text-brand-muted hover:text-brand-coral border border-brand-line'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Body */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] font-semibold text-brand-muted block capitalize truncate mb-1">
            {product.category.replace(/-/g, ' ')}
          </span>
          <h3 className="font-bold text-xs sm:text-sm text-brand-ink line-clamp-2 group-hover:text-brand-green transition-colors leading-snug">
            <Link href={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <span className="text-[11px] font-medium text-brand-muted mt-1 block">
            {product.size}
          </span>
        </div>

        {/* Foot / Pricing & Add Button */}
        <div className="mt-3 pt-3 border-t border-brand-line-2 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-extrabold text-xs sm:text-sm text-brand-ink tracking-tight">
              {formatNaira(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[10px] text-gray-400 line-through">
                {formatNaira(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Interactive Chowdeck / Instacart Stepper */}
          {isOutOfStock ? (
            <button
              disabled
              className="px-2.5 py-1.5 rounded-full bg-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed"
            >
              Out
            </button>
          ) : quantity > 0 ? (
            <div className="inline-flex items-center bg-brand-green text-white rounded-full shadow-sm overflow-hidden h-8">
              <button
                type="button"
                onClick={() => setQuantity(product.id, quantity - 1)}
                className="w-7 h-8 flex items-center justify-center hover:bg-brand-green-dark transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="min-w-6 text-center text-xs font-extrabold px-1 select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(product.id, quantity + 1)}
                className="w-7 h-8 flex items-center justify-center hover:bg-brand-green-dark transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => addItem(product, 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-green text-white text-xs font-bold hover:bg-brand-green-dark shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
