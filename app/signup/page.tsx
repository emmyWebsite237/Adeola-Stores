'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBasket, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured, upsertUserProfile } from '@/lib/db/supabase';

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName || !email || !password) {
      setErrorMsg('Please enter your full name, email, and a password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      setErrorMsg('Supabase is not configured yet. Please check your environment variables.');
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
        // Create initial profile in Supabase
        try {
          await upsertUserProfile({
            id: data.user.id,
            full_name: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
          });
        } catch (profileErr) {
          console.warn('Profile initialization notice:', profileErr);
        }

        if (data.session) {
          router.push('/account');
          router.refresh();
        } else {
          setSuccessMsg(
            'Account created successfully! Check your email to confirm your account or sign in.'
          );
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-brand-line p-8 shadow-card space-y-6">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-green text-white shadow-md shadow-brand-green/20 mb-2">
            <ShoppingBasket className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-extrabold text-brand-ink">Create Your Account</h1>
          <p className="text-xs text-brand-muted">
            Join Lady Dee Adeola Stores for 1-tap checkout, Lagos delivery tracking, and exclusive discounts.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Chioma Adebayo"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#fbfcfb] text-sm text-brand-ink rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

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
            <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
              Phone Number (For Lagos Dispatch)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0802 345 6789"
                className="w-full pl-10 pr-4 py-2.5 bg-[#fbfcfb] text-sm text-brand-ink rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-brand-line-2 text-center text-xs text-brand-muted">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-brand-green hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
