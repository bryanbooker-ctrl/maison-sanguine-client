-- Maison Sanguine Studio masterclass: "The Making of a Night".
-- Run once in the Supabase SQL editor (after supabase-masterclasses.sql and supabase-masterclass-sessions.sql).
-- The page and the booking calendar work like the other masterclasses: sessions come from masterclass_sessions
-- and the price from editions. Until a price is set, booking stays closed and the page shows no price.

insert into public.editions (slug, name, kind, is_open, sort) values
  ('mc-the-making-of-a-night-paris', 'The Making of a Night, Maison Sanguine Studio Paris', 'masterclass', true, 105)
on conflict (slug) do nothing;

-- Price in euros (in cents), then optional other currencies (see supabase-editions-prices.sql):
-- update public.editions set price_cents = 15000 where slug = 'mc-the-making-of-a-night-paris';

-- Sessions (one line per date; capacity 1 to 200):
-- insert into public.masterclass_sessions (edition_slug, session_date, session_time, language, capacity)
-- values ('mc-the-making-of-a-night-paris', '2027-02-13', '14:00', 'en', 10),
--        ('mc-the-making-of-a-night-paris', '2027-02-20', '14:00', 'fr', 10);
