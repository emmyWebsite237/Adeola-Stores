'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Check, Sparkles, X } from 'lucide-react';

interface RobotVerificationProps {
  verified: boolean;
  onVerify: (val: boolean) => void;
}

export default function RobotVerification({ verified, onVerify }: RobotVerificationProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleClickCheckbox = () => {
    if (verified) return;
    setSliderValue(0);
    setIsSuccess(false);
    setModalOpen(true);
  };

  const handleSliderChange = (val: number) => {
    if (isSuccess) return;
    setSliderValue(val);
    if (val >= 92) {
      setSliderValue(100);
      setIsSuccess(true);
      setTimeout(() => {
        onVerify(true);
        setModalOpen(false);
      }, 700);
    }
  };

  // Drag handlers for mouse & touch
  const handleStartDrag = (clientX: number) => {
    if (isSuccess || !trackRef.current) return;
    setIsDragging(true);
    updateSliderFromClientX(clientX);
  };

  const handleMoveDrag = (clientX: number) => {
    if (!isDragging || isSuccess || !trackRef.current) return;
    updateSliderFromClientX(clientX);
  };

  const handleEndDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (!isSuccess && sliderValue < 92) {
      // Snap back if not reached target
      setSliderValue(0);
    }
  };

  const updateSliderFromClientX = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = Math.round((offsetX / rect.width) * 100);
    handleSliderChange(percent);
  };

  return (
    <>
      {/* Checkbox trigger bar */}
      <div
        onClick={handleClickCheckbox}
        role="button"
        tabIndex={0}
        aria-label="I am not a robot verification"
        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between select-none ${
          verified
            ? 'bg-emerald-50/90 border-emerald-400 text-emerald-900 shadow-sm'
            : 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 text-slate-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              verified
                ? 'bg-brand-green border-brand-green text-white shadow-sm'
                : 'bg-white border-slate-300 hover:border-brand-green'
            }`}
          >
            {verified ? <Check className="w-4 h-4 stroke-[3]" /> : null}
          </div>
          <span className="text-xs font-bold">
            {verified ? 'Human Verification Confirmed' : 'I am not a robot (Tap to verify)'}
          </span>
        </div>

        <div className="flex flex-col items-end text-[10px]">
          <ShieldCheck className={`w-4 h-4 ${verified ? 'text-brand-green' : 'text-slate-400'}`} />
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-0.5">
            Ladydee Shield
          </span>
        </div>
      </div>

      {/* 2D Flat Puzzle Modal */}
      {modalOpen && !verified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-emerald-100 text-center relative overflow-hidden">
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close verification puzzle"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 mb-3">
              <Sparkles className="w-6 h-6 text-brand-green animate-pulse" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Quick Security Puzzle
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Drag the grocery basket <span className="text-base">🧺</span> across the track to the market stall <span className="text-base">🏪</span>
            </p>

            {/* 2D Flat Puzzle Track */}
            <div
              ref={trackRef}
              onMouseDown={(e) => handleStartDrag(e.clientX)}
              onMouseMove={(e) => handleMoveDrag(e.clientX)}
              onMouseUp={handleEndDrag}
              onMouseLeave={handleEndDrag}
              onTouchStart={(e) => handleStartDrag(e.touches[0].clientX)}
              onTouchMove={(e) => handleMoveDrag(e.touches[0].clientX)}
              onTouchEnd={handleEndDrag}
              className="relative w-full h-16 bg-slate-100 rounded-2xl border-2 border-dashed border-emerald-300 p-1 flex items-center select-none overflow-hidden cursor-pointer"
            >
              {/* Progress fill */}
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-75 ${
                  isSuccess ? 'bg-emerald-400/30' : 'bg-emerald-100'
                }`}
                style={{ width: `${Math.max(8, sliderValue)}%` }}
              />

              {/* Target Slot on Right */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl border-2 border-emerald-400 bg-emerald-50 flex items-center justify-center text-xl shadow-inner pointer-events-none">
                {isSuccess ? '🎉' : '🏪'}
              </div>

              {/* Draggable Basket Piece */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md cursor-grab active:cursor-grabbing transition-transform ${
                  isSuccess
                    ? 'bg-emerald-600 text-white scale-110'
                    : isDragging
                    ? 'bg-brand-green text-white scale-105 shadow-lg'
                    : 'bg-white border-2 border-emerald-500 hover:scale-105'
                }`}
                style={{
                  left: `calc(${sliderValue}% - ${(sliderValue / 100) * 48}px)`,
                }}
              >
                {isSuccess ? '✅' : '🧺'}
              </div>
            </div>

            {/* Fallback Range Slider for Accessibility */}
            <div className="mt-4">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                aria-label="Verification slider"
                className="w-full accent-brand-green cursor-pointer"
              />
            </div>

            {/* Status Feedback */}
            <div className="mt-3 text-xs font-bold min-h-[20px]">
              {isSuccess ? (
                <span className="text-emerald-700 flex items-center justify-center gap-1.5 animate-bounce">
                  <Check className="w-4 h-4 stroke-[3]" />
                  Human Verified! Completing...
                </span>
              ) : (
                <span className="text-slate-400">Slide all the way to 100% to finish</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}