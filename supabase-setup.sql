-- ============================================================
-- SUPABASE SETUP FOR CLEANING BRAND BOOKINGS
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Create bookings table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Customer
  full_name text not null,
  email text not null,
  phone text not null,

  -- Service
  service text not null,
  property_type text,
  bedrooms text,
  bathrooms text,
  extras text,

  -- Scheduling
  preferred_date date,
  preferred_time text,
  frequency text,
  address text,
  instructions text,

  -- Admin
  status text not null default 'new'
    check (status in ('new', 'contacted', 'confirmed', 'completed', 'cancelled'))
);

-- 2. Index for faster admin lists
create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);

-- 3. Enable Row Level Security
alter table public.bookings enable row level security;

-- 4. Policies (template / demo friendly)
-- Anyone can submit a booking (public website form)
create policy "Anyone can insert bookings"
  on public.bookings
  for insert
  to anon, authenticated
  with check (true);

-- Anyone can read bookings (needed for simple admin on static site)
-- ⚠️ For production: restrict this to authenticated admin users only
create policy "Anyone can read bookings"
  on public.bookings
  for select
  to anon, authenticated
  using (true);

-- Anyone can update status (admin dashboard)
-- ⚠️ For production: restrict to authenticated admin users only
create policy "Anyone can update bookings"
  on public.bookings
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- Anyone can delete (admin dashboard)
-- ⚠️ For production: restrict to authenticated admin users only
create policy "Anyone can delete bookings"
  on public.bookings
  for delete
  to anon, authenticated
  using (true);

-- ============================================================
-- OPTIONAL: Later lock-down example (after you add Supabase Auth)
-- ============================================================
-- drop policy "Anyone can read bookings" on public.bookings;
-- drop policy "Anyone can update bookings" on public.bookings;
-- drop policy "Anyone can delete bookings" on public.bookings;
--
-- create policy "Only authenticated can read"
--   on public.bookings for select to authenticated using (true);
-- create policy "Only authenticated can update"
--   on public.bookings for update to authenticated using (true) with check (true);
-- create policy "Only authenticated can delete"
--   on public.bookings for delete to authenticated using (true);
