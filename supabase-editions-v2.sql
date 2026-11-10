alter table public.editions add column if not exists headline text;
alter table public.editions add column if not exists start_time text;
alter table public.editions add column if not exists video_url text;
alter table public.editions add column if not exists poster_url text;
alter table public.editions add column if not exists logo_url text;

update public.editions set headline = 'Winter Edition at Aspen', start_time = '21:30' where slug = 'aspen-winter-edition';
update public.editions set headline = 'Spring Edition at New York' where slug = 'new-york-spring-edition';
update public.editions set headline = 'Rite of Summer at Saint-Tropez' where slug = 'rite-of-summer-saint-tropez';
update public.editions set headline = 'Fall Edition at Paris' where slug = 'paris-fall-edition';
update public.editions set headline = 'New Year''s Eve 2027' where slug = 'msnye-2027-rio-de-janeiro';
