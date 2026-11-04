import { ChefHat, Sparkles, MessageSquarePlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { RECIPES } from '@/data/recipes';
import RecipeCard from '@/components/recipe/RecipeCard';

export default function CookTonightPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
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

      {/* More Cooking Combos Coming Soon - Suggestion Section */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-emerald-50/60 to-emerald-100/50 border-2 border-emerald-200/80 p-6 sm:p-10 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-900 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>New Combos Loading</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            More Cooking Combos Coming Soon! 🍲✨
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            What Nigerian meal combos do you think we should add next? Tell us your favorite weekend stews, soups, or breakfast combos and our market chefs will curate them with 1-click grocery packs!
          </p>
        </div>

        <Link
          href="/suggestions"
          className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-brand-green hover:bg-brand-green-dark text-white font-black text-sm shadow-lg shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <MessageSquarePlus className="w-5 h-5 text-amber-300" />
          <span>Suggest a Cooking Combo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
