'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBasket, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/db/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      setErrorMsg('Supabase is not configured yet. Please check your environment variables.');
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
        router.push('/account');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-brand-line p-8 shadow-card space-y-6">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-green text-white shadow-md shadow-brand-green/20 mb-2">
            <ShoppingBasket className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-extrabold text-brand-ink">Welcome Back</h1>
          <p className="text-xs text-brand-muted">
            Sign in to track deliveries, view receipts, and manage saved Lagos addresses.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. chioma@gmail.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#fbfcfb] text-sm text-brand-ink rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-brand-green hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-[#fbfcfb] text-sm text-brand-ink rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-brand-green hover:bg-brand-green-dark text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-brand-line-2 text-center text-xs text-brand-muted">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="font-bold text-brand-green hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
