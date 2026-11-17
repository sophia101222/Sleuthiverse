-- Improve RLS evaluation and add indexes for common foreign-key joins.
create index if not exists posts_author_id_idx on public.posts(author_id);
create index if not exists posts_category_id_idx on public.posts(category_id);
create index if not exists posts_created_at_idx on public.posts(created_at desc);
create index if not exists comments_post_id_created_at_idx on public.comments(post_id, created_at);
create index if not exists comments_author_id_idx on public.comments(author_id);
create index if not exists comments_parent_id_idx on public.comments(parent_id);
create index if not exists challenges_author_id_idx on public.challenges(author_id);
create index if not exists challenges_created_at_idx on public.challenges(created_at desc);
create index if not exists theories_challenge_id_created_at_idx on public.theories(challenge_id, created_at desc);
create index if not exists theories_author_id_idx on public.theories(author_id);

-- One ALL policy already covers SELECT for challenge authors.
drop policy if exists "Only challenge authors can read answers" on public.challenge_answers;

drop policy if exists "Published posts are public" on public.posts;
create policy "Published posts are public" on public.posts
for select using (status = 'published' or author_id = (select auth.uid()));

drop policy if exists "Members can create posts" on public.posts;
create policy "Members can create posts" on public.posts
for insert to authenticated with check (author_id = (select auth.uid()));

drop policy if exists "Authors can update their posts" on public.posts;
create policy "Authors can update their posts" on public.posts
for update to authenticated
using (author_id = (select auth.uid()))
with check (author_id = (select auth.uid()));

drop policy if exists "Authors can delete their posts" on public.posts;
create policy "Authors can delete their posts" on public.posts
for delete to authenticated using (author_id = (select auth.uid()));

drop policy if exists "Comments are visible with published posts" on public.comments;
create policy "Comments are visible with published posts" on public.comments
for select using (
  exists (
    select 1 from public.posts p
    where p.id = post_id and (p.status = 'published' or p.author_id = (select auth.uid()))
  )
);

drop policy if exists "Members can comment on published posts" on public.comments;
create policy "Members can comment on published posts" on public.comments
for insert to authenticated
with check (
  author_id = (select auth.uid())
  and exists (select 1 from public.posts p where p.id = post_id and p.status = 'published')
);

drop policy if exists "Authors can edit comments" on public.comments;
create policy "Authors can edit comments" on public.comments
for update to authenticated
using (author_id = (select auth.uid()))
with check (author_id = (select auth.uid()));

drop policy if exists "Authors can delete comments" on public.comments;
create policy "Authors can delete comments" on public.comments
for delete to authenticated using (author_id = (select auth.uid()));

drop policy if exists "Published challenges are public" on public.challenges;
create policy "Published challenges are public" on public.challenges
for select using (status = 'published' or author_id = (select auth.uid()));

drop policy if exists "Members can create challenges" on public.challenges;
create policy "Members can create challenges" on public.challenges
for insert to authenticated with check (author_id = (select auth.uid()));

drop policy if exists "Authors can update challenges" on public.challenges;
create policy "Authors can update challenges" on public.challenges
for update to authenticated
using (author_id = (select auth.uid()))
with check (author_id = (select auth.uid()));

drop policy if exists "Authors can delete challenges" on public.challenges;
create policy "Authors can delete challenges" on public.challenges
for delete to authenticated using (author_id = (select auth.uid()));

drop policy if exists "Challenge authors manage answers" on public.challenge_answers;
create policy "Challenge authors manage answers" on public.challenge_answers
for all to authenticated
using (exists (select 1 from public.challenges c where c.id = challenge_id and c.author_id = (select auth.uid())))
with check (exists (select 1 from public.challenges c where c.id = challenge_id and c.author_id = (select auth.uid())));

drop policy if exists "Theory visibility follows author setting" on public.theories;
create policy "Theory visibility follows author setting" on public.theories
for select using (author_id = (select auth.uid()) or visibility = 'public');

drop policy if exists "Members can submit theories" on public.theories;
create policy "Members can submit theories" on public.theories
for insert to authenticated with check (author_id = (select auth.uid()));

drop policy if exists "Authors can update theories" on public.theories;
create policy "Authors can update theories" on public.theories
for update to authenticated
using (author_id = (select auth.uid()))
with check (author_id = (select auth.uid()));

drop policy if exists "Authors can delete theories" on public.theories;
create policy "Authors can delete theories" on public.theories
for delete to authenticated using (author_id = (select auth.uid()));

drop policy if exists "Members can view their saved items" on public.saved_items;
create policy "Members can view their saved items" on public.saved_items
for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Members can save items" on public.saved_items;
create policy "Members can save items" on public.saved_items
for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "Members can remove saved items" on public.saved_items;
create policy "Members can remove saved items" on public.saved_items
for delete to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Members can update their own profile" on public.profiles;
create policy "Members can update their own profile" on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()) and role = (select private.current_profile_role()));
