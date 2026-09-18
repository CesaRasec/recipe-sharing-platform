-- Recipe Share — two-table setup
-- Run in the Supabase Dashboard: SQL Editor → New query → paste → Run.
-- Safe to re-run: extra tables from the previous schema are dropped first.

-- ---------------------------------------------------------------------------
-- Remove the previous multi-table schema if it was already applied
-- ---------------------------------------------------------------------------

drop table if exists public.comments cascade;
drop table if exists public.saved_recipes cascade;
drop table if exists public.recipe_likes cascade;
drop table if exists public.recipe_tags cascade;
drop table if exists public.recipe_steps cascade;
drop table if exists public.recipe_ingredients cascade;
drop table if exists public.recipes cascade;
drop table if exists public.profiles cascade;

drop policy if exists "Public can view recipe images" on storage.objects;
drop policy if exists "Users can upload recipe images" on storage.objects;
drop policy if exists "Users can update own recipe images" on storage.objects;
drop policy if exists "Users can delete own recipe images" on storage.objects;

drop function if exists public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 1. profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (char_length(trim(username)) between 1 and 40),
  fullname text not null check (char_length(trim(fullname)) between 1 and 80)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, fullname)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
      split_part(new.email, '@', 1)
    ),
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'fullname'), ''),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. recipes
-- ---------------------------------------------------------------------------

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 120),
  ingredients text[] not null default '{}',
  instructions text not null default '',
  cooking_time integer not null check (cooking_time between 1 and 1440),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  category text not null check (char_length(trim(category)) between 1 and 40)
);

create index recipes_user_id_idx on public.recipes (user_id);
create index recipes_created_at_idx on public.recipes (created_at desc);
create index recipes_category_idx on public.recipes (category);
create index recipes_difficulty_idx on public.recipes (difficulty);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.recipes enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Recipes are viewable by everyone"
  on public.recipes for select
  using (true);

create policy "Users can insert their own recipes"
  on public.recipes for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own recipes"
  on public.recipes for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete their own recipes"
  on public.recipes for delete
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Table grants (RLS still applies)
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on table public.profiles to anon, authenticated;
grant insert, update on table public.profiles to authenticated;

grant select on table public.recipes to anon, authenticated;
grant insert, update, delete on table public.recipes to authenticated;
