import { ChefHat, Sparkles } from 'lucide-react';
import { RECIPES } from '@/data/recipes';
import RecipeCard from '@/components/recipe/RecipeCard';

export default function CookTonightPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-brand-green via-brand-green-dark to-brand-green rounded-3xl p-6 sm:p-10 text-white shadow-card relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
            <ChefHat className="w-4 h-4 text-brand-amber" />
            <span>Recipe-to-Cart Experience</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Cook Tonight: Authentic Nigerian Dishes
          </h1>

          <p className="text-xs sm:text-sm text-brand-cream/90 leading-relaxed">
            Stop searching for 10 individual ingredients. Pick any dish below, uncheck what you already have at home, and add all required groceries directly to your basket with 1 tap.
          </p>
        </div>

        <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
          <ChefHat className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {RECIPES.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
