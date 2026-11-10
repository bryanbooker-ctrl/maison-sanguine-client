alter table public.admissions add column if not exists activity text;
alter table public.admissions add column if not exists website text;
alter table public.admissions add column if not exists birth_year integer;
alter table public.admissions add column if not exists partner_consent boolean not null default false;
alter table public.admissions add column if not exists personal_host boolean not null default false;
