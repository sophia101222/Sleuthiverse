-- Sleuniverse initial database schema
-- Run this file in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Investigator' check (char_length(display_name) between 1 and 32),
  bio text not null default '' check (char_length(bio) <= 280),
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null check (char_length(title) between 3 and 180),
  body text not null check (char_length(body) between 1 and 20000),
  spoiler boolean not null default false,
  status text not null default 'published' check (status in ('published', 'hidden', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 8000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 180),
  premise text not null check (char_length(premise) between 20 and 12000),
  category text not null default 'Other',
  difficulty text not null default 'Intermediate' check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  answer text,
  reveal_at timestamptz,
  status text not null default 'published' check (status in ('published', 'closed', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.theories (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 12000),
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null check (item_type in ('post', 'challenge')),
  item_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(left(new.raw_user_meta_data ->> 'display_name', 32), ''), 'Investigator')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute procedure public.set_updated_at();
create trigger posts_updated_at before update on public.posts
for each row execute procedure public.set_updated_at();
create trigger comments_updated_at before update on public.comments
for each row execute procedure public.set_updated_at();
create trigger challenges_updated_at before update on public.challenges
for each row execute procedure public.set_updated_at();
create trigger theories_updated_at before update on public.theories
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.challenges enable row level security;
alter table public.theories enable row level security;
alter table public.saved_items enable row level security;

create policy "Profiles are viewable by everyone" on public.profiles
for select using (true);
create policy "Members can update their own profile" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id and role = (select p.role from public.profiles p where p.id = auth.uid()));

create policy "Categories are public" on public.categories
for select using (true);

create policy "Published posts are public" on public.posts
for select using (status = 'published' or author_id = auth.uid());
create policy "Members can create posts" on public.posts
for insert to authenticated with check (author_id = auth.uid());
create policy "Authors can update their posts" on public.posts
for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "Authors can delete their posts" on public.posts
for delete to authenticated using (author_id = auth.uid());

create policy "Comments are visible with published posts" on public.comments
for select using (
  exists (select 1 from public.posts p where p.id = post_id and (p.status = 'published' or p.author_id = auth.uid()))
);
create policy "Members can comment" on public.comments
for insert to authenticated with check (author_id = auth.uid());
create policy "Authors can edit comments" on public.comments
for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "Authors can delete comments" on public.comments
for delete to authenticated using (author_id = auth.uid());

create policy "Published challenges are public" on public.challenges
for select using (status = 'published' or author_id = auth.uid());
create policy "Members can create challenges" on public.challenges
for insert to authenticated with check (author_id = auth.uid());
create policy "Authors can update challenges" on public.challenges
for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "Authors can delete challenges" on public.challenges
for delete to authenticated using (author_id = auth.uid());

create policy "Theory visibility follows author setting" on public.theories
for select using (author_id = auth.uid() or visibility = 'public');
create policy "Members can submit theories" on public.theories
for insert to authenticated with check (author_id = auth.uid());
create policy "Authors can update theories" on public.theories
for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "Authors can delete theories" on public.theories
for delete to authenticated using (author_id = auth.uid());

create policy "Members can view their saved items" on public.saved_items
for select to authenticated using (user_id = auth.uid());
create policy "Members can save items" on public.saved_items
for insert to authenticated with check (user_id = auth.uid());
create policy "Members can remove saved items" on public.saved_items
for delete to authenticated using (user_id = auth.uid());

insert into public.categories (name, slug, description, sort_order) values
  ('Agatha Christie', 'agatha-christie', 'The Queen of Crime and her ingenious mysteries.', 1),
  ('Sherlock Holmes', 'sherlock-holmes', 'Holmes, Watson and the art of deduction.', 2),
  ('Japanese Detective Fiction', 'japanese-detective-fiction', 'Classic and contemporary Japanese mysteries.', 3),
  ('Locked-room Mysteries', 'locked-room-mysteries', 'Impossible crimes and fair-play puzzles.', 4),
  ('Writing & Craft', 'writing-and-craft', 'Discuss structure, clues, twists and storytelling.', 5),
  ('General Discussion', 'general-discussion', 'Everything else for curious minds.', 6)
on conflict (slug) do nothing;

grant select on public.profiles, public.categories, public.posts, public.comments, public.challenges, public.theories to anon, authenticated;
grant insert, update, delete on public.profiles, public.posts, public.comments, public.challenges, public.theories, public.saved_items to authenticated;
grant select, insert, delete on public.saved_items to authenticated;
