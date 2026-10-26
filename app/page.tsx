import Link from 'next/link';
import { ArrowRight, Sparkles, ChefHat, Tag, ShieldCheck, Clock, Truck } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { RECIPES } from '@/data/recipes';
import { BUNDLE_PACKS } from '@/data/bundles';
import ProductCard from '@/components/product/ProductCard';
import RecipeCard from '@/components/recipe/RecipeCard';
import { formatNaira } from '@/lib/utils';

export default function HomePage() {
  const featuredProducts = PRODUCTS.slice(0, 8);
  const dealProducts = PRODUCTS.filter((p) => p.oldPrice).slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#edf9f0] via-[#f7faf8] to-[#fafbf9] py-12 sm:py-20 border-b border-brand-line-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#c1e7cb] text-brand-green text-xs font-bold shadow-sm">
                <Truck className="w-4 h-4 text-brand-amber" />
                <span>Same-Day Market Delivery Across Lagos</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-brand-ink tracking-tight leading-[1.15]">
                Your market run, <br />
                <span className="text-brand-green italic font-serif">done in minutes.</span>
              </h1>

              <p className="text-sm sm:text-base text-brand-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Rice by the bag, noodles, milk, pure vegetable oil, canned foods and baby essentials — all sealed, fairly priced, and brought straight to your door across Nigeria.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-green hover:bg-brand-green-dark text-white font-bold text-sm shadow-md shadow-brand-green/25 transition-all text-center"
                >
                  Start Shopping
                </Link>
                <Link
                  href="/cook"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-brand-green-soft border border-brand-line text-brand-ink font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <ChefHat className="w-4 h-4 text-brand-green" />
                  <span>Cook Tonight (Recipes)</span>
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="pt-6 border-t border-brand-line-2 flex items-center justify-center lg:justify-start gap-8 text-left">
                <div>
                  <span className="font-extrabold text-xl sm:text-2xl text-brand-ink block">78+</span>
                  <span className="text-xs text-brand-muted font-medium">Original Staples</span>
                </div>
                <div className="h-8 w-px bg-brand-line" />
                <div>
                  <span className="font-extrabold text-xl sm:text-2xl text-brand-ink block">7</span>
                  <span className="text-xs text-brand-muted font-medium">Delivery Zones</span>
                </div>
                <div className="h-8 w-px bg-brand-line" />
                <div>
                  <span className="font-extrabold text-xl sm:text-2xl text-brand-green block">₦50,000</span>
                  <span className="text-xs text-brand-muted font-medium">Free Delivery</span>
                </div>
              </div>
            </div>

            {/* Hero Artwork */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/images/scene-hero.png"
                  alt="Stocked Nigerian groceries"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-green-soft text-brand-green flex items-center justify-center font-bold">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-ink block">Free Lagos Delivery</span>
                    <span className="text-[10px] text-brand-muted">Orders over ₦50,000</span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-amber-soft text-brand-amber-dark flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-ink block">Sealed &amp; Fresh</span>
                    <span className="text-[10px] text-brand-muted">Checked before dispatch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE KILLER FEATURE: "COOK TONIGHT" (RECIPE-TO-CART HUB) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green-soft text-brand-green text-xs font-bold mb-2">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Nigerian Recipe-to-Cart Feature</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-ink tracking-tight">
              What are we cooking today?
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1">
              Pick a dish. Check what you already have at home, and add all remaining fresh ingredients into your basket in one tap!
            </p>
          </div>
          <Link
            href="/cook"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-green hover:underline flex-shrink-0"
          >
            <span>See All Recipes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {RECIPES.slice(0, 2).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* 3. EXTRA PLATE: "HOUSEHOLD BUNDLES & MARKET PACKS" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-brand-ink via-[#16291f] to-brand-ink rounded-3xl p-6 sm:p-10 text-white shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold tracking-wider uppercase text-brand-amber block mb-1">
                Value Bundles &amp; Packs
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Save Big with Aunt Adeola Packs
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
                Bulk food bundles put together for Nigerian homes. Stack groceries together and pay far less than buying individual pieces!
              </p>
            </div>
            <Link
              href="/bundles"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-amber text-brand-ink text-xs font-bold hover:bg-brand-amber/90 transition-all flex-shrink-0"
            >
              <span>Explore All Bundles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BUNDLE_PACKS.map((bundle) => (
              <div
                key={bundle.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-coral text-white text-[10px] font-extrabold uppercase">
                      {bundle.badge}
                    </span>
                    <span className="text-[11px] text-gray-300 font-medium">
                      {bundle.itemsCount} Items
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-white mb-1.5 leading-snug">
                    {bundle.name}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed mb-4">
                    {bundle.tagline}
                  </p>

                  <div className="space-y-1.5 border-t border-white/10 pt-3 mb-4">
                    {bundle.items.slice(0, 3).map((it, idx) => (
                      <p key={idx} className="text-xs text-gray-300 flex items-center justify-between">
                        <span>• {it.name}</span>
                        <span className="text-brand-amber text-[11px]">{it.size}</span>
                      </p>
                    ))}
                    {bundle.items.length > 3 && (
                      <p className="text-[11px] text-gray-400 italic">
                        + {bundle.items.length - 3} more pantry staples
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-lg font-extrabold text-brand-amber block leading-none">
                      {formatNaira(bundle.price)}
                    </span>
                    <span className="text-[10px] text-gray-400 line-through">
                      {formatNaira(bundle.oldPrice)}
                    </span>
                  </div>
                  <Link
                    href="/bundles"
                    className="px-4 py-2 rounded-full bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold transition-colors"
                  >
                    View Pack
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FLASH DEALS / PRICE DROPS */}
      {dealProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-coral-soft text-brand-coral flex items-center justify-center font-bold">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-ink">Price Drops &amp; Deals</h2>
                <p className="text-xs text-brand-muted">Discounted while stock lasts — no coupon needed.</p>
              </div>
            </div>
            <Link href="/shop" className="text-xs font-bold text-brand-green hover:underline">
              See All Deals &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {dealProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 5. POPULAR EVERYDAY GROCERIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-ink">Popular This Week</h2>
            <p className="text-xs text-brand-muted">The staples Nigerian households reorder most.</p>
          </div>
          <Link href="/shop" className="text-xs font-bold text-brand-green hover:underline">
            Browse All {PRODUCTS.length} Items &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
