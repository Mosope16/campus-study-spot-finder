# 📍 Campus Study Spot Finder

A modern, full-stack, mobile-first web app to help university students discover, filter, and review the best study spots across campus. Never wander around looking for an open seat or power outlet again.


---

## 🚀 Key Features

- **🗺️ Interactive Campus Map**: Custom Leaflet map with zero-watermark OpenStreetMap tiles, status pins, quick campus zone jumps (*North Quad, Central Stacks, South Quad*), and a "Locate Me" geolocation finder.
- **🪑 Interactive Seating & Outlet Floor Map**: View a live desk schematic inside each spot showing window seats, Herman Miller chairs, open vs occupied desks, and dedicated 120V power outlets.
- **⏱️ Study Session Focus Timer (Pomodoro)**: Launch a 25-minute deep focus sprint or 5-minute break with live progress bar and completion celebration.
- **⚡ Live Campus Pulse Ticker**: Real-time status ticker broadcasting available seats, open silent sanctums, and active study hubs across campus.
- **🤫 Deep Noise & Vibe Filtering**:
  - *Dead Silent* (pin-drop quiet carrels)
  - *Quiet Murmur* (gentle page turns)
  - *Moderate Buzz* (coffeehouse energy)
  - *Collaborative* (group whiteboard brainstorming)
- **⚡ Live "Crowd Intel" & Check-In**: Real-time busyness meters (🟢 Lots of Seats, 🟡 Half Full, 🟠 Busy, 🔴 Packed) with student check-in voting.
- **🎯 "Find My Vibe" 3-Step Matcher**: Interactive quiz that scores and recommends the single best spot for your current mood, battery level, and study mission.
- **🔌 Amenity Filters**: Filter by outlet density, Gigabit Wi-Fi, natural daylight, 24/7 access, rolling whiteboards, dual USB-C monitors, and cafes.
- **📍 Detailed Spot Profiles**:
  - Photo galleries
  - Floor-by-floor directions ("Take elevator to 3rd floor past physics lab")
  - Insider tips from fellow students
  - Operating hours & custom submission controls
  - Student reviews and rating breakdown
- **➕ Community Submissions**: Add new study spots with custom operating hours, 24/7 toggle, and photo presets.
- **📱 PWA Ready with Service Worker**: Native home-screen installation with offline caching and responsive bottom navigation.

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 16 (App Router with Turbopack), React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons, Canvas Confetti
- **Mapping**: Leaflet with custom DOM markers & CartoDB tiles
- **Database / Backend**: Supabase PostgreSQL + Offline-first LocalStorage fallback
- **State Management**: React Hooks & LocalStorage persistence

---

## 🗄️ Database Schema

The database schema is provided in `supabase/schema.sql` and includes:
- `study_spots`: Spot metadata, coordinates, noise levels, hours, and amenities.
- `crowd_checkins`: Real-time student crowd reporting log.
- `reviews`: Community reviews, ratings, and insider student tips.
- Strict Row Level Security (RLS) policies for public reading and authenticated/guest submissions.

---

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
If connecting to your Supabase project:
```bash
cp .env.example .env.local
```
Add your credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Note: The app works out of the box with offline-first mock data if Supabase credentials are not provided.)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app!
