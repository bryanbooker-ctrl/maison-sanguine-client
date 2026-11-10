create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  experience_name text not null,
  experience_date date,
  user_id uuid references auth.users(id),
  marketing_consent boolean default false,
  claimed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.invitations enable row level security;

drop policy if exists "Members read their invitations" on public.invitations;
create policy "Members read their invitations" on public.invitations
  for select using (auth.uid() = user_id);

create or replace function public.claim_invitation(p_code text, p_consent boolean default false)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  inv public.invitations%rowtype;
begin
  if auth.uid() is null then
    return 'not_found';
  end if;

  select * into inv from public.invitations where code = upper(trim(p_code)) for update;

  if not found then
    return 'not_found';
  end if;

  if inv.user_id = auth.uid() then
    return 'already';
  end if;

  if inv.user_id is not null then
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
