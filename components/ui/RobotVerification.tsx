'use client';

import { useState } from 'react';
import { ShieldCheck, Check, Loader2 } from 'lucide-react';

interface RobotVerificationProps {
  verified: boolean;
  onVerify: (val: boolean) => void;
}

export default function RobotVerification({ verified, onVerify }: RobotVerificationProps) {
  const [checking, setChecking] = useState(false);

  const handleClick = () => {
    if (verified || checking) return;
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      onVerify(true);
    }, 700);
  };

  return (
    <div
      onClick={handleClick}
      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between select-none ${
        verified
          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900 shadow-sm'
          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
            verified
              ? 'bg-brand-green border-brand-green text-white'
              : checking
              ? 'bg-slate-100 border-slate-400'
              : 'bg-white border-slate-300 hover:border-slate-400'
          }`}
        >
          {checking ? (
            <Loader2 className="w-3.5 h-3.5 text-brand-green animate-spin" />
          ) : verified ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : null}
        </div>
        <span className="text-xs font-bold">
          {verified ? 'Human Verification Confirmed' : "I am not a robot"}
        </span>
      </div>

      <div className="flex flex-col items-end text-[10px] text-slate-400">
        <ShieldCheck className={`w-4 h-4 ${verified ? 'text-brand-green' : 'text-slate-400'}`} />
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-0.5">
          Ladydee Security
        </span>
      </div>
    </div>
  );
}
