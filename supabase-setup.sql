-- ============================================================
-- SUPABASE SETUP FOR CLEANING BRAND BOOKINGS (MULTI-BRAND)
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================
--
-- ⚠️ WHEN INTEGRATING A REAL BRAND:
--   - Set brandId / brandName / brandType in js/supabase-config.js
--   - Each website only reads/writes rows matching its brand_id
--   - Same Supabase project can hold many brands + future brand types
-- ============================================================

-- 1. Create bookings table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Multi-brand identity
  brand_id text not null,
  brand_name text not null,
  brand_type text not null default 'Cleaning',

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

-- If table already exists without brand columns, add them:
alter table public.bookings add column if not exists brand_id text;
alter table public.bookings add column if not exists brand_name text;
alter table public.bookings add column if not exists brand_type text default 'Cleaning';

-- 2. Indexes
create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_brand_id_idx on public.bookings (brand_id);
create index if not exists bookings_brand_type_idx on public.bookings (brand_type);

-- 3. Enable Row Level Security
alter table public.bookings enable row level security;

-- 4. Policies (template / demo friendly)
-- Drop old policies if re-running
drop policy if exists "Anyone can insert bookings" on public.bookings;
drop policy if exists "Anyone can read bookings" on public.bookings;
drop policy if exists "Anyone can update bookings" on public.bookings;
drop policy if exists "Anyone can delete bookings" on public.bookings;

create policy "Anyone can insert bookings"
  on public.bookings
  for insert
  to anon, authenticated
  with check (true);

-- ⚠️ For production: restrict read/update/delete to authenticated admin users
create policy "Anyone can read bookings"
  on public.bookings
  for select
  to anon, authenticated
  using (true);

create policy "Anyone can update bookings"
  on public.bookings
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Anyone can delete bookings"
  on public.bookings
  for delete
  to anon, authenticated
  using (true);

-- ============================================================
-- OPTIONAL later: lock down with Supabase Auth
-- ============================================================
