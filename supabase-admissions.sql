create table if not exists public.editions (
  slug text primary key,
  name text not null,
  edition_date date,
  price_cents integer,
  currency text not null default 'eur',
  is_open boolean not null default true,
  sort integer not null default 0
);

insert into public.editions (slug, name, sort) values
  ('aspen-winter-edition', 'Aspen Winter Edition', 1),
  ('new-york-spring-edition', 'New York Spring Edition', 2),
  ('rite-of-summer-saint-tropez', 'Rite of Summer Saint-Tropez', 3),
  ('paris-fall-edition', 'Paris Fall Edition', 4),
  ('msnye-2027-rio-de-janeiro', 'MSNYE 2027', 5)
on conflict (slug) do nothing;

alter table public.editions enable row level security;
drop policy if exists "Editions are readable" on public.editions;
create policy "Editions are readable" on public.editions for select using (true);

create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  edition_slug text not null references public.editions(slug),
  email text not null,
  first_name text,
  last_name text,
  phone text,
  city text,
  country text,
  instagram text,
  places integer not null default 1 check (places between 1 and 2),
  companion_name text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'paid')),
  invitation_code text,
  reviewed_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists admissions_status_idx on public.admissions (status, created_at desc);

alter table public.admissions enable row level security;
drop policy if exists "Members read their admissions" on public.admissions;
create policy "Members read their admissions" on public.admissions
  for select using (auth.uid() = user_id);

alter table public.reservations add column if not exists admission_id uuid references public.admissions(id) on delete set null;

create table if not exists public.invitation_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  created_at timestamptz not null default now()
);
alter table public.invitation_attempts enable row level security;

create or replace function public.claim_invitation(p_code text, p_consent boolean default false)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  inv public.invitations%rowtype;
  tries integer;
begin
  if auth.uid() is null then
    return 'not_found';
  end if;

  select count(*) into tries from public.invitation_attempts
    where user_id = auth.uid() and created_at > now() - interval '15 minutes';
  if tries >= 5 then
    return 'too_many';
  end if;

  select * into inv from public.invitations where code = upper(trim(p_code)) for update;

  if not found then
    insert into public.invitation_attempts (user_id) values (auth.uid());
    return 'not_found';
  end if;

  if inv.user_id = auth.uid() then
    return 'already';
  end if;

  if inv.user_id is not null then
    insert into public.invitation_attempts (user_id) values (auth.uid());
    return 'taken';
  end if;

  update public.invitations
    set user_id = auth.uid(), claimed_at = now(), marketing_consent = coalesce(p_consent, false)
    where id = inv.id;

  insert into public.reservations (user_id, experience_name, experience_date, status)
    values (auth.uid(), inv.experience_name, inv.experience_date, 'confirmed');

  return 'ok';
end;
$$;

revoke all on function public.claim_invitation(text, boolean) from public;
grant execute on function public.claim_invitation(text, boolean) to authenticated;
