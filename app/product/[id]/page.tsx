'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, Plus, Minus, MessageCircle, CheckCircle2 } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { formatNaira, calculateDiscount, generateWhatsAppLink } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';
import ProductCard from '@/components/product/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  const { addItem, toggleWishlist, isInWishlist } = useCartStore();
  const [qty, setQty] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  const isWished = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.oldPrice);
  const isOutOfStock = product.stock <= 0;

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, qty);
    router.push('/checkout');
  };

  const whatsappMessage = `Hello Aunt Adeola, I would like to order: ${product.name} (${product.size}) - ${formatNaira(product.price * qty)} (Qty: ${qty})`;
  const waLink = generateWhatsAppLink('08000000000', whatsappMessage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-brand-muted">
        <Link href="/" className="hover:text-brand-green">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-green">Shop</Link>
        <span>/</span>
        <span className="text-brand-ink font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Media / Image */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-brand-line p-8 flex items-center justify-center relative aspect-square shadow-soft">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
          {discount > 0 && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand-coral text-white text-xs font-extrabold uppercase shadow-sm">
              Save {discount}%
            </span>
          )}
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label="Wishlist toggle"
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
              isWished
                ? 'bg-brand-coral text-white border-brand-coral'
                : 'bg-white text-brand-muted hover:text-brand-coral border-brand-line'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWished ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Info & Action */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-brand-green uppercase tracking-wider block mb-1">
              {product.category.replace(/-/g, ' ')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 text-xs text-brand-muted mt-2">
              <span className="font-semibold text-brand-ink">{product.size}</span>
              <span>·</span>
              <span className="text-brand-green font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isOutOfStock ? 'Out of Stock' : 'In Stock — Ready to Dispatch'}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-brand-line-2">
            <span className="text-3xl font-extrabold text-brand-green">
              {formatNaira(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-base text-gray-400 line-through">
                {formatNaira(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="text-sm text-brand-muted leading-relaxed">
            {product.description}
          </p>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-brand-ink">Quantity:</span>
              <div className="inline-flex items-center bg-[#f4f6f4] rounded-full border border-brand-line h-10 px-1">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-brand-ink hover:bg-white"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4 stroke-[2.5]" />
                </button>
                <span className="w-10 text-center text-sm font-extrabold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(Math.min(99, qty + 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-brand-ink hover:bg-white"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  added
                    ? 'bg-brand-amber text-brand-ink'
                    : 'bg-brand-green hover:bg-brand-green-dark text-white shadow-brand-green/20'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{added ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="py-3.5 px-6 rounded-full font-bold text-sm bg-white hover:bg-brand-green-soft text-brand-ink border border-brand-line transition-all text-center"
              >
                Buy Now (Checkout)
              </button>
            </div>

            {/* WhatsApp Direct Order Button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 rounded-full font-bold text-xs bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order on WhatsApp directly</span>
            </a>
          </div>

          {/* Trust Perks */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-brand-line-2 text-xs text-brand-muted">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-green" />
              <span>Free delivery on orders over ₦50,000</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-amber" />
              <span>100% Sealed &amp; Quality Checked</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-brand-green" />
              <span>48-Hour Replacement on damaged goods</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>Pay on Delivery available in Lagos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-brand-line-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-ink mb-6">
            Frequently Bought Together in this Aisle
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
