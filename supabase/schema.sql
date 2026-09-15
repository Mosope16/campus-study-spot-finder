-- #3 Campus Study Spot Finder - Supabase Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: study_spots
create table if not exists public.study_spots (
  id text primary key,
  name text not null,
  building text not null,
  campus_zone text not null,
  floor text not null,
  description text not null,
  insider_tip text,
  directions text not null,
  lat double precision not null,
  lng double precision not null,
  noise_level text not null check (noise_level in ('dead_silent', 'quiet', 'moderate', 'collaborative')),
  busyness text not null check (busyness in ('empty', 'moderate', 'busy', 'full')),
  busyness_score integer not null default 50,
  amenities text[] not null default '{}',
  images text[] not null default '{}',
  hours jsonb not null default '{"open": "08:00", "close": "22:00", "is_24_7": false}'::jsonb,
  rating numeric(3, 2) not null default 4.5,
  review_count integer not null default 0,
  tags text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: crowd_checkins
create table if not exists public.crowd_checkins (
  id uuid default uuid_generate_v4() primary key,
  spot_id text references public.study_spots(id) on delete cascade not null,
  busyness text not null check (busyness in ('empty', 'moderate', 'busy', 'full')),
  noise_level text not null check (noise_level in ('dead_silent', 'quiet', 'moderate', 'collaborative')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: reviews
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  spot_id text references public.study_spots(id) on delete cascade not null,
  author_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  noise_rating text not null check (noise_rating in ('dead_silent', 'quiet', 'moderate', 'collaborative')),
  comment text not null,
  tip text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.study_spots enable row level security;
alter table public.crowd_checkins enable row level security;
alter table public.reviews enable row level security;

-- Public read access policies
create policy "Allow public read on study_spots"
  on public.study_spots for select using (true);

create policy "Allow public insert on study_spots"
  on public.study_spots for insert with check (true);

create policy "Allow public read on crowd_checkins"
  on public.crowd_checkins for select using (true);

create policy "Allow public insert on crowd_checkins"
  on public.crowd_checkins for insert with check (true);

create policy "Allow public read on reviews"
  on public.reviews for select using (true);

create policy "Allow public insert on reviews"
  on public.reviews for insert with check (true);
