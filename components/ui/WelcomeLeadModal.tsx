'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag, ArrowRight, X, UserPlus, Gift } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/db/supabase';

export default function WelcomeLeadModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only check in browser
    if (typeof window === 'undefined') return;

    // Check if dismissed recently (within 24 hours)
    const dismissedAt = localStorage.getItem('ladydee_welcome_popup_dismissed');
    if (dismissedAt) {
      const hoursSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60);
      if (hoursSince < 24) return;
    }

    // Check if user is already logged in with Supabase
    async function checkAuth() {
      if (supabase && isSupabaseConfigured) {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          return; // Logged in users don't see the signup ad
        }
      }

      // Pop up gently after 7 seconds of browsing
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 7000);

      return () => clearTimeout(timer);
    }

    checkAuth();
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ladydee_welcome_popup_dismissed', Date.now().toString());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-line text-center space-y-5">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-brand-muted hover:text-brand-ink rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge & Graphic */}
        <div className="w-14 h-14 rounded-2xl bg-brand-green-soft text-brand-green mx-auto flex items-center justify-center shadow-sm">
          <Gift className="w-7 h-7 text-brand-green" />
        </div>

        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-amber text-brand-ink text-[11px] font-extrabold uppercase">
            <Sparkles className="w-3 h-3" />
            <span>Welcome Offer</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-brand-ink tracking-tight">
            Get Free Lagos Delivery
          </h3>
          <p className="text-xs text-brand-muted leading-relaxed max-w-sm mx-auto">
            Create your account today to save your Lagos delivery addresses, track rider dispatch in real-time, and unlock special wholesale bulk prices.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5 pt-2">
          <Link
            href="/signup"
            onClick={handleDismiss}
            className="w-full py-3 px-6 rounded-full bg-brand-green hover:bg-brand-green-dark text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center justify-center gap-4 text-xs text-brand-muted">
            <span>Already have an account?</span>
            <Link
              href="/login"
              onClick={handleDismiss}
              className="font-bold text-brand-green hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-[11px] text-gray-400 hover:text-brand-muted transition-colors"
        >
          No thanks, continue browsing groceries
        </button>
      </div>
    </div>
  );
}
