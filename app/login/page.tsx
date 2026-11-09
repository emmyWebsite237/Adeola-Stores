'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBasket, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/db/supabase';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    if (!supabase || !isSupabaseConfigured) {
      setErrorMsg('Database connection missing for Google Sign In.');
      return;
    }
    setGoogleLoading(true);
    setErrorMsg(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}${redirectTarget}`,
        },
      });
      if (error) {
        setErrorMsg(error.message);
        setGoogleLoading(false);
      }
    } catch (gErr: any) {
      setErrorMsg(gErr.message || 'Google sign-in failed');
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      setErrorMsg('Service is temporarily unavailable. Please try again shortly.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data.session) {
        router.push(redirectTarget);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-[#f7f9f6] via-white to-emerald-50/40 flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative Brand Ambience Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-200/35 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-emerald-100 shadow-2xl shadow-emerald-950/10 p-7 sm:p-9 space-y-6 relative z-10 backdrop-blur-sm">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-800 via-brand-green to-teal-800 text-white flex items-center justify-center shadow-lg shadow-emerald-900/25 mb-3 border border-emerald-400/40 group-hover:scale-105 transition-transform">
              <ShoppingBasket className="w-7 h-7 text-white" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-[11px] font-black uppercase tracking-wider border border-emerald-200 shadow-2xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Ladydee Minimart Lagos
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-ink tracking-tight">Welcome Back 👋</h1>
          <p className="text-xs text-brand-muted leading-relaxed">
            {redirectTarget === '/checkout'
              ? 'Sign in to access your saved Lagos delivery address & instant checkout.'
              : 'Sign in to your customer account to track orders & manage your digital wallet.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Google Sign In */}
        <div>
          <button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 px-4 rounded-2xl border-2 border-slate-200 hover:border-brand-green hover:bg-emerald-50/40 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-2xs disabled:opacity-60"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-green" />
                <span>Connecting to Google…</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              <span className="bg-white px-3">or continue with email</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-extrabold text-brand-ink uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-emerald-500/20 text-xs font-semibold text-brand-ink outline-none transition-all bg-slate-50/40 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-emerald-700 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-extrabold text-brand-ink uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-bold text-brand-green hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-emerald-500/20 text-xs font-semibold text-brand-ink outline-none transition-all bg-slate-50/40 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-emerald-700 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-800 via-brand-green to-teal-800 hover:brightness-110 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" /> Signing In...
              </>
            ) : (
              <>
                Sign In to Account <ArrowRight className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        </form>

        <div className="space-y-4 pt-3 border-t border-slate-100">
          <div className="text-center text-xs text-brand-muted">
            Don&apos;t have an account yet?{' '}
            <Link
              href={redirectTarget ? `/signup?redirect=${encodeURIComponent(redirectTarget)}` : '/signup'}
              className="font-extrabold text-brand-green hover:underline"
            >
              Create one now
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-800/80 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
            <span>256-Bit SSL Encrypted • Ladydee Customer Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-brand-green" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
