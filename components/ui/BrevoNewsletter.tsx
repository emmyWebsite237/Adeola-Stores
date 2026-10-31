'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function BrevoNewsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus('idle');
    setMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setMsg(data.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMsg(err.message || 'Could not subscribe right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-brand-green/20 via-brand-cream to-brand-green/10 rounded-3xl p-6 sm:p-8 border border-brand-green/20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-green text-white text-[10px] font-extrabold uppercase">
            <span>Powered by Brevo</span>
          </div>
          <h3 className="font-extrabold text-lg sm:text-xl text-brand-ink">
            Get Weekly Lagos Market Price Alerts
          </h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Stay ahead of foodstuff price drops, new weekly wholesale arrivals, and weekend discount bundles. No spam, unsubscribe anytime.
          </p>
        </div>

        <div className="w-full lg:max-w-md">
          {status === 'success' ? (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
              <span>{msg}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white text-xs text-brand-ink rounded-full border border-brand-line focus:border-brand-green outline-none shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-full bg-brand-green hover:bg-brand-green-dark text-white font-bold text-xs shadow-md shadow-brand-green/20 transition-all shrink-0 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Subscribe'}
                </button>
              </div>

              {status === 'error' && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-[11px] text-red-700">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{msg}</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
