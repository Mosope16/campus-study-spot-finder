'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { StudySpot, Review } from '@/lib/types';
import { NOISE_LEVEL_META, BUSYNESS_META, AMENITIES_LIST } from '@/lib/constants';
import {
  X,
  Star,
  MapPin,
  Clock,
  Heart,
  Share2,
  Navigation,
  CheckCircle,
  Lightbulb,
  MessageSquarePlus,
  Send,
  Sparkles
} from 'lucide-react';

interface SpotDetailModalProps {
  spot: StudySpot;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenCheckIn: () => void;
  onAddReview: (review: Omit<Review, 'id' | 'spot_id' | 'created_at'>) => void;
  onFocusMap: () => void;
}

export default function SpotDetailModal({
  spot,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenCheckIn,
  onAddReview,
  onFocusMap
}: SpotDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newNoise, setNewNoise] = useState(spot.noise_level);
  const [newComment, setNewComment] = useState('');
  const [newTip, setNewTip] = useState('');

  const noiseMeta = NOISE_LEVEL_META[spot.noise_level];
  const busynessMeta = BUSYNESS_META[spot.busyness];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddReview({
      author_name: newAuthor.trim() || 'Anonymous Student',
      rating: newRating,
      noise_rating: newNoise,
      comment: newComment.trim(),
      tip: newTip.trim() || undefined
    });

    // Reset
    setNewComment('');
    setNewTip('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white flex flex-col">
        {/* Top Image Banner */}
        <div className="relative h-64 sm:h-80 w-full shrink-0 bg-slate-900">
          <Image
            src={spot.images[activeImageIndex] || spot.images[0]}
            alt={spot.name}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/50" />

          {/* Top Floating Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border ${noiseMeta.badgeClass} bg-black/50`}>
                {noiseMeta.label}
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md bg-black/50 text-white border border-white/20">
                {spot.campus_zone}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all active:scale-95"
                title="Share study spot"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onToggleFavorite}
                className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all active:scale-95"
                title="Save spot"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all active:scale-95"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Photo Gallery Thumbnails (if multiple images) */}
          {spot.images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
              {spot.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all relative ${
                    activeImageIndex === idx ? 'border-indigo-400 scale-105' : 'border-white/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Spot Title inside banner */}
          <div className="absolute bottom-4 left-4 right-20 z-10">
            <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{spot.building}</span>
              <span>•</span>
              <span>{spot.floor}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {spot.name}
            </h1>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 flex-1">
          {/* Live Crowd & Vibe Dashboard Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: busynessMeta.color }} />
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Live Crowd Status: <span style={{ color: busynessMeta.color }}>{busynessMeta.label}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Busyness Index: {spot.busyness_score}% • Reported{' '}
                {spot.last_reported_minutes_ago === 0 ? 'just now' : `${spot.last_reported_minutes_ago} mins ago`} by{' '}
                {spot.total_reports_count} students
              </p>
              {/* Progress Bar */}
              <div className="w-full sm:w-64 h-2 rounded-full bg-slate-200 dark:bg-slate-800 mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${spot.busyness_score}%`,
                    backgroundColor: busynessMeta.color
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onFocusMap}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-indigo-500" />
                <span>Pan on Map</span>
              </button>

              <button
                onClick={onOpenCheckIn}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              >
                ⚡ Report Busyness
              </button>
            </div>
          </div>

          {/* Description & Insider Tip */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">About This Spot</h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {spot.description}
            </p>

            {spot.insider_tip && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Insider Tip:</strong>
                  <span>{spot.insider_tip}</span>
                </div>
              </div>
            )}
          </div>

          {/* Directions / How to Get There */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">How to Find It</h2>
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>{spot.directions}</span>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Amenities & Perks</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AMENITIES_LIST.map((item) => {
                const hasAmenity = spot.amenities.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all ${
                      hasAmenity
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-semibold'
                        : 'bg-slate-100/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/40 text-slate-400 opacity-50'
                    }`}
                  >
                    <span className="w-4 h-4">{hasAmenity ? '✓' : '✕'}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hours and Tags */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-slate-900 dark:text-white">Operating Hours:</span>
              <span>{spot.hours.is_24_7 ? 'Open 24/7' : `${spot.hours.open} – ${spot.hours.close}`}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {spot.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Community Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Student Reviews</h2>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900 dark:text-white">{spot.rating}</span>
                  <span>({spot.review_count} verified students)</span>
                </div>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>{showReviewForm ? 'Cancel' : 'Write Review'}</span>
              </button>
            </div>

            {/* Review Submission Form */}
            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Your Name & Major (optional)
                    </label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Jordan (EECS Sophomore)"
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Rating (1 to 5 stars)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 text-slate-400 hover:text-amber-400"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              newRating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    What was the noise & study atmosphere like?
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="e.g. Plenty of outlets by the north window, great lighting for laptop work."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Insider Tip for other students (optional)
                  </label>
                  <input
                    type="text"
                    value={newTip}
                    onChange={(e) => setNewTip(e.target.value)}
                    placeholder="e.g. Second floor bathroom is always clean."
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Review</span>
                  </button>
                </div>
              </form>
            )}

            {/* Existing Reviews List */}
            <div className="space-y-3">
              {spot.reviews && spot.reviews.length > 0 ? (
                spot.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white">
                        {rev.author_name}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>
                    {rev.tip && (
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span>Tip: {rev.tip}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
