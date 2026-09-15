'use client';

import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PomodoroTimerProps {
  onClose: () => void;
  spotName?: string;
}

export default function PomodoroTimer({ onClose, spotName }: PomodoroTimerProps) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prev) => prev - 1);
        } else if (minutes > 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          try {
            confetti({ particleCount: 50, spread: 60 });
          } catch {}
          if (mode === 'focus') {
            setMode('break');
            setMinutes(5);
            setSeconds(0);
          } else {
            setMode('focus');
            setMinutes(25);
            setSeconds(0);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setIsActive(false);
    setMode(newMode);
    setMinutes(newMode === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  const progress = mode === 'focus' 
    ? ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100
    : ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="w-72 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-4 shadow-2xl text-white">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
            <Timer className="w-4 h-4 animate-pulse" />
            <span>Study Session Sprint</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {spotName && (
          <p className="text-[10px] text-slate-400 mt-1.5 truncate">
            📍 Studying at <span className="text-white font-semibold">{spotName}</span>
          </p>
        )}

        {/* Mode Selector */}
        <div className="flex items-center gap-1 mt-3 p-1 rounded-xl bg-slate-800/80">
          <button
            onClick={() => switchMode('focus')}
            className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all ${
              mode === 'focus'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Deep Focus (25m)
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all ${
              mode === 'break'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rest Break (5m)
          </button>
        </div>

        {/* Timer Display */}
        <div className="text-center py-4">
          <div className="text-4xl font-extrabold tracking-tight font-mono">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          {/* Progress Line */}
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                mode === 'focus' ? 'bg-indigo-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={resetTimer}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleTimer}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              isActive
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause' : 'Start Focus'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
