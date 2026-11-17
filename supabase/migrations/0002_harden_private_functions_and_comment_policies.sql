-- Keep privileged trigger helpers outside the exposed public API schema.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $func$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(left(new.raw_user_meta_data ->> 'display_name', 32), ''), 'Investigator')
  )
  on conflict (id) do nothing;
  return new;
end;
$func$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure private.handle_new_user();

drop policy if exists "Members can update their own profile" on public.profiles;
drop function if exists public.current_profile_role();

create or replace function private.current_profile_role()
returns text
language sql
security definer
set search_path = ''
as 'select role from public.profiles where id = auth.uid()';

revoke all on function private.current_profile_role() from public, anon;
grant execute on function private.current_profile_role() to authenticated;

create policy "Members can update their own profile" on public.profiles
for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id and role = private.current_profile_role());

drop policy if exists "Members can comment" on public.comments;
create policy "Members can comment on published posts" on public.comments
for insert to authenticated
with check (
  author_id = auth.uid()
  and exists (
    select 1 from public.posts p
    where p.id = post_id and p.status = 'published'
  )
);
