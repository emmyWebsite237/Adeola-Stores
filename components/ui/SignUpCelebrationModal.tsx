'use client';

import Link from 'next/link';
import { Mail, ArrowRight, X, Sparkles } from 'lucide-react';

interface SignUpCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  fullName?: string;
  redirectTarget?: string;
}

export default function SignUpCelebrationModal({
  isOpen,
  onClose,
  email,
  fullName,
  redirectTarget = '/login',
}: SignUpCelebrationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-300 text-center space-y-5 animate-bounceModal overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-green via-brand-amber to-brand-green" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-brand-muted hover:text-brand-ink rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cooking & Celebration Emojis Header */}
        <div className="pt-2">
          <div className="text-4xl sm:text-5xl animate-bounce duration-1000 mb-2">
            🥘 👩‍🍳 🍲
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-amber text-brand-ink text-[11px] font-extrabold uppercase">
            <Sparkles className="w-3 h-3" />
            <span>Welcome to the Family! 🛒✨</span>
          </span>
        </div>

        {/* Main Message */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-extrabold text-brand-ink tracking-tight">
            Thank You for Joining Us! 🍲
          </h3>
          <p className="text-xs text-brand-muted leading-relaxed max-w-sm mx-auto">
            {fullName ? `Welcome, ${fullName}! ` : ''}Thank you for creating an account with{' '}
            <strong className="text-brand-ink">Ladydee Minimart Stores</strong>.
          </p>
        </div>

        {/* Email Callout Box */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
            <Mail className="w-4 h-4 text-brand-green shrink-0" />
            <span>Check Your Email for Confirmation 📬</span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            We have sent a confirmation link to:
            <br />
            <strong className="font-mono text-brand-green">{email}</strong>
          </p>
          <p className="text-[11px] text-emerald-700 leading-relaxed pt-1 border-t border-emerald-200/60">
            Please open your inbox (or spam folder) and click the link to confirm your account. Then you can start ordering your favorite rice, noodles, and fresh Lagos cooking ingredients! 🍛✨
          </p>
        </div>

        {/* Proceed Action Button */}
        <div className="pt-2 space-y-2">
          <Link
            href={redirectTarget ? `/login?redirect=${encodeURIComponent(redirectTarget)}` : '/login'}
            onClick={onClose}
            className="w-full py-3 px-6 rounded-full bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all cursor-pointer"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={onClose}
            className="text-[11px] text-gray-400 hover:text-brand-ink transition-colors font-medium block mx-auto"
          >
            I&apos;ll check my email later
          </button>
        </div>
      </div>
    </div>
  );
}
