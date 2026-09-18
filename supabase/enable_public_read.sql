-- Optional: run if the home page cannot read recipes.
-- Table Editor → SQL Editor. Allows public SELECT on both tables.

alter table public.profiles enable row level security;
alter table public.recipes enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Recipes are viewable by everyone" on public.recipes;
create policy "Recipes are viewable by everyone"
  on public.recipes for select
  using (true);

grant usage on schema public to anon, authenticated;
grant select on table public.profiles to anon, authenticated;
grant select on table public.recipes to anon, authenticated;
