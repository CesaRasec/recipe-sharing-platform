-- Run in the Supabase SQL Editor.
-- Adds recipe photos: a column on recipes plus a public Storage bucket.

alter table public.recipes
  add column if not exists image_url text;

insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view recipe images" on storage.objects;
create policy "Public can view recipe images"
  on storage.objects for select
  using (bucket_id = 'recipe-images');

drop policy if exists "Users can upload recipe images" on storage.objects;
create policy "Users can upload recipe images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'recipe-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update own recipe images" on storage.objects;
create policy "Users can update own recipe images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'recipe-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'recipe-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own recipe images" on storage.objects;
create policy "Users can delete own recipe images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'recipe-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own recipes" on public.recipes;
create policy "Users can update their own recipes"
  on public.recipes for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant update on table public.recipes to authenticated;
