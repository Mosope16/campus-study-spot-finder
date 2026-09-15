import { StudySpot } from '../types';

export const INITIAL_STUDY_SPOTS: StudySpot[] = [
  {
    id: 'spot-doe-stacks',
    name: 'Doe Memorial Main Stacks (Level B)',
    building: 'Doe Memorial Library',
    campus_zone: 'North Quad',
    floor: 'Sub-level B (Underground Stacks)',
    description: 'The holy grail of pin-drop silence. Lined with vintage wooden carrels, book scent, and warm incandescent reading lamps. If you drop a pencil, everyone will hear it.',
    insider_tip: 'The carrels on the west perimeter have individual power strips and vintage brass lamps.',
    directions: 'Enter Doe North lobby, take the grand staircase down to Main Stacks security check, and take the spiral elevator to Level B.',
    lat: 37.8724,
    lng: -122.2595,
    noise_level: 'dead_silent',
    busyness: 'empty',
    busyness_score: 22,
    last_reported_minutes_ago: 8,
    total_reports_count: 34,
    amenities: ['outlets_plenty', 'wifi_fast', 'ergonomic_chairs', 'wheelchair_accessible'],
    images: [
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80'
    ],
    hours: { open: '08:00', close: '22:00', is_24_7: false },
    rating: 4.8,
    review_count: 64,
    tags: ['Dead Silence', 'Deep Focus', 'Vintage Carrels', 'No Food'],
    reviews: [
      {
        id: 'rev-1',
        spot_id: 'spot-doe-stacks',
        author_name: 'Maya K. (CS Senior)',
        rating: 5,
        noise_rating: 'dead_silent',
        comment: 'Best place to write essays and prep for finals when you need zero distractions.',
        tip: 'Bring a light hoodie, underground stays a chilly 66°F year-round.',
        created_at: '2026-09-10T14:30:00Z'
      },
      {
        id: 'rev-2',
        spot_id: 'spot-doe-stacks',
        author_name: 'David L. (Philosophy)',
        rating: 5,
        noise_rating: 'dead_silent',
        comment: 'Literally not a single phone call or whisper allowed. Total sanctuary.',
        created_at: '2026-09-08T18:15:00Z'
      }
    ]
  },
  {
    id: 'spot-moffitt-4',
    name: 'Moffitt Innovation Loft & Tech Hub',
    building: 'Moffitt Undergraduate Library',
    campus_zone: 'Central Campus',
    floor: '4th Floor (Conversational)',
    description: 'Vibrant collaborative space with movable modular seating, expansive writable glass walls, podcast sound booths, and 24-hour access during semester peaks.',
    insider_tip: 'Booth 4B has dual 27-inch 4K USB-C monitors that anyone can plug into.',
    directions: 'Take the central escalator to floor 4. Sound booths are against the south windows.',
    lat: 37.8727,
    lng: -122.2608,
    noise_level: 'collaborative',
    busyness: 'busy',
    busyness_score: 78,
    last_reported_minutes_ago: 4,
    total_reports_count: 89,
    amenities: ['outlets_plenty', 'wifi_fast', 'whiteboards', 'monitors', 'cafe_nearby', 'open_24_7', 'private_booths'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
    ],
    hours: { open: '00:00', close: '23:59', is_24_7: true },
    rating: 4.6,
    review_count: 142,
    tags: ['24/7', 'Group Projects', 'Dual Monitors', 'Coffee Onsite'],
    reviews: [
      {
        id: 'rev-3',
        spot_id: 'spot-moffitt-4',
        author_name: 'Alex R. (Data Science)',
        rating: 5,
        noise_rating: 'collaborative',
        comment: 'The rolling whiteboards and monitors make hackathons and group study sessions painless.',
        created_at: '2026-09-12T20:00:00Z'
      }
    ]
  },
  {
    id: 'spot-science-atrium',
    name: 'Stanley Glass Atrium & Sky Garden',
    building: 'Stanley Biosciences Hall',
    campus_zone: 'North Campus',
    floor: '2nd Floor Mezzanine',
    description: 'Three-story glass wall flooding the study terraces with natural daylight. Bamboo planters, high ceilings, and artisan espresso bar on the ground floor.',
    insider_tip: 'Corner high-top tables overlook the redwood grove; perfect sunset study views.',
    directions: 'Enter from the East Plaza, take stairs up to 2nd floor balcony overlooking the atrium.',
    lat: 37.8738,
    lng: -122.2571,
    noise_level: 'moderate',
    busyness: 'moderate',
    busyness_score: 55,
    last_reported_minutes_ago: 14,
    total_reports_count: 47,
    amenities: ['natural_light', 'cafe_nearby', 'wifi_fast', 'outlets_plenty', 'wheelchair_accessible'],
    images: [
      'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80'
    ],
    hours: { open: '07:30', close: '20:00', is_24_7: false },
    rating: 4.9,
    review_count: 88,
    tags: ['Sunlit', 'Espresso Bar', 'Redwood Views', 'Spacious'],
    reviews: [
      {
        id: 'rev-4',
        spot_id: 'spot-science-atrium',
        author_name: 'Elena T. (Bioengineering)',
        rating: 5,
        noise_rating: 'moderate',
        comment: 'Favorite spot for afternoon problem sets. The cafe cortado gives you life.',
        created_at: '2026-09-11T16:20:00Z'
      }
    ]
  },
  {
    id: 'spot-law-quad',
    name: 'Kadish Law Library Reading Room',
    building: 'School of Law Building',
    campus_zone: 'South Quad',
    floor: 'Ground Floor East Wing',
    description: 'Cathedral ceilings, gothic stained-glass windows, and dark mahogany tables. A serious, deeply focused atmosphere where law students grind.',
    insider_tip: 'Open to all students, but please keep laptop keyboards quiet (membrane or silent taps preferred).',
    directions: 'Main Law entrance, head through glass double doors past the law admissions desk.',
    lat: 37.8698,
    lng: -122.2539,
    noise_level: 'dead_silent',
    busyness: 'moderate',
    busyness_score: 48,
    last_reported_minutes_ago: 22,
    total_reports_count: 28,
    amenities: ['outlets_plenty', 'ergonomic_chairs', 'natural_light', 'wifi_fast'],
    images: [
      'https://images.unsplash.com/photo-1507842229451-79b1be886a20?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80'
    ],
    hours: { open: '08:00', close: '21:00', is_24_7: false },
    rating: 4.7,
    review_count: 53,
    tags: ['Gothic Library', 'Silent Grind', 'Mahogany Tables', 'Law Stacks']
  },
  {
    id: 'spot-jacobs-maker',
    name: 'Jacobs Hall Design Lounge',
    building: 'Jacobs Institute for Design Innovation',
    campus_zone: 'North Gate',
    floor: '3rd Floor Terrace',
    description: 'Bright open-plan creative lounge overlooking the campus hills. Surrounded by 3D printers, laser cutters, and collaborative whiteboards.',
    insider_tip: 'Free coffee machine on the 3rd floor kitchenette for design majors.',
    directions: 'Take the freight elevator or open exterior stairs to level 3.',
    lat: 37.8759,
    lng: -122.2588,
    noise_level: 'collaborative',
    busyness: 'empty',
    busyness_score: 25,
    last_reported_minutes_ago: 5,
    total_reports_count: 19,
    amenities: ['whiteboards', 'natural_light', 'outlets_plenty', 'wifi_fast', 'private_booths'],
    images: [
      'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80'
    ],
    hours: { open: '08:30', close: '20:00', is_24_7: false },
    rating: 4.6,
    review_count: 31,
    tags: ['Designers', 'Terrace Views', 'Whiteboard Walls']
  },
  {
    id: 'spot-mlk-corner',
    name: 'MLK Student Union Fireside Lounge',
    building: 'Martin Luther King Jr. Student Union',
    campus_zone: 'South Campus',
    floor: '2nd Floor Overlooking Sproul Plaza',
    description: 'Cozy plush velvet couches, gas fireplace, and panoramic floor-to-ceiling windows watching Sproul Plaza performers and student life.',
    insider_tip: 'Perfect for reading textbooks or casual review while listening to music with headphones.',
    directions: 'Enter from Upper Sproul, ascend the spiral staircase to the 2nd floor lounge.',
    lat: 37.8692,
    lng: -122.2598,
    noise_level: 'moderate',
    busyness: 'full',
    busyness_score: 92,
    last_reported_minutes_ago: 3,
    total_reports_count: 112,
    amenities: ['cafe_nearby', 'natural_light', 'ergonomic_chairs', 'wheelchair_accessible'],
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80'
    ],
    hours: { open: '07:00', close: '23:00', is_24_7: false },
    rating: 4.4,
    review_count: 76,
    tags: ['Cozy Couches', 'Fireplace', 'Social Study', 'Boba Nearby']
  },
  {
    id: 'spot-env-stacks',
    name: 'Wurster Environmental Design Library',
    building: 'Bauer Wurster Hall',
    campus_zone: 'South Quad',
    floor: '2nd Floor Architecture Stacks',
    description: 'Raw concrete brutalist architecture paired with warm oak drafting tables and massive lightwells. Surrounded by architecture models and rare art books.',
    insider_tip: 'Huge oversized drafting tables give you ample space to spread out 3 monitors, notebooks, and tablets at once.',
    directions: 'Wurster lobby, take the north hallway stairs up to the second floor library.',
    lat: 37.8705,
    lng: -122.2547,
    noise_level: 'quiet',
    busyness: 'empty',
    busyness_score: 18,
    last_reported_minutes_ago: 12,
    total_reports_count: 42,
    amenities: ['outlets_plenty', 'natural_light', 'wifi_fast', 'ergonomic_chairs', 'whiteboards'],
    images: [
      'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1200&q=80'
    ],
    hours: { open: '09:00', close: '19:00', is_24_7: false },
    rating: 4.8,
    review_count: 39,
    tags: ['Brutalist Gem', 'Gigantic Tables', 'Drafting Chairs', 'Hidden Quiet']
  },
  {
    id: 'spot-tech-hub',
    name: 'Cory Hall 24/7 Hacker Cellar',
    building: 'Cory Hall (EECS)',
    campus_zone: 'North Gate',
    floor: 'Basement Room 111',
    description: 'High-speed ethernet ports, dual soldering workstations, giant whiteboards, and vending machines loaded with energy drinks. Where hardware and software code runs at 3 AM.',
    insider_tip: 'Keycard access required after 9 PM. Free coffee pot in the kitchenette corner.',
    directions: 'Take the stairwell behind the elevator bank in the Cory breezeway down to the basement.',
    lat: 37.8752,
    lng: -122.2578,
    noise_level: 'quiet',
    busyness: 'moderate',
    busyness_score: 45,
    last_reported_minutes_ago: 7,
    total_reports_count: 67,
    amenities: ['open_24_7', 'outlets_plenty', 'wifi_fast', 'whiteboards', 'monitors'],
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'
    ],
    hours: { open: '00:00', close: '23:59', is_24_7: true },
    rating: 4.5,
    review_count: 58,
    tags: ['24/7 Hacker Hub', 'Monitors & Power', 'Late Night']
  }
];
