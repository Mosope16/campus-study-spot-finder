'use client';

import React, { useState } from 'react';
import { StudySpot, NoiseLevel, BusynessLevel, Amenity } from '@/lib/types';
import { AMENITIES_LIST } from '@/lib/constants';
import { X, Plus, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AddSpotModalProps {
  onClose: () => void;
  onAddSpot: (spot: Omit<StudySpot, 'id' | 'rating' | 'review_count' | 'busyness_score' | 'last_reported_minutes_ago' | 'total_reports_count'>) => void;
}

export default function AddSpotModal({ onClose, onAddSpot }: AddSpotModalProps) {
  const [name, setName] = useState('');
  const [building, setBuilding] = useState('');
  const [campusZone, setCampusZone] = useState('Central Campus');
  const [floor, setFloor] = useState('');
  const [description, setDescription] = useState('');
  const [directions, setDirections] = useState('');
  const [insiderTip, setInsiderTip] = useState('');
  const [noiseLevel, setNoiseLevel] = useState<NoiseLevel>('quiet');
  const [busyness, setBusyness] = useState<BusynessLevel>('moderate');
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>(['outlets_plenty', 'wifi_fast']);
  const [is247, setIs247] = useState(false);
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80');

  const defaultPresets = [
    { label: 'Library Stacks', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Modern Lounge', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Sunlit Atrium', url: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Cozy Cafe', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80' }
  ];

  const toggleAmenity = (amenity: Amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !building.trim() || !directions.trim()) return;

    // Default slightly randomized offset around campus center
    const latOffset = (Math.random() - 0.5) * 0.005;
    const lngOffset = (Math.random() - 0.5) * 0.005;

    onAddSpot({
      name: name.trim(),
      building: building.trim(),
      campus_zone: campusZone,
      floor: floor.trim() || 'Floor 1',
      description: description.trim() || 'Student-submitted study haven.',
      insider_tip: insiderTip.trim() || undefined,
      directions: directions.trim(),
      lat: 37.8724 + latOffset,
      lng: -122.2585 + lngOffset,
      noise_level: noiseLevel,
      busyness,
      amenities: selectedAmenities,
      images: [imageUrl],
      hours: {
        open: openTime,
        close: closeTime,
        is_24_7: is247
      },
      tags: ['Student Submitted', campusZone]
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <span className="text-indigo-500 text-xs font-bold uppercase tracking-wider">
              Community Submission
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              Add a Campus Study Spot
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Share your favorite nook, library desk, or hidden alcove with the campus community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Spot Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 4th Floor Silent Carrels"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Building Name *
              </label>
              <input
                type="text"
                required
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="e.g. Hearst Memorial Hall"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Campus Zone
              </label>
              <select
                value={campusZone}
                onChange={(e) => setCampusZone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="North Quad">North Quad</option>
                <option value="Central Campus">Central Campus</option>
                <option value="South Campus">South Campus</option>
                <option value="North Gate">North Gate</option>
                <option value="West Valley">West Valley</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Floor / Exact Area
              </label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="e.g. 3rd Floor East Mezzanine"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Description & Atmosphere
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this spot special? Seating type, temperature, sunlight..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Directions / How to Find It *
              </label>
              <input
                type="text"
                required
                value={directions}
                onChange={(e) => setDirections(e.target.value)}
                placeholder="e.g. Enter main lobby, take stairs behind cafe to 2nd floor."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Insider Tip (optional)
              </label>
              <input
                type="text"
                value={insiderTip}
                onChange={(e) => setInsiderTip(e.target.value)}
                placeholder="e.g. Free coffee machine in the adjoining lounge."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Noise & Busyness Initial State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Noise Atmosphere
              </label>
              <select
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="dead_silent">🤫 Dead Silent</option>
                <option value="quiet">📚 Quiet Murmur</option>
                <option value="moderate">☕ Moderate Buzz</option>
                <option value="collaborative">👥 Collaborative / Group</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Typical Busyness
              </label>
              <select
                value={busyness}
                onChange={(e) => setBusyness(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="empty">🟢 Lots of Seats Available</option>
                <option value="moderate">🟡 Half Full</option>
                <option value="busy">🟠 Usually Busy</option>
              </select>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Operating Hours</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={is247}
                  onChange={(e) => setIs247(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Open 24/7</span>
              </label>
            </div>

            {!is247 && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Opening Time</label>
                  <input
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Closing Time</label>
                  <input
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Amenities Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Available Amenities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITIES_LIST.map((item) => {
                const checked = selectedAmenities.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAmenity(item.id)}
                    className={`p-2 rounded-xl text-xs font-medium border text-left flex items-center gap-1.5 transition-all ${
                      checked
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>{checked ? '✓' : '+'}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Preset Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Photo Cover
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {defaultPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`p-1.5 rounded-xl border text-center transition-all ${
                    imageUrl === preset.url
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 font-bold text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[11px] block">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Spot to Campus Feed</span>
          </button>
        </form>
      </div>
    </div>
  );
}
