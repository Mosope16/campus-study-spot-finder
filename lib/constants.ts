import { AmenityMeta, NoiseLevel, BusynessLevel } from './types';

export const AMENITIES_LIST: AmenityMeta[] = [
  { id: 'outlets_plenty', label: 'Plenty of Outlets', iconName: 'Zap', category: 'power' },
  { id: 'wifi_fast', label: 'Gigabit Wi-Fi', iconName: 'Wifi', category: 'facility' },
  { id: 'natural_light', label: 'Natural Sunlight', iconName: 'Sun', category: 'comfort' },
  { id: 'whiteboards', label: 'Rolling Whiteboards', iconName: 'PenTool', category: 'facility' },
  { id: 'monitors', label: 'External USB-C Displays', iconName: 'Monitor', category: 'facility' },
  { id: 'cafe_nearby', label: 'Coffee / Cafe Inside', iconName: 'Coffee', category: 'food' },
  { id: 'open_24_7', label: 'Open 24/7', iconName: 'Clock', category: 'comfort' },
  { id: 'ergonomic_chairs', label: 'Herman Miller Chairs', iconName: 'Armchair', category: 'comfort' },
  { id: 'wheelchair_accessible', label: 'Wheelchair Accessible', iconName: 'Accessibility', category: 'facility' },
  { id: 'private_booths', label: 'Acoustic Sound Booths', iconName: 'Box', category: 'facility' },
];

export const NOISE_LEVEL_META: Record<NoiseLevel, { label: string; badgeClass: string; textClass: string; icon: string; description: string }> = {
  dead_silent: {
    label: 'Dead Silent',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    icon: 'VolumeX',
    description: 'Pin-drop silence. Strict quiet enforcement. No talking or calls.'
  },
  quiet: {
    label: 'Quiet Murmur',
    badgeClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    textClass: 'text-teal-600 dark:text-teal-400',
    icon: 'Volume1',
    description: 'Gentle page turns and low whispers allowed. Ideal for deep focus.'
  },
  moderate: {
    label: 'Moderate Buzz',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    textClass: 'text-amber-600 dark:text-amber-400',
    icon: 'Volume2',
    description: 'Lively coffee machine hum, light discussions, good background energy.'
  },
  collaborative: {
    label: 'Collaborative Talk',
    badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    textClass: 'text-indigo-600 dark:text-indigo-400',
    icon: 'Users',
    description: 'Full conversation welcome. Whiteboard sessions and group meetings.'
  }
};

export const BUSYNESS_META: Record<BusynessLevel, { label: string; color: string; badgeClass: string; pingClass: string }> = {
  empty: {
    label: 'Lots of Seats',
    color: '#10B981',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    pingClass: 'bg-emerald-500'
  },
  moderate: {
    label: 'Half Full',
    color: '#F59E0B',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    pingClass: 'bg-amber-500'
  },
  busy: {
    label: 'Almost Packed',
    color: '#F97316',
    badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    pingClass: 'bg-orange-500'
  },
  full: {
    label: 'Full / Hard to Find Seat',
    color: '#EF4444',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    pingClass: 'bg-rose-500'
  }
};
