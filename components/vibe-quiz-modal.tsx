'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { StudySpot } from '@/lib/types';
import { NOISE_LEVEL_META, BUSYNESS_META } from '@/lib/constants';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VibeQuizModalProps {
  spots: StudySpot[];
  onClose: () => void;
  onSelectSpot: (spot: StudySpot) => void;
}

export default function VibeQuizModal({
  spots,
  onClose,
  onSelectSpot
}: VibeQuizModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 'result'>(1);
  const [mission, setMission] = useState<'solo' | 'casual' | 'group'>('solo');
  const [noisePref, setNoisePref] = useState<'silent' | 'buzz' | 'open'>('silent');
  const [perk, setPerk] = useState<'outlet' | 'daylight' | '24_7'>('outlet');
  const [matchedSpot, setMatchedSpot] = useState<StudySpot | null>(null);
  const [matchScore, setMatchScore] = useState(96);

  const calculateMatch = () => {
    // Score spots based on quiz answers
    const scored = spots.map((spot) => {
      let score = 50;

      // Mission scoring
      if (mission === 'solo') {
        if (spot.noise_level === 'dead_silent') score += 30;
        if (spot.noise_level === 'quiet') score += 20;
      } else if (mission === 'group') {
        if (spot.noise_level === 'collaborative') score += 35;
        if (spot.amenities.includes('whiteboards')) score += 15;
      } else {
        if (spot.noise_level === 'moderate') score += 30;
      }

      // Noise preference
      if (noisePref === 'silent' && spot.noise_level === 'dead_silent') score += 20;
      if (noisePref === 'buzz' && spot.noise_level === 'moderate') score += 20;
      if (noisePref === 'open' && spot.noise_level === 'collaborative') score += 20;

      // Perks
      if (perk === 'outlet' && spot.amenities.includes('outlets_plenty')) score += 20;
      if (perk === 'daylight' && spot.amenities.includes('natural_light')) score += 20;
      if (perk === '24_7' && spot.hours.is_24_7) score += 25;

      // Less busy is a bonus
      if (spot.busyness === 'empty') score += 10;

      return { spot, score: Math.min(score, 99) };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored[0] || { spot: spots[0], score: 94 };
    setMatchedSpot(top.spot);
    setMatchScore(top.score);
    setStep('result');

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const handleNextStep = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) calculateMatch();
  };

  const handleApplyMatch = () => {
    if (matchedSpot) {
      onSelectSpot(matchedSpot);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {step !== 'result' ? (
          <div className="space-y-6">
            {/* Step Header */}
            <div>
              <div className="flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vibe Matcher • Question {step} of 3</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {step === 1 && "What's your study mission today?"}
                {step === 2 && 'What background volume do you want?'}
                {step === 3 && 'What is your #1 must-have perk?'}
              </h2>
            </div>

            {/* Step 1 Options */}
            {step === 1 && (
              <div className="space-y-3">
                {[
                  {
                    id: 'solo',
                    label: 'Solo Deep Grind',
                    desc: 'Exam cramming, paper writing, zero tolerance for interruptions.',
                    icon: '🧠'
                  },
                  {
                    id: 'casual',
                    label: 'Casual Reading & Review',
                    desc: 'Textbooks, slides, catching up with headphones on.',
                    icon: '📖'
                  },
                  {
                    id: 'group',
                    label: 'Group Project / Problem Set',
                    desc: 'Talking through math/code, whiteboards, collaborating.',
                    icon: '👥'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setMission(opt.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                      mission === opt.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{opt.label}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2 Options */}
            {step === 2 && (
              <div className="space-y-3">
                {[
                  {
                    id: 'silent',
                    label: 'Pin-Drop Silence',
                    desc: 'Library stacks where coughing feels illegal.',
                    icon: '🤫'
                  },
                  {
                    id: 'buzz',
                    label: 'Coffeehouse Ambient Murmur',
                    desc: 'Espresso steam, soft chatter, background lo-fi energy.',
                    icon: '☕'
                  },
                  {
                    id: 'open',
                    label: 'Full Discussion Allowed',
                    desc: 'Lively, collaborative, okay to talk freely at full volume.',
                    icon: '🗣️'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setNoisePref(opt.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                      noisePref === opt.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{opt.label}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3 Options */}
            {step === 3 && (
              <div className="space-y-3">
                {[
                  {
                    id: 'outlet',
                    label: 'Dying Laptop (Outlet Guaranteed)',
                    desc: 'I need an outlet at my seat or my laptop dies in 20 minutes.',
                    icon: '🔌'
                  },
                  {
                    id: 'daylight',
                    label: 'Sunlight & Redwood Views',
                    desc: 'Giant windows, natural light, high ceilings to prevent study fatigue.',
                    icon: '☀️'
                  },
                  {
                    id: '24_7',
                    label: 'Late Night Access (24/7)',
                    desc: 'Pulling an all-nighter or working past midnight.',
                    icon: '🕒'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPerk(opt.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                      perk === opt.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{opt.label}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">Takes 10 seconds</span>
              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
              >
                <span>{step === 3 ? 'Match My Spot' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Result Screen */
          matchedSpot && (
            <div className="text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{matchScore}% Perfect Vibe Match Found!</span>
              </div>

              {/* Matched Spot Card */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 text-left bg-slate-50 dark:bg-slate-900/80 shadow-xl">
                <div className="relative h-44 w-full">
                  <Image
                    src={matchedSpot.images[0]}
                    alt={matchedSpot.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-xs text-indigo-300 font-semibold">{matchedSpot.building}</div>
                    <div className="text-base font-bold truncate">{matchedSpot.name}</div>
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Noise: <strong className="text-slate-900 dark:text-white">{NOISE_LEVEL_META[matchedSpot.noise_level].label}</strong></span>
                    <span>Crowd: <strong style={{ color: BUSYNESS_META[matchedSpot.busyness].color }}>● {BUSYNESS_META[matchedSpot.busyness].label}</strong></span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 line-clamp-2">
                    {matchedSpot.description}
                  </p>
                  {matchedSpot.insider_tip && (
                    <p className="text-amber-500 font-medium">
                      💡 Tip: {matchedSpot.insider_tip}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-xs border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={handleApplyMatch}
                  className="flex-2 py-2.5 px-5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all"
                >
                  Take Me to This Spot 🚀
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
