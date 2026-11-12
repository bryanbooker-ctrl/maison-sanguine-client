-- Prices per currency for each edition, used when the guest has chosen a location.
-- Amounts are in the smallest unit Stripe expects: cents for EUR, GBP, USD, HKD, TWD, MOP, BRL, MXN, RUB,
-- AED, AUD, CZK, ILS, MYR, SGD, THB,
-- and whole units for JPY and KRW (no decimals).
-- A currency left out falls back to price_cents in the edition currency (EUR).

alter table public.editions add column if not exists prices jsonb not null default '{}'::jsonb;

-- Example, to adapt to the real prices:
-- update public.editions set prices = '{"gbp": 420000, "usd": 540000, "hkd": 4200000, "jpy": 780000, "krw": 7200000, "twd": 16000000, "mop": 4300000, "brl": 2700000, "mxn": 9000000, "aed": 2000000, "aud": 820000, "czk": 12500000, "ils": 2000000, "myr": 2400000, "sgd": 720000, "thb": 19000000}'::jsonb where slug = 'aspen-winter-edition';
