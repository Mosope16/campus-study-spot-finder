'use client';

import React, { useState } from 'react';
import { StudySpot, BusynessLevel, NoiseLevel } from '@/lib/types';
import { BUSYNESS_META } from '@/lib/constants';
import { X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckInModalProps {
  spot: StudySpot;
  onClose: () => void;
  onSubmitCheckIn: (busyness: BusynessLevel, noise: NoiseLevel) => void;
}

export default function CheckInModal({
  spot,
  onClose,
  onSubmitCheckIn
}: CheckInModalProps) {
  const [selectedBusyness, setSelectedBusyness] = useState<BusynessLevel>(spot.busyness);
  const [selectedNoise, setSelectedNoise] = useState<NoiseLevel>(spot.noise_level);
  const [submitted, setSubmitted] = useState(false);

  const busynessOptions: { id: BusynessLevel; label: string; desc: string }[] = [
    { id: 'empty', label: 'Plenty of Seats', desc: 'Empty tables, lots of space' },
    { id: 'moderate', label: 'Half Full', desc: 'Good availability, easy to find a spot' },
    { id: 'busy', label: 'Filling Up Fast', desc: 'Mostly taken, few solo spots left' },
    { id: 'full', label: 'Packed / Full', desc: 'Circling required or no seats available' }
  ];

  const noiseOptions: { id: NoiseLevel; label: string; emoji: string }[] = [
    { id: 'dead_silent', label: 'Dead Silent', emoji: '🤫' },
    { id: 'quiet', label: 'Quiet Murmur', emoji: '📚' },
    { id: 'moderate', label: 'Moderate Buzz', emoji: '☕' },
    { id: 'collaborative', label: 'Collaborative', emoji: '👥' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitCheckIn(selectedBusyness, selectedNoise);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Thanks for the Live Intel!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Your report keeps campus study spots accurate and helps fellow students find seats faster.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">
                Live Community Intel
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                Report Live Busyness
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                at {spot.name}
              </p>
            </div>

            {/* Busyness Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                How crowded is it right now?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {busynessOptions.map((opt) => {
                  const meta = BUSYNESS_META[opt.id];
                  const isSelected = selectedBusyness === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedBusyness(opt.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{opt.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {opt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Noise Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                What is the current noise level?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {noiseOptions.map((opt) => {
                  const isSelected = selectedNoise === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedNoise(opt.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-sm">{opt.emoji}</span>
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-98"
            >
              Submit Live Update
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
