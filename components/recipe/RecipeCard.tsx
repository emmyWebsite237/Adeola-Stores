'use client';

import { useState } from 'react';
import { ChefHat, Clock, Users, Plus, Check, ShoppingBag, Eye } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import { PRODUCTS } from '@/data/products';
import { formatNaira } from '@/lib/utils';
import { useCartStore } from '@/lib/store/useCartStore';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    recipe.ingredients.map((it) => it.productId)
  );
  const [showInstructions, setShowInstructions] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  // Match ingredients with real catalog products
  const resolvedIngredients = recipe.ingredients.map((ing) => {
    const product = PRODUCTS.find((p) => p.id === ing.productId) || PRODUCTS[0];
    return {
      ...ing,
      product,
    };
  });

  // Calculate bundle total of only the checked ingredients
  const bundleTotal = resolvedIngredients
    .filter((ing) => selectedIngredients.includes(ing.productId))
    .reduce((sum, ing) => sum + ing.product.price, 0);

  const toggleIngredient = (id: string) => {
    if (selectedIngredients.includes(id)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== id));
    } else {
      setSelectedIngredients([...selectedIngredients, id]);
    }
  };

  const handleAddAllToCart = () => {
    resolvedIngredients
      .filter((ing) => selectedIngredients.includes(ing.productId))
      .forEach((ing) => {
        addItem(ing.product, 1);
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
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-3 py-1 rounded-full bg-brand-green text-white text-xs font-extrabold flex items-center gap-1 shadow-sm">
              <ChefHat className="w-3.5 h-3.5" />
              <span>{recipe.category}</span>
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="font-extrabold text-base sm:text-lg leading-tight drop-shadow-sm">
              {recipe.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-200 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {recipe.cookTime}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Serves {recipe.servings}
              </span>
            </div>
          </div>
        </div>

        {/* Recipe Subtitle */}
        <div className="p-4 sm:p-5">
          <p className="text-xs text-brand-muted leading-relaxed mb-4">
            {recipe.headline}
          </p>

          {/* Interactive Checklist */}
          <div className="bg-[#fbfcfb] p-3.5 rounded-2xl border border-brand-line-2">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-ink">
                Ingredients Checklist ({selectedIngredients.length}/{recipe.ingredients.length})
              </span>
              <span className="text-[11px] text-brand-muted">Uncheck if you have at home</span>
            </div>

            <div className="space-y-2">
              {resolvedIngredients.map((ing) => {
                const isChecked = selectedIngredients.includes(ing.productId);
                return (
                  <label
                    key={ing.productId}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-brand-line-2 hover:border-brand-green/30 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleIngredient(ing.productId)}
                        className="w-4 h-4 rounded text-brand-green focus:ring-brand-green accent-brand-green cursor-pointer"
                      />
                      <div className="truncate">
                        <span className={`text-xs font-bold block truncate ${isChecked ? 'text-brand-ink' : 'text-gray-400 line-through'}`}>
                          {ing.product.name}
                        </span>
                        <span className="text-[10px] text-brand-muted">{ing.amount}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-brand-green flex-shrink-0">
                      {formatNaira(ing.product.price)}
                    </span>
                  </label>
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
              {formatNaira(bundleTotal)}
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
          onClick={handleAddAllToCart}
          disabled={selectedIngredients.length === 0}
          className={`w-full py-3 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
            addedAnimation
              ? 'bg-brand-amber text-brand-ink'
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
              <span>Add All {selectedIngredients.length} Ingredients to Basket</span>
            </>
          )}
        </button>

        {/* Expandable Step-by-Step Cooking Instructions */}
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
