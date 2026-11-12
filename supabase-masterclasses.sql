-- Masterclasses booked from the MS Account, with the same request flow as the nights.
-- Run once in the Supabase SQL editor. Set price_cents (EUR) and, if needed, prices per currency (see supabase-editions-prices.sql).

alter table public.editions add column if not exists kind text not null default 'night';

insert into public.editions (slug, name, kind, is_open, sort) values
  ('mc-introduction-to-mixology-paris', 'Introduction to Mixology, MS House Paris', 'masterclass', true, 101),
  ('mc-the-architecture-of-a-night-paris', 'The Architecture of a Night, MS House Paris', 'masterclass', true, 102),
  ('mc-the-architecture-of-a-night-new-york', 'The Architecture of a Night, MS House New York', 'masterclass', true, 103),
  ('mc-scenography-paris', 'Scenography: Shaping the Space, MS House Paris', 'masterclass', true, 104)
on conflict (slug) do nothing;

-- Example, to adapt to the real price:
-- update public.editions set price_cents = 12000 where slug = 'mc-introduction-to-mixology-paris';
