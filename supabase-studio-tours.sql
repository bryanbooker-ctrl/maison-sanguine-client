-- Guided tours of the Maison Sanguine Studio, booked and paid online.
-- Run once in the Supabase SQL editor.

create table if not exists public.studio_tours (
  id uuid primary key default gen_random_uuid(),
  tour_date date not null,
  slot text not null,
  language text not null,
  places int not null check (places between 1 and 8),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  amount_cents int not null,
  status text not null default 'pending',
  stripe_session text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists studio_tours_slot_idx on public.studio_tours (tour_date, slot);
alter table public.studio_tours enable row level security;

-- Days when the Studio is closed (bank holidays, private events). Add a row to close a day.
create table if not exists public.studio_closures (
  day date primary key,
  note text
);
alter table public.studio_closures enable row level security;
