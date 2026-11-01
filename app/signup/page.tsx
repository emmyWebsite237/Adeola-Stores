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
  ShieldCheck
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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Security Check
  const [isRobotVerified, setIsRobotVerified] = useState(false);

  // State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

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
    if (!fullName.trim() || !username.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setErrorMsg('Please fill in all registration fields.');
      return;
    }

    // 2. Username validation (must be mixture of letters and numbers)
    const cleanUsername = username.trim().toLowerCase();
    if (!validateUsername(cleanUsername)) {
      setErrorMsg('Username must be a combination of letters and numbers (e.g. adeola92, emmy237).');
      return;
    }

    // 3. Password match validation
    if (password !== confirmPassword) {
      setErrorMsg('Create Password and Confirm Password do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    // 4. Robot check validation
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
          console.warn('[Signup] Profile initial notice:', profileErr);
        }

        // Send Brevo welcome email with Nigerian grocery vibes
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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-brand-line p-6 sm:p-10 shadow-card space-y-6">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-green text-white shadow-md shadow-brand-green/20 mb-2"
          >
            <ShoppingBasket className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-extrabold text-brand-ink">Create Your Account</h1>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            {redirectTarget === '/checkout'
              ? 'Sign up to safely save your delivery address and complete checkout.'
              : 'Join Ladydee Minimart for wholesale price drops, lightning dispatch, and easy grocery reorders.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

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
                placeholder="e.g. Adeola Johnson"
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
                Letters &amp; numbers (e.g. adeola92)
              </span>
            </div>
            <div className="relative">
              <AtSign className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. adeola92"
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

          {/* 5. Create Password & 6. Confirm Password */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all disabled:opacity-60 cursor-pointer pt-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Your Account...</span>
              </>
            ) : (
              <>
                <span>Create Account &amp; Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Existing User Link */}
        <div className="text-center pt-4 border-t border-brand-line">
          <p className="text-xs text-brand-muted">
            Already have an account?{' '}
            <Link
              href={redirectTarget ? `/login?redirect=${encodeURIComponent(redirectTarget)}` : '/login'}
              className="font-bold text-brand-green hover:underline"
            >
              Sign In here
            </Link>
          </p>
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
