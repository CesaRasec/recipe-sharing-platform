-- Run in the SQL Editor if Delete recipe fails with a permission error.

drop policy if exists "Users can delete their own recipes" on public.recipes;
create policy "Users can delete their own recipes"
  on public.recipes for delete
  to authenticated
  using (user_id = auth.uid());

grant delete on table public.recipes to authenticated;
