'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, getUserProfile, upsertUserProfile, UserProfile } from '@/lib/db/supabase';
import { User, Sparkles, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function UsernameSetupModal() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const client = supabase;
    if (!client || !isSupabaseConfigured) return;

    const checkUser = async () => {
      try {
        const { data: { session } } = await client.auth.getSession();
        const user = session?.user ?? null;
        setSessionUser(user);

        if (user) {
          const prof = await getUserProfile(user.id);
          setProfile(prof);
          // If no username exists in profile or metadata, trigger mandatory modal
          if (!prof?.username && !user.user_metadata?.username) {
            setIsOpen(true);
          } else {
            setIsOpen(false);
          }
        } else {
          setIsOpen(false);
        }
      } catch (err) {
        console.error('Error checking user profile for username:', err);
      }
    };

    checkUser();

    const { data: authListener } = client.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;
      setSessionUser(user);
      if (user) {
        const prof = await getUserProfile(user.id);
        setProfile(prof);
        if (!prof?.username && !user.user_metadata?.username) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      } else {
        setIsOpen(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUser) return;

    const clean = username.trim().toLowerCase();
    if (!clean || clean.length < 3) {
      setErrorMsg('Username must be at least 3 characters long.');
      return;
    }

    const hasLettersAndNumbers = /(?=.*[a-zA-Z])(?=.*[0-9])^[a-zA-Z0-9_]+$/;
    if (!hasLettersAndNumbers.test(clean)) {
      setErrorMsg('Username must be a mixture of letters and numbers (e.g. emmy237, ladydee01).');
      return;
    }

    setBusy(true);
    setErrorMsg(null);

    try {
      const client = supabase;
      // Check if username is already taken by another user
      if (client) {
        const { data: existing } = await client
          .from('profiles')
          .select('id')
          .eq('username', clean)
          .neq('id', sessionUser.id)
          .maybeSingle();

        if (existing) {
          setErrorMsg('This username is already taken. Please choose another.');
          setBusy(false);
          return;
        }
      }

      // Upsert profile with new username
      await upsertUserProfile({
        id: sessionUser.id,
        username: clean,
        full_name: profile?.full_name || sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || '',
        email: sessionUser.email || '',
      });

      // Update Supabase auth metadata
      if (client) {
        await client.auth.updateUser({
          data: { username: clean },
        });
      }

      setIsOpen(false);
      // Reload page to reflect updated username throughout header and session
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save username. Please try again.');
      setBusy(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-200 text-center relative animate-bounceModal">
        <div className="w-16 h-16 rounded-3xl bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto mb-4 border border-brand-green/20 shadow-sm">
          <User className="w-8 h-8 text-brand-green" />
        </div>

        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Choose Your Unique Username
        </h2>
        <p className="text-xs text-slate-500 mt-1.5 mb-5 leading-relaxed">
          Welcome to Ladydee Minimart! Please set a username before continuing. It will be your identity across your orders and receipts.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 text-left font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveUsername} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Username <span className="text-brand-green">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                @
              </span>
              <input
                type="text"
                autoFocus
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                  setErrorMsg(null);
                }}
                placeholder="e.g. emmy237"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none text-sm font-bold text-slate-900"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Must be letters &amp; numbers combined (e.g. <code>emmy237</code>, <code>ladydee01</code>).
            </p>
          </div>

          <button
            type="submit"
            disabled={busy || !username.trim()}
            className="w-full py-3.5 rounded-2xl bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Username…</span>
              </>
            ) : (
              <span>Save Username &amp; Continue</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
