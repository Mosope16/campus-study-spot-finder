'use client';

import React from 'react';
import { FilterState, NoiseLevel, Amenity, BusynessLevel } from '@/lib/types';
import { AMENITIES_LIST, NOISE_LEVEL_META } from '@/lib/constants';
import { SlidersHorizontal, Map, LayoutGrid, Columns, RotateCcw } from 'lucide-react';

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  layoutMode: 'split' | 'map' | 'cards';
  onChangeLayout: (mode: 'split' | 'map' | 'cards') => void;
  activeFilterCount: number;
}

export default function FiltersBar({
  filters,
  onFilterChange,
  onResetFilters,
  layoutMode,
  onChangeLayout,
  activeFilterCount
}: FiltersBarProps) {
  const noiseOptions: { id: NoiseLevel; label: string; emoji: string }[] = [
    { id: 'dead_silent', label: 'Dead Silent', emoji: '🤫' },
    { id: 'quiet', label: 'Quiet', emoji: '📚' },
    { id: 'moderate', label: 'Moderate Buzz', emoji: '☕' },
    { id: 'collaborative', label: 'Collaborative', emoji: '👥' }
  ];

  const quickAmenities: { id: Amenity; label: string; icon: string }[] = [
    { id: 'outlets_plenty', label: 'Outlets', icon: '🔌' },
    { id: 'open_24_7', label: '24/7', icon: '🕒' },
    { id: 'natural_light', label: 'Daylight', icon: '☀️' },
    { id: 'cafe_nearby', label: 'Coffee', icon: '☕' },
    { id: 'monitors', label: 'Monitors', icon: '🖥️' }
  ];

  const handleToggleNoise = (level: NoiseLevel) => {
    const exists = filters.noiseLevels.includes(level);
    const updated = exists
      ? filters.noiseLevels.filter((l) => l !== level)
      : [...filters.noiseLevels, level];
    onFilterChange({ noiseLevels: updated });
  };

  const handleToggleAmenity = (amenity: Amenity) => {
    const exists = filters.amenities.includes(amenity);
    const updated = exists
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onFilterChange({ amenities: updated });
  };

  return (
    <div className="w-full bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Noise Level Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => onFilterChange({ noiseLevels: [] })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filters.noiseLevels.length === 0
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Vibes
          </button>

          {noiseOptions.map((opt) => {
            const isSelected = filters.noiseLevels.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => handleToggleNoise(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Amenities, Sort, Layout & Reset */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none justify-between md:justify-end">
          {/* Quick Amenity Chips */}
          <div className="flex items-center gap-1.5">
            {quickAmenities.map((amenity) => {
              const isSelected = filters.amenities.includes(amenity.id);
              return (
                <button
                  key={amenity.id}
                  onClick={() => handleToggleAmenity(amenity.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span>{amenity.icon}</span>
                  <span className="hidden sm:inline">{amenity.label}</span>
                </button>
              );
            })}
          </div>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Sort Selector */}
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            aria-label="Sort study spots by"
            className="text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="recommended">⭐ Recommended</option>
            <option value="rating">🌟 Highest Rated</option>
            <option value="quietest">🤫 Quietest First</option>
            <option value="least_busy">🟢 Emptiest First</option>
            <option value="most_reviews">💬 Most Reviews</option>
          </select>

          {/* Layout Toggle (Desktop & Tablet) */}
          <div className="hidden lg:flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => onChangeLayout('split')}
              className={`p-1.5 rounded-lg transition-all ${
                layoutMode === 'split'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Split View (Map + Cards)"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeLayout('cards')}
              className={`p-1.5 rounded-lg transition-all ${
                layoutMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeLayout('map')}
              className={`p-1.5 rounded-lg transition-all ${
                layoutMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Map Only View"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
              title="Reset filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
