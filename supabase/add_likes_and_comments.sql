-- Likes and comments for Recipe Share.
-- Run in the Supabase SQL Editor. Safe to re-run.

-- ---------------------------------------------------------------------------
-- recipe_likes: one like per user per recipe
-- ---------------------------------------------------------------------------

create table if not exists public.recipe_likes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  user_id uuid not null references public.profiles (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  unique (user_id, recipe_id)
);

create index if not exists recipe_likes_recipe_id_idx
  on public.recipe_likes (recipe_id);

create index if not exists recipe_likes_user_id_idx
  on public.recipe_likes (user_id);

-- ---------------------------------------------------------------------------
-- comments: many comments per recipe
-- ---------------------------------------------------------------------------

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  user_id uuid not null references public.profiles (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 2000)
);

create index if not exists comments_recipe_id_idx
  on public.comments (recipe_id, created_at);

create index if not exists comments_user_id_idx
  on public.comments (user_id);

create or replace function public.set_comment_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists on_comment_updated on public.comments;
create trigger on_comment_updated
  before update on public.comments
  for each row execute function public.set_comment_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.recipe_likes enable row level security;
alter table public.comments enable row level security;

drop policy if exists "Likes are viewable by everyone" on public.recipe_likes;
create policy "Likes are viewable by everyone"
  on public.recipe_likes for select
  using (true);

drop policy if exists "Users can like recipes" on public.recipe_likes;
create policy "Users can like recipes"
  on public.recipe_likes for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users can unlike recipes" on public.recipe_likes;
create policy "Users can unlike recipes"
  on public.recipe_likes for delete
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Comments are viewable by everyone" on public.comments;
create policy "Comments are viewable by everyone"
  on public.comments for select
  using (true);

drop policy if exists "Users can insert their own comments" on public.comments;
create policy "Users can insert their own comments"
  on public.comments for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users can update their own comments" on public.comments;
create policy "Users can update their own comments"
  on public.comments for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Users can delete their own comments" on public.comments;
create policy "Users can delete their own comments"
  on public.comments for delete
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Recipe owners can delete comments on their recipes" on public.comments;
create policy "Recipe owners can delete comments on their recipes"
  on public.comments for delete
  to authenticated
  using (
    exists (
      select 1
      from public.recipes
      where recipes.id = comments.recipe_id
        and recipes.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Table grants (RLS still applies)
-- ---------------------------------------------------------------------------

grant select on table public.recipe_likes to anon, authenticated;
grant insert, delete on table public.recipe_likes to authenticated;

grant select on table public.comments to anon, authenticated;
grant insert, update, delete on table public.comments to authenticated;
