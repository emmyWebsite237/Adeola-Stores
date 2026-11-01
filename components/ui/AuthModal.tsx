'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBasket,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  X,
  ShieldCheck
} from 'lucide-react';
import { supabase, isSupabaseConfigured, upsertUserProfile } from '@/lib/db/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  title?: string;
  subtitle?: string;
  onSuccess?: (user: any) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'signin',
  title,
  subtitle,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      setErrorMsg('Database connection is not configured.');
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

      if (data.user) {
        if (onSuccess) onSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName || !email || !password) {
      setErrorMsg('Please enter your full name, email, and a password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      setErrorMsg('Database connection is not configured.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data.user) {
        try {
          await upsertUserProfile({
            id: data.user.id,
            full_name: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
          });
        } catch (profileErr) {
          console.warn('[AuthModal] Profile upsert notice:', profileErr);
        }

        if (data.session) {
          setSuccessMsg('Account created successfully!');
          setTimeout(() => {
            if (onSuccess) onSuccess(data.user);
            onClose();
          }, 800);
        } else {
          setSuccessMsg('Account registered! If confirmation is required, please check your inbox.');
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-line overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-brand-muted hover:text-brand-ink rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-green text-white mx-auto flex items-center justify-center shadow-md shadow-brand-green/20">
            <ShoppingBasket className="w-6 h-6" />
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-ink">
            {title || (mode === 'signin' ? 'Sign In to Continue' : 'Create Free Account')}
          </h2>

          <p className="text-xs text-brand-muted max-w-sm mx-auto leading-relaxed">
            {subtitle ||
              (mode === 'signin'
                ? 'Sign in to access your saved Lagos delivery details, track your dispatch rider, and complete your order.'
                : 'Join Ladydee Minimart to save your delivery addresses and get wholesale grocery discounts.')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'signin'
                ? 'bg-white text-brand-ink shadow-sm'
                : 'text-brand-muted hover:text-brand-ink'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'signup'
                ? 'bg-white text-brand-ink shadow-sm'
                : 'text-brand-muted hover:text-brand-ink'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 mb-4 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 mb-4 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-brand-ink block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. adeyemi@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-brand-ink">Password</label>
                <Link
                  href="/forgot-password"
                  onClick={onClose}
                  className="text-[11px] font-bold text-brand-green hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 outline-none transition-all"
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
              className="w-full py-3 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-brand-ink block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Adeola Johnson"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-ink block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. adeyemi@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-ink block mb-1">
                Phone Number (WhatsApp / Calls)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 08012345678"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-ink block mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 outline-none transition-all"
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
              className="w-full py-3 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account &amp; Proceed</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Cancel Button */}
        <div className="text-center pt-3 border-t border-slate-100 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-gray-400 hover:text-brand-ink transition-colors font-semibold"
          >
            Cancel &amp; return to browsing
          </button>
        </div>
      </div>
    </div>
  );
}
