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
  AtSign
} from 'lucide-react';
import { supabase, isSupabaseConfigured, upsertUserProfile } from '@/lib/db/supabase';
import RobotVerification from '@/components/ui/RobotVerification';
import SignUpCelebrationModal from '@/components/ui/SignUpCelebrationModal';

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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Security Check
  const [isRobotVerified, setIsRobotVerified] = useState(false);

  // State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  if (!isOpen) return null;

  const validateUsername = (u: string) => {
    const hasLetter = /[a-zA-Z]/.test(u);
    const hasNumber = /[0-9]/.test(u);
    return hasLetter && hasNumber && u.length >= 3;
  };

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
      setErrorMsg('Please complete the "I am not a robot" security check.');
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
          console.warn('[AuthModal] Brevo welcome email notice:', welcomeErr);
        }

        if (data.session) {
          if (onSuccess) onSuccess(data.user);
        }

        // Show the celebratory bounce-in modal
        setShowCelebration(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-line overflow-hidden max-h-[92vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-brand-muted hover:text-brand-ink rounded-full hover:bg-gray-100 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Section */}
          <div className="text-center space-y-1.5 mb-5">
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
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-5">
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green outline-none transition-all"
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
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green outline-none transition-all"
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
                className="w-full py-3 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all disabled:opacity-60 cursor-pointer"
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
              {/* Full Name */}
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green outline-none transition-all"
                  />
                </div>
              </div>

              {/* Username (letters + numbers) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-brand-ink">Username</label>
                  <span className="text-[10px] text-brand-muted">Letters &amp; numbers</span>
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

              {/* Email Address */}
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-xs font-bold text-brand-ink block mb-1">
                  Phone Number (WhatsApp / Calls)
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

              {/* Create Password */}
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
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green outline-none transition-all"
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

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-bold text-brand-ink block mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-line text-xs font-semibold focus:border-brand-green outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Robot Verification */}
              <div className="pt-1">
                <RobotVerification
                  verified={isRobotVerified}
                  onVerify={setIsRobotVerified}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all disabled:opacity-60 cursor-pointer"
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

      {/* Spring Bounce Celebration Modal */}
      <SignUpCelebrationModal
        isOpen={showCelebration}
        onClose={() => {
          setShowCelebration(false);
          onClose();
        }}
        email={email}
        fullName={fullName}
      />
    </>
  );
}
