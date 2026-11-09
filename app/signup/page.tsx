'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  AtSign,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { supabase, isSupabaseConfigured, upsertUserProfile } from '@/lib/db/supabase';
import RobotVerification from '@/components/ui/RobotVerification';
import SignUpCelebrationModal from '@/components/ui/SignUpCelebrationModal';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/account';

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Security Check
  const [isRobotVerified, setIsRobotVerified] = useState(false);

  // State
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleGoogleSignIn = async () => {
    if (!supabase || !isSupabaseConfigured) {
      setErrorMsg('Database configuration missing for Google Sign In.');
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
      setErrorMsg(gErr.message || 'Google Sign-In failed');
      setGoogleLoading(false);
    }
  };

  const validateUsername = (u: string) => {
    // Must contain both letters and numbers, at least 3 characters
    const hasLetter = /[a-zA-Z]/.test(u);
    const hasNumber = /[0-9]/.test(u);
    return hasLetter && hasNumber && u.length >= 3;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Basic Fields validation
    if (!fullName.trim() || !username.trim() || !email.trim() || !phone.trim() || !dob || !password || !confirmPassword) {
      setErrorMsg('Please fill in all registration fields including Date of Birth.');
      return;
    }

    // 2. Username validation (must be mixture of letters and numbers)
    const cleanUsername = username.trim().toLowerCase();
    if (!validateUsername(cleanUsername)) {
      setErrorMsg('Username must be a combination of letters and numbers (e.g. emmy237, ladydee01).');
      return;
    }

    // 4. Terms agreement
    if (!termsAgreed) {
      setErrorMsg('You must agree to the Terms of Service & Privacy Policy to create an account.');
      return;
    }

    // 5. Password match validation
    if (password !== confirmPassword) {
      setErrorMsg('Create Password and Confirm Password do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    // 6. Robot check validation
    if (!isRobotVerified) {
      setErrorMsg('Please complete the "I am not a robot" verification check below.');
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      setErrorMsg('Database is not configured yet. Please check your environment variables.');
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
            username: cleanUsername,
            phone: phone.trim(),
            date_of_birth: dob,
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
            date_of_birth: dob,
          } as any);
        } catch (profileErr) {
          console.warn('[Signup] Profile initial notice:', profileErr);
        }

        // Send Brevo welcome email (falls back gracefully if daily 300 limit reached)
        try {
          await fetch('/api/auth/welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email.trim(),
              fullName: fullName.trim(),
              username: cleanUsername,
            }),
          });
        } catch (welcomeErr) {
          console.warn('[Signup] Brevo welcome email notice:', welcomeErr);
        }

        // Bring up the celebratory bouncing modal
        setShowCelebration(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-[#f7f9f6] via-white to-emerald-50/40 flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative Brand Ambience Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-200/35 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-white rounded-3xl border border-emerald-100 shadow-2xl shadow-emerald-950/10 p-6 sm:p-10 space-y-6 relative z-10 backdrop-blur-sm">
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
          <h1 className="text-2xl sm:text-3xl font-black text-brand-ink tracking-tight">Create Your Account</h1>
          <p className="text-xs text-brand-muted max-w-sm mx-auto leading-relaxed">
            {redirectTarget === '/checkout'
              ? 'Sign up to safely save your Lagos delivery address & complete checkout.'
              : 'Join Ladydee Minimart for wholesale price drops, lightning dispatch, and easy grocery reorders.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn font-medium">
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
              <span className="bg-white px-3">or create with email</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* 1. Full Name */}
          <div>
            <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Emmanuel Samson"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green outline-none transition-all"
              />
            </div>
          </div>

          {/* 2. Username (letters + numbers) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-brand-ink uppercase tracking-wider">
                Username
              </label>
              <span className="text-[10px] text-brand-muted">
                Letters &amp; numbers (e.g. emmy237)
              </span>
            </div>
            <div className="relative">
              <AtSign className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. emmy237"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green outline-none transition-all"
              />
            </div>
          </div>

          {/* 3. Email Address */}
          <div>
            <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green outline-none transition-all"
              />
            </div>
          </div>

          {/* 4. Phone Number */}
          <div>
            <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
              Phone Number (Calling / WhatsApp)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 080 1234 5678"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green outline-none transition-all"
              />
            </div>
          </div>

          {/* 5. Date of Birth */}
          <div>
            <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
              Date of Birth
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                value={dob}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDob(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green outline-none transition-all text-slate-700"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Required for account registration and delivery verification.
            </p>
          </div>

          {/* 6. Create Password & 7. Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* 7. Security Robot Check */}
          <div className="pt-1">
            <RobotVerification
              verified={isRobotVerified}
              onVerify={setIsRobotVerified}
            />
          </div>

          {/* Terms & Conditions Agreement (18+ Requirement) */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
              <input
                type="checkbox"
                required
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded text-brand-green focus:ring-brand-green accent-brand-green"
              />
              <span className="leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-brand-green font-bold underline" target="_blank">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-brand-green font-bold underline" target="_blank">
                  Privacy Policy
                </Link>
                , and agree to the store terms.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-800 via-brand-green to-teal-800 hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer pt-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Creating Your Account...</span>
              </>
            ) : (
              <>
                <span>Create Account &amp; Proceed</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        </form>

        {/* Existing User Link */}
        <div className="space-y-4 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-brand-muted">
            Already have an account?{' '}
            <Link
              href={redirectTarget ? `/login?redirect=${encodeURIComponent(redirectTarget)}` : '/login'}
              className="font-extrabold text-brand-green hover:underline"
            >
              Sign In here
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-800/80 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
            <span>256-Bit SSL Encrypted • Ladydee Customer Protection</span>
          </div>
        </div>
      </div>

      {/* Spring Bounce Celebration Modal */}
      <SignUpCelebrationModal
        isOpen={showCelebration}
        onClose={() => {
          setShowCelebration(false);
          router.push(redirectTarget ? `/login?redirect=${encodeURIComponent(redirectTarget)}` : '/login');
        }}
        email={email}
        fullName={fullName}
        redirectTarget={redirectTarget}
      />
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
