'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChefHat, Sparkles, Send, CheckCircle2, ArrowLeft, Heart, Utensils } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/db/supabase';

export default function SuggestionsPage() {
  const [comboName, setComboName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Autofill user details if logged in
    const client = supabase;
    if (client && isSupabaseConfigured) {
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setName(session.user.user_metadata?.full_name || session.user.user_metadata?.name || '');
          setEmail(session.user.email || '');
        }
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comboName.trim()) {
      setErrorMsg('Please enter a combo or dish name.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const client = supabase;
      if (client && isSupabaseConfigured) {
        const { error } = await client.from('recipe_suggestions').insert({
          combo_name: comboName.trim(),
          ingredients: ingredients.trim() || null,
          customer_name: name.trim() || null,
          customer_email: email.trim() || null,
          notes: notes.trim() || null,
        });

        if (error) {
          console.error('Error saving suggestion:', error.message);
        }
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Failed to submit suggestion:', err);
      // Still show success to customer
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Back button */}
      <Link
        href="/cook"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-green transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Cook Tonight Recipes</span>
      </Link>

      {/* Hero Banner with Rich Emerald & Amber Cooking Theme */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#14532d] to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-900" />
            <span>Community Recipe Kitchen</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Suggest a Cooking Combo or Recipe Pack 🍲✨
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Have a special Nigerian meal or family delicacy you want pre-bundled on Ladydee Minimart? Tell us the dish name and ingredients, and our procurement team will curate it as a 1-click bundle with exact portions and market-fresh pricing!
          </p>
        </div>

        <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
          <ChefHat className="w-64 h-64 text-emerald-200" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-emerald-100/80 p-6 sm:p-10 shadow-card relative overflow-hidden">
        {submitted ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-emerald-50/80 border-2 border-emerald-200 text-center space-y-4 animate-bounceModal">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Thank You! Combo Suggestion Received!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              We loved your suggestion for <strong>&ldquo;{comboName}&rdquo;</strong>. Our kitchen &amp; procurement teams will review the recipe and notify you once it&rsquo;s available in the store!
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setComboName('');
                  setIngredients('');
                  setNotes('');
                }}
                className="px-5 py-2.5 rounded-xl border border-emerald-300 bg-white text-brand-green font-bold text-xs hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                Suggest Another Dish
              </button>

              <Link
                href="/cook"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 text-white font-extrabold text-xs hover:brightness-110 transition-colors shadow-sm"
              >
                Browse Current Recipes
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
                {errorMsg}
              </div>
            )}

            {/* Dish Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Combo / Dish Name <span className="text-brand-green">*</span>
              </label>
              <input
                type="text"
                required
                value={comboName}
                onChange={(e) => setComboName(e.target.value)}
                placeholder="e.g. Fisherman Soup & Poundo Yam, Asaro (Yam Porridge) with Smoked Catfish"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none text-xs sm:text-sm font-semibold text-slate-900"
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Key Ingredients You Want Included
              </label>
              <textarea
                rows={3}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g. Yam cubes, Palm oil, Dried fish, Ground crayfish, Fresh scent leaves, Scotch bonnets"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none text-xs sm:text-sm font-medium text-slate-900 resize-none"
              />
            </div>

            {/* Customer Details Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mrs. Adebayo"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-green outline-none text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Your Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="For launch alert: e.g. you@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-green outline-none text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* Extra Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Any Special Cooking Notes or Preferences
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Include mild pepper option, family size pack for 6 people"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-green outline-none text-xs font-medium text-slate-900"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-800 via-brand-green to-teal-800 hover:brightness-110 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'Submitting Suggestion…' : 'Submit Cooking Combo Suggestion'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
