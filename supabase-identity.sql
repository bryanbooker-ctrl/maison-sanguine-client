alter table public.admissions add column if not exists id_status text not null default 'none';
alter table public.admissions add column if not exists id_session text;
alter table public.admissions add column if not exists id_note text;

create table if not exists public.identity_checks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  verified_at timestamptz not null default now(),
  session_id text
);
alter table public.identity_checks enable row level security;
