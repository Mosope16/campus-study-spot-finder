import { StudySpot, CheckIn, Review, BusynessLevel, NoiseLevel } from './types';
import { INITIAL_STUDY_SPOTS } from './data/seed-spots';

const SPOTS_STORAGE_KEY = 'campus_study_spots_data_v1';
const FAVORITES_STORAGE_KEY = 'campus_study_spots_favorites_v1';
const CHECKINS_STORAGE_KEY = 'campus_study_spots_checkins_v1';

export function getStoredSpots(): StudySpot[] {
  if (typeof window === 'undefined') return INITIAL_STUDY_SPOTS;
  try {
    const raw = localStorage.getItem(SPOTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SPOTS_STORAGE_KEY, JSON.stringify(INITIAL_STUDY_SPOTS));
      return INITIAL_STUDY_SPOTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STUDY_SPOTS;
  }
}

export function saveStoredSpots(spots: StudySpot[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SPOTS_STORAGE_KEY, JSON.stringify(spots));
  } catch (e) {
    console.error('Failed to persist spots to localStorage', e);
  }
}

export function getFavoriteSpotIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteSpot(spotId: string): string[] {
  if (typeof window === 'undefined') return [];
  const current = getFavoriteSpotIds();
  const exists = current.includes(spotId);
  const updated = exists ? current.filter(id => id !== spotId) : [...current, spotId];
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update favorites', e);
  }
  return updated;
}

export function recordSpotCheckIn(spotId: string, busyness: BusynessLevel, noise: NoiseLevel): StudySpot | null {
  const spots = getStoredSpots();
  const index = spots.findIndex(s => s.id === spotId);
  if (index === -1) return null;

  // Calculate new busyness score based on check-in
  const scoreMap: Record<BusynessLevel, number> = {
    empty: 20,
    moderate: 50,
    busy: 75,
    full: 95
  };

  const target = spots[index];
  const updatedSpot: StudySpot = {
    ...target,
    busyness,
    noise_level: noise,
    busyness_score: scoreMap[busyness],
    last_reported_minutes_ago: 0,
    total_reports_count: target.total_reports_count + 1
  };

  spots[index] = updatedSpot;
  saveStoredSpots(spots);

  // Also log check-in
  try {
    const checkinsRaw = localStorage.getItem(CHECKINS_STORAGE_KEY);
    const checkins: CheckIn[] = checkinsRaw ? JSON.parse(checkinsRaw) : [];
    checkins.unshift({
      id: 'chk-' + Date.now(),
      spot_id: spotId,
      busyness,
      noise_level: noise,
      created_at: new Date().toISOString()
    });
    localStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(checkins.slice(0, 100)));
  } catch {}

  return updatedSpot;
}

export function addSpotReview(spotId: string, review: Omit<Review, 'id' | 'spot_id' | 'created_at'>): StudySpot | null {
  const spots = getStoredSpots();
  const index = spots.findIndex(s => s.id === spotId);
  if (index === -1) return null;

  const target = spots[index];
  const newReview: Review = {
    ...review,
    id: 'rev-' + Date.now(),
    spot_id: spotId,
    created_at: new Date().toISOString()
  };

  const currentReviews = target.reviews || [];
  const updatedReviews = [newReview, ...currentReviews];
  const newTotalRating = (target.rating * target.review_count + review.rating) / (target.review_count + 1);

  const updatedSpot: StudySpot = {
    ...target,
    rating: Number(newTotalRating.toFixed(1)),
    review_count: target.review_count + 1,
    reviews: updatedReviews
  };

  spots[index] = updatedSpot;
  saveStoredSpots(spots);
  return updatedSpot;
}

export function createNewSpot(spotData: Omit<StudySpot, 'id' | 'rating' | 'review_count' | 'busyness_score' | 'last_reported_minutes_ago' | 'total_reports_count'>): StudySpot {
  const spots = getStoredSpots();
  const newId = 'spot-custom-' + Date.now();
  const newSpot: StudySpot = {
    ...spotData,
    id: newId,
    rating: 5.0,
    review_count: 1,
    busyness_score: spotData.busyness === 'empty' ? 20 : spotData.busyness === 'moderate' ? 50 : 80,
    last_reported_minutes_ago: 0,
    total_reports_count: 1,
    reviews: [
      {
        id: 'rev-first',
        spot_id: newId,
        author_name: 'Founder / Submitter',
        rating: 5,
        noise_rating: spotData.noise_level,
        comment: 'Newly added spot! Check it out.',
        created_at: new Date().toISOString()
      }
    ]
  };

  spots.unshift(newSpot);
  saveStoredSpots(spots);
  return newSpot;
}
