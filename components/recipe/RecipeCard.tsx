'use client';

import { useState } from 'react';
import { ChefHat, Clock, Users, Check, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import { PRODUCTS } from '@/data/products';
import { formatNaira } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  // Initialize with all ingredient product IDs
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    recipe.ingredients.map((ing) => ing.productId)
  );
  const [showInstructions, setShowInstructions] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  // Map each recipe ingredient to its actual catalog product
  const resolvedItems = recipe.ingredients.map((ing) => {
    const matchedProduct = PRODUCTS.find((p) => p.id === ing.productId);
    return {
      ingredient: ing,
      product: matchedProduct || {
        id: ing.productId,
        name: ing.name,
        price: 1500,
        size: ing.amount,
        image: '/images/product-placeholder.svg',
        category: 'pantry-grains',
        rating: 4.8,
        reviewCount: 10,
        stock: 50,
        short: ing.name,
        description: ing.name,
        features: [],
        specs: {}
      },
    };
  });

  // Calculate live total price of only the checked items
  const activeBundleTotal = resolvedItems
    .filter((item) => selectedProductIds.includes(item.ingredient.productId))
    .reduce((sum, item) => sum + item.product.price, 0);

  const handleToggle = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddBundleToCart = () => {
    const itemsToAdd = resolvedItems.filter((item) =>
      selectedProductIds.includes(item.ingredient.productId)
    );

    itemsToAdd.forEach((item) => {
      addItem(item.product as any, 1);
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <article className="bg-white rounded-3xl border border-brand-line shadow-card overflow-hidden flex flex-col justify-between transition-all hover:border-brand-green/30">
      <div>
        {/* Hero Header */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          <img
            src={recipe.image || '/images/scene-hero.png'}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-3 py-1 rounded-full bg-brand-green text-white text-xs font-extrabold flex items-center gap-1 shadow-sm">
              <ChefHat className="w-3.5 h-3.5" />
              <span>{recipe.category}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-brand-amber text-brand-ink text-[11px] font-extrabold shadow-sm">
              {recipe.difficulty}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="font-extrabold text-base sm:text-lg leading-tight drop-shadow-sm">
              {recipe.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-200 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-amber" /> {recipe.cookTime}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-brand-amber" /> Serves {recipe.servings}
              </span>
            </div>
          </div>
        </div>

        {/* Description & Headline */}
        <div className="p-4 sm:p-5">
          <p className="text-xs text-brand-muted leading-relaxed mb-4">
            {recipe.headline}
          </p>

          {/* Interactive Checklist */}
          <div className="bg-[#fbfcfb] p-3.5 rounded-2xl border border-brand-line-2">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-ink flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-green" />
                Store Ingredients ({selectedProductIds.length}/{recipe.ingredients.length})
              </span>
              <span className="text-[10px] text-brand-muted">Uncheck if at home</span>
            </div>

            <div className="space-y-2">
              {resolvedItems.map(({ ingredient, product }) => {
                const isSelected = selectedProductIds.includes(ingredient.productId);
                return (
                  <div
                    key={ingredient.productId}
                    onClick={() => handleToggle(ingredient.productId)}
                    role="button"
                    tabIndex={0}
                    className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-brand-green/40 shadow-xs'
                        : 'bg-gray-50/70 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by row click
                        aria-label={product.name}
                        className="w-4 h-4 rounded text-brand-green focus:ring-brand-green accent-brand-green cursor-pointer shrink-0"
                      />
                      <div className="truncate">
                        <span
                          className={`text-xs font-bold block truncate ${
                            isSelected ? 'text-brand-ink' : 'text-gray-400 line-through'
                          }`}
                        >
                          {product.name}
                        </span>
                        <span className="text-[10px] text-brand-muted block">
                          {ingredient.amount}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-brand-green flex-shrink-0">
                      {formatNaira(product.price)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 sm:p-5 pt-0 border-t border-brand-line-2 flex flex-col gap-3">
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wide">
              Selected Ingredients Total
            </span>
            <span className="text-lg font-extrabold text-brand-ink">
              {formatNaira(activeBundleTotal)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showInstructions ? 'Hide Steps' : 'View Recipe Steps'}</span>
          </button>
        </div>

        {/* 1-Tap Add All Button */}
        <button
          type="button"
          onClick={handleAddBundleToCart}
          disabled={selectedProductIds.length === 0}
          className={`w-full py-3 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
            addedAnimation
              ? 'bg-brand-amber text-brand-ink'
              : selectedProductIds.length === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              : 'bg-brand-green hover:bg-brand-green-dark text-white shadow-brand-green/20'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add Selected ({selectedProductIds.length}) to Basket</span>
            </>
          )}
        </button>

        {/* Step-by-Step Cooking Instructions */}
        {showInstructions && (
          <div className="mt-3 p-4 bg-brand-cream rounded-2xl border border-brand-line-2 animate-fadeIn text-xs text-brand-ink space-y-2">
            <h4 className="font-extrabold text-brand-green uppercase tracking-wider text-[11px]">
              How to Cook {recipe.name}:
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-gray-700 leading-relaxed">
              {recipe.instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </article>
  );
}
