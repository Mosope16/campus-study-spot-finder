export type NoiseLevel = 'dead_silent' | 'quiet' | 'moderate' | 'collaborative';

export type BusynessLevel = 'empty' | 'moderate' | 'busy' | 'full';

export type Amenity = 
  | 'outlets_plenty'
  | 'wifi_fast'
  | 'natural_light'
  | 'whiteboards'
  | 'monitors'
  | 'cafe_nearby'
  | 'open_24_7'
  | 'ergonomic_chairs'
  | 'wheelchair_accessible'
  | 'private_booths';

export interface AmenityMeta {
  id: Amenity;
  label: string;
  iconName: string;
  category: 'power' | 'comfort' | 'facility' | 'food';
}

export interface SpotHours {
  open: string;
  close: string;
  is_24_7?: boolean;
}

export interface Review {
  id: string;
  spot_id: string;
  author_name: string;
  rating: number;
  noise_rating: NoiseLevel;
  comment: string;
  tip?: string;
  created_at: string;
}

export interface CheckIn {
  id: string;
  spot_id: string;
  busyness: BusynessLevel;
  noise_level: NoiseLevel;
  created_at: string;
}

export interface StudySpot {
  id: string;
  name: string;
  building: string;
  campus_zone: string;
  floor: string;
  description: string;
  insider_tip?: string;
  directions: string;
  lat: number;
  lng: number;
  noise_level: NoiseLevel;
  busyness: BusynessLevel;
  busyness_score: number; // 0 (empty) to 100 (packed)
  last_reported_minutes_ago: number;
  total_reports_count: number;
  amenities: Amenity[];
  images: string[];
  hours: SpotHours;
  rating: number;
  review_count: number;
  tags: string[];
  reviews?: Review[];
}

export interface FilterState {
  searchQuery: string;
  noiseLevels: NoiseLevel[];
  busynessLevels: BusynessLevel[];
  amenities: Amenity[];
  openNowOnly: boolean;
  sortBy: 'recommended' | 'rating' | 'quietest' | 'least_busy' | 'most_reviews';
}

export interface VibeQuizAnswers {
  studyStyle: 'solo_intense' | 'casual_read' | 'group_collab';
  noiseTolerance: 'dead_silent' | 'quiet_buzz' | 'lively';
  batteryNeed: 'urgent_outlet' | 'good_for_now';
  duration: 'quick_hour' | 'long_haul';
}
