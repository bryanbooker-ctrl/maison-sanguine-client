-- Masterclass sessions, booked and paid online (no team validation).
-- Run once in the Supabase SQL editor.
-- Each masterclass edition (editions.kind = 'masterclass', e.g. mc-the-architecture-of-a-night-paris) must have its price set
-- (editions.price_cents, and editions.prices for other currencies, see supabase-editions-prices.sql).

create table if not exists public.masterclass_sessions (
  id uuid primary key default gen_random_uuid(),
  edition_slug text not null,
  session_date date not null,
  session_time text not null default '14:00',
  language text not null default 'en' check (language in ('en', 'fr')),
  capacity int not null default 10 check (capacity between 1 and 200),
  is_open boolean not null default true,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists masterclass_sessions_edition_idx on public.masterclass_sessions (edition_slug, session_date);
alter table public.masterclass_sessions enable row level security;

create table if not exists public.masterclass_bookings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.masterclass_sessions(id),
  places int not null check (places between 1 and 2),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  companion_name text,
  amount_cents int not null,
  currency text not null default 'eur',
  status text not null default 'pending',
  stripe_session text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists masterclass_bookings_session_idx on public.masterclass_bookings (session_id);
alter table public.masterclass_bookings enable row level security;

-- Example, to add a session (the weekend before an edition):
-- insert into public.masterclass_sessions (edition_slug, session_date, session_time, language, capacity)
-- values ('mc-the-architecture-of-a-night-paris', '2027-02-13', '14:00', 'en', 10);
