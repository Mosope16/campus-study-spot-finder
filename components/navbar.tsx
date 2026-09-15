'use client';

import React from 'react';
import { Sparkles, Plus, Heart, Compass, Search } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenQuiz: () => void;
  onOpenAddSpot: () => void;
  showOnlyFavorites: boolean;
  onToggleFavorites: () => void;
  favoriteCount: number;
  totalSpotCount: number;
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  onOpenQuiz,
  onOpenAddSpot,
  showOnlyFavorites,
  onToggleFavorites,
  favoriteCount,
  totalSpotCount
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#090d16]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & Campus */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-400 text-white shadow-md shadow-indigo-500/20">
            <Compass className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                StudySpot
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-ping" />
                Live Campus Feed
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {totalSpotCount} campus spots tracked
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md mx-2 relative">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search library, building, floors, coffee..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Favorites Button */}
          <button
            onClick={onToggleFavorites}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              showOnlyFavorites
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-500 dark:text-rose-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Show saved spots"
          >
            <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-rose-500' : ''}`} />
            <span className="hidden md:inline">Saved</span>
            {favoriteCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Vibe Quiz Launcher */}
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span className="hidden sm:inline">Find My Vibe</span>
          </button>

          {/* Add Spot Button */}
          <button
            onClick={onOpenAddSpot}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Spot</span>
          </button>
        </div>
      </div>
    </header>
  );
}
