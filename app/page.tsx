'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { StudySpot, FilterState, Review, BusynessLevel, NoiseLevel } from '@/lib/types';
import {
  getStoredSpots,
  getFavoriteSpotIds,
  toggleFavoriteSpot,
  recordSpotCheckIn,
  addSpotReview,
  createNewSpot
} from '@/lib/storage';

import Navbar from '@/components/navbar';
import FiltersBar from '@/components/filters-bar';
import SpotCard from '@/components/spot-card';
import SpotDetailModal from '@/components/spot-detail-modal';
import CheckInModal from '@/components/checkin-modal';
import VibeQuizModal from '@/components/vibe-quiz-modal';
import AddSpotModal from '@/components/add-spot-modal';
import PomodoroTimer from '@/components/pomodoro-timer';

import {
  Map,
  List,
  Sparkles,
  Heart,
  Plus,
  FilterX,
  Timer,
  CheckCircle2
} from 'lucide-react';

const CampusMap = dynamic(() => import('@/components/map/campus-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400 text-xs gap-2">
      <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      <span>Loading Interactive Campus Map...</span>
    </div>
  )
});

export default function StudySpotDashboard() {
  const [spots, setSpots] = useState<StudySpot[]>(() => getStoredSpots());
  const [favorites, setFavorites] = useState<string[]>(() => getFavoriteSpotIds());
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(() => {
    const s = getStoredSpots();
    return s.length > 0 ? s[0].id : null;
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'split' | 'map' | 'cards'>('split');
  const [mobileTab, setMobileTab] = useState<'cards' | 'map'>('cards');

  // Modals & Extras state
  const [activeModal, setActiveModal] = useState<'detail' | 'checkin' | 'quiz' | 'add' | null>(null);
  const [modalTargetSpot, setModalTargetSpot] = useState<StudySpot | null>(null);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [activePomodoroSpotName, setActivePomodoroSpotName] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    noiseLevels: [],
    busynessLevels: [],
    amenities: [],
    openNowOnly: false,
    sortBy: 'recommended'
  });

  // Filter & Search logic
  const filteredSpots = useMemo(() => {
    let result = [...spots];

    if (showOnlyFavorites) {
      result = result.filter((s) => favorites.includes(s.id));
    }

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.building.toLowerCase().includes(q) ||
          s.floor.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.noiseLevels.length > 0) {
      result = result.filter((s) => filters.noiseLevels.includes(s.noise_level));
    }

    if (filters.amenities.length > 0) {
      result = result.filter((s) =>
        filters.amenities.every((req) => s.amenities.includes(req))
      );
    }

    if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'quietest') {
      const order = { dead_silent: 1, quiet: 2, moderate: 3, collaborative: 4 };
      result.sort((a, b) => order[a.noise_level] - order[b.noise_level]);
    } else if (filters.sortBy === 'least_busy') {
      result.sort((a, b) => a.busyness_score - b.busyness_score);
    } else if (filters.sortBy === 'most_reviews') {
      result.sort((a, b) => b.review_count - a.review_count);
    }

    return result;
  }, [spots, filters, showOnlyFavorites, favorites]);

  const activeFilterCount =
    filters.noiseLevels.length +
    filters.amenities.length +
    (filters.searchQuery ? 1 : 0) +
    (showOnlyFavorites ? 1 : 0);

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      noiseLevels: [],
      busynessLevels: [],
      amenities: [],
      openNowOnly: false,
      sortBy: 'recommended'
    });
    setShowOnlyFavorites(false);
  };

  const handleSelectSpot = (spot: StudySpot) => {
    setSelectedSpotId(spot.id);
    setModalTargetSpot(spot);
    setActiveModal('detail');
  };

  const handleSpotCardClick = (spot: StudySpot) => {
    setSelectedSpotId(spot.id);
    setModalTargetSpot(spot);
    setActiveModal('detail');
  };

  const handleToggleFavorite = (e: React.MouseEvent, spotId: string) => {
    e.stopPropagation();
    const isCurrentlyFav = favorites.includes(spotId);
    const updated = toggleFavoriteSpot(spotId);
    setFavorites(updated);
    showToast(isCurrentlyFav ? 'Removed from saved' : 'Added to your saved spots ❤️');
  };

  const handleOpenCheckIn = (e: React.MouseEvent, spot: StudySpot) => {
    e.stopPropagation();
    setModalTargetSpot(spot);
    setActiveModal('checkin');
  };

  const handleSubmitCheckIn = (busyness: BusynessLevel, noise: NoiseLevel) => {
    if (!modalTargetSpot) return;
    const updated = recordSpotCheckIn(modalTargetSpot.id, busyness, noise);
    if (updated) {
      setSpots((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      if (modalTargetSpot.id === updated.id) {
        setModalTargetSpot(updated);
      }
      showToast('Live crowd intel submitted! Thanks for updating campus.');
    }
  };

  const handleAddReview = (reviewData: Omit<Review, 'id' | 'spot_id' | 'created_at'>) => {
    if (!modalTargetSpot) return;
    const updated = addSpotReview(modalTargetSpot.id, reviewData);
    if (updated) {
      setSpots((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      if (modalTargetSpot.id === updated.id) {
        setModalTargetSpot(updated);
      }
      showToast('Review published to campus feed!');
    }
  };

  const handleCreateSpot = (newSpotData: any) => {
    const created = createNewSpot(newSpotData);
    setSpots((prev) => [created, ...prev]);
    setSelectedSpotId(created.id);
    setModalTargetSpot(created);
    setActiveModal('detail');
    showToast('New study spot added to campus map! 🎉');
  };

  const handleVibeQuizSelect = (matchedSpot: StudySpot) => {
    setSelectedSpotId(matchedSpot.id);
    setModalTargetSpot(matchedSpot);
    setActiveModal('detail');
  };

  const handleStartTimerForSpot = (spotName: string) => {
    setActivePomodoroSpotName(spotName);
    setShowPomodoro(true);
    setActiveModal(null);
    showToast(`Focus session started at ${spotName}! ⏳`);
  };

  // Pulse Stats computation
  const emptySpotsCount = spots.filter((s) => s.busyness === 'empty').length;
  const silentSpotsCount = spots.filter((s) => s.noise_level === 'dead_silent').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] flex flex-col relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="px-4 py-2 rounded-2xl bg-slate-900/95 text-white border border-slate-700 shadow-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters((f) => ({ ...f, searchQuery: q }))}
        onOpenQuiz={() => setActiveModal('quiz')}
        onOpenAddSpot={() => setActiveModal('add')}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={() => setShowOnlyFavorites((v) => !v)}
        favoriteCount={favorites.length}
        totalSpotCount={spots.length}
      />

      {/* Filters Bar */}
      <FiltersBar
        filters={filters}
        onFilterChange={(newF) => setFilters((f) => ({ ...f, ...newF }))}
        onResetFilters={resetFilters}
        layoutMode={layoutMode}
        onChangeLayout={setLayoutMode}
        activeFilterCount={activeFilterCount}
      />

      {/* Live Campus Pulse Banner */}
      <div className="w-full bg-indigo-900/15 dark:bg-indigo-950/40 border-b border-indigo-500/10 py-1.5 px-4 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white">Campus Live Pulse:</span>
            <span>🟢 {emptySpotsCount} spots have plenty of open seats right now</span>
            <span>•</span>
            <span>🤫 {silentSpotsCount} Dead Silent zones open</span>
            <span>•</span>
            <span>⚡ Most popular: Doe Main Stacks & Moffitt Loft</span>
          </div>

          <button
            onClick={() => setShowPomodoro(true)}
            className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Open Study Focus Timer</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-24 md:pb-8 flex flex-col">
        {/* Mobile View Switcher Tab */}
        <div className="flex md:hidden items-center justify-center p-1 mb-4 rounded-xl bg-slate-200 dark:bg-slate-800/80 max-w-xs mx-auto w-full">
          <button
            onClick={() => setMobileTab('cards')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'cards'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Spot Cards ({filteredSpots.length})</span>
          </button>
          <button
            onClick={() => setMobileTab('map')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'map'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
        </div>

        {/* Layout Render */}
        {layoutMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
            {/* Left Column: Cards List */}
            <div
              className={`lg:col-span-7 xl:col-span-6 space-y-4 ${
                mobileTab === 'map' ? 'hidden md:block' : 'block'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>
                  Showing <strong className="text-slate-900 dark:text-white">{filteredSpots.length}</strong> study spots
                </span>
                {showOnlyFavorites && (
                  <span className="text-rose-500 font-semibold">Filtering by saved</span>
                )}
              </div>

              {filteredSpots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredSpots.map((spot) => (
                    <SpotCard
                      key={spot.id}
                      spot={spot}
                      isSelected={selectedSpotId === spot.id}
                      isFavorite={favorites.includes(spot.id)}
                      onSelect={() => handleSpotCardClick(spot)}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenCheckIn={handleOpenCheckIn}
                      onFocusOnMap={(e) => {
                        e.stopPropagation();
                        setSelectedSpotId(spot.id);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center">
                    <FilterX className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">No spots match your filters</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try expanding your noise tolerance or unchecking specific amenities to find more study locations.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-md"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Campus Map */}
            <div
              className={`lg:col-span-5 xl:col-span-6 lg:sticky lg:top-24 h-[450px] lg:h-[calc(100vh-140px)] ${
                mobileTab === 'cards' ? 'hidden md:block' : 'block'
              }`}
            >
              <CampusMap
                spots={filteredSpots}
                selectedSpotId={selectedSpotId}
                onSelectSpot={handleSelectSpot}
              />
            </div>
          </div>
        )}

        {layoutMode === 'cards' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>Showing <strong>{filteredSpots.length}</strong> study spots</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredSpots.map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  isSelected={selectedSpotId === spot.id}
                  isFavorite={favorites.includes(spot.id)}
                  onSelect={() => handleSpotCardClick(spot)}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenCheckIn={handleOpenCheckIn}
                />
              ))}
            </div>
          </div>
        )}

        {layoutMode === 'map' && (
          <div className="h-[calc(100vh-160px)] w-full">
            <CampusMap
              spots={filteredSpots}
              selectedSpotId={selectedSpotId}
              onSelectSpot={handleSelectSpot}
            />
          </div>
        )}
      </main>

      {/* Floating Pomodoro Focus Timer Widget */}
      {showPomodoro && (
        <PomodoroTimer
          onClose={() => setShowPomodoro(false)}
          spotName={activePomodoroSpotName}
        />
      )}

      {/* Mobile Floating Action Bar */}
      <div className="fixed bottom-3 left-4 right-4 z-40 md:hidden flex items-center justify-around py-2.5 px-4 rounded-2xl bg-[#0f172a]/95 backdrop-blur-lg border border-slate-700/80 shadow-2xl text-white">
        <button
          onClick={() => setMobileTab(mobileTab === 'cards' ? 'map' : 'cards')}
          className="flex flex-col items-center gap-1 text-[10px] font-medium text-slate-300 hover:text-white"
        >
          {mobileTab === 'cards' ? <Map className="w-4 h-4 text-indigo-400" /> : <List className="w-4 h-4 text-indigo-400" />}
          <span>{mobileTab === 'cards' ? 'Map View' : 'Card View'}</span>
        </button>

        <button
          onClick={() => setActiveModal('quiz')}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-amber-300"
        >
          <Sparkles className="w-4 h-4 animate-bounce" />
          <span>Vibe Match</span>
        </button>

        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
            showOnlyFavorites ? 'text-rose-400' : 'text-slate-300'
          }`}
        >
          <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-rose-500' : ''}`} />
          <span>Saved ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveModal('add')}
          className="flex flex-col items-center gap-1 text-[10px] font-medium text-slate-300 hover:text-white"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add Spot</span>
        </button>
      </div>

      {/* Modals */}
      {activeModal === 'detail' && modalTargetSpot && (
        <SpotDetailModal
          spot={modalTargetSpot}
          onClose={() => setActiveModal(null)}
          isFavorite={favorites.includes(modalTargetSpot.id)}
          onToggleFavorite={() => {
            const isFav = favorites.includes(modalTargetSpot.id);
            const updated = toggleFavoriteSpot(modalTargetSpot.id);
            setFavorites(updated);
            showToast(isFav ? 'Removed from saved' : 'Added to your saved spots ❤️');
          }}
          onOpenCheckIn={() => setActiveModal('checkin')}
          onAddReview={handleAddReview}
          onFocusMap={() => {
            setSelectedSpotId(modalTargetSpot.id);
            setActiveModal(null);
            setMobileTab('map');
          }}
          onStartTimer={() => handleStartTimerForSpot(modalTargetSpot.name)}
        />
      )}

      {activeModal === 'checkin' && modalTargetSpot && (
        <CheckInModal
          spot={modalTargetSpot}
          onClose={() => setActiveModal(null)}
          onSubmitCheckIn={handleSubmitCheckIn}
        />
      )}

      {activeModal === 'quiz' && (
        <VibeQuizModal
          spots={spots}
          onClose={() => setActiveModal(null)}
          onSelectSpot={handleVibeQuizSelect}
        />
      )}

      {activeModal === 'add' && (
        <AddSpotModal
          onClose={() => setActiveModal(null)}
          onAddSpot={handleCreateSpot}
        />
      )}
    </div>
  );
}
