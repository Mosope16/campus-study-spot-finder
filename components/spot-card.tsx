'use client';

import React from 'react';
import Image from 'next/image';
import { StudySpot } from '@/lib/types';
import { NOISE_LEVEL_META, BUSYNESS_META, AMENITIES_LIST } from '@/lib/constants';
import { Star, MapPin, Clock, Heart, Zap, Sun, Wifi, Coffee, Sparkles, Navigation } from 'lucide-react';

interface SpotCardProps {
  spot: StudySpot;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: (spot: StudySpot) => void;
  onToggleFavorite: (e: React.MouseEvent, spotId: string) => void;
  onOpenCheckIn: (e: React.MouseEvent, spot: StudySpot) => void;
  onFocusOnMap?: (e: React.MouseEvent, spot: StudySpot) => void;
}

export default function SpotCard({
  spot,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onOpenCheckIn,
  onFocusOnMap
}: SpotCardProps) {
  const noiseMeta = NOISE_LEVEL_META[spot.noise_level];
  const busynessMeta = BUSYNESS_META[spot.busyness];

  // Map amenity icons
  const getAmenityIcon = (id: string) => {
    switch (id) {
      case 'outlets_plenty': return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'natural_light': return <Sun className="w-3.5 h-3.5 text-yellow-500" />;
      case 'wifi_fast': return <Wifi className="w-3.5 h-3.5 text-sky-500" />;
      case 'cafe_nearby': return <Coffee className="w-3.5 h-3.5 text-emerald-500" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(spot)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
        isSelected
          ? 'bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-500 shadow-glow ring-2 ring-indigo-500/20'
          : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-soft hover:shadow-card'
      }`}
    >
      {/* Image Thumbnail Header */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-800">
        <Image
          src={spot.images[0]}
          alt={spot.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Noise Badge (Top Left) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${noiseMeta.badgeClass} bg-black/40`}>
            {noiseMeta.label}
          </span>
        </div>

        {/* Favorite Button (Top Right) */}
        <button
          onClick={(e) => onToggleFavorite(e, spot.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all active:scale-90"
          title={isFavorite ? 'Remove from saved' : 'Save spot'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
        </button>

        {/* Live Busyness Pill (Bottom Left) */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/90 text-white backdrop-blur-md border border-slate-700/60 shadow-xs">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: busynessMeta.color }}
            />
            <span>{busynessMeta.label}</span>
          </div>
          <span className="text-[10px] text-slate-300">
            {spot.last_reported_minutes_ago === 0 ? 'Just now' : `${spot.last_reported_minutes_ago}m ago`}
          </span>
        </div>

        {/* Rating (Bottom Right) */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-300" />
          <span>{spot.rating}</span>
          <span className="text-slate-400 text-[10px]">({spot.review_count})</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col justify-between">
        <div>
          {/* Location & Building Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{spot.building}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-500 dark:text-slate-400 font-normal truncate">{spot.floor}</span>
          </div>

          {/* Spot Title */}
          <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1.5">
            {spot.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {spot.description}
          </p>

          {/* Amenity Icons Row */}
          <div className="flex items-center gap-2 mb-4 overflow-hidden">
            {spot.amenities.slice(0, 4).map((amenityId) => {
              const meta = AMENITIES_LIST.find((a) => a.id === amenityId);
              if (!meta) return null;
              return (
                <div
                  key={amenityId}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300"
                  title={meta.label}
                >
                  {getAmenityIcon(amenityId)}
                  <span className="truncate max-w-[80px]">{meta.label}</span>
                </div>
              );
            })}
            {spot.amenities.length > 4 && (
              <span className="text-[10px] text-slate-400 font-medium">
                +{spot.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{spot.hours.is_24_7 ? 'Open 24/7' : `${spot.hours.open} – ${spot.hours.close}`}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {onFocusOnMap && (
              <button
                onClick={(e) => onFocusOnMap(e, spot)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Pan map to this spot"
              >
                <Navigation className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={(e) => onOpenCheckIn(e, spot)}
              className="px-2.5 py-1 rounded-lg font-semibold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/60 transition-colors"
            >
              Report Busyness
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
