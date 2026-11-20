-- Job applications and the one-time codes used by the candidate tracking space.
-- Run once in the Supabase SQL editor. Both tables are reached only through the service role (no public policies).

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  job_slug text not null,
  job_title text not null,
  email text not null,
  first_name text,
  last_name text,
  phone text,
  city text,
  locale text,
  photo text,
  status text not null default 'new' check (status in ('new', 'review', 'interview', 'offer', 'declined', 'withdrawn')),
  answers jsonb not null default '{}'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  links jsonb not null default '{}'::jsonb,
  message text,
  files jsonb not null default '[]'::jsonb
);

create index if not exists job_applications_email_idx on public.job_applications (lower(email));
create index if not exists job_applications_created_idx on public.job_applications (created_at desc);

create table if not exists public.job_application_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists job_application_codes_email_idx on public.job_application_codes (email, created_at desc);

alter table public.job_applications enable row level security;
alter table public.job_application_codes enable row level security;
