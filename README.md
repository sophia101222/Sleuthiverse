# Sleuniverse

A universe of clues, cases & curious minds.

Sleuniverse is a mystery-fiction community for readers, puzzle solvers and storytellers.

## Stack
- Next.js 15 / React 19 / TypeScript
- Supabase Auth + PostgreSQL + Row Level Security
- Tailwind CSS 4

## Setup
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Run the SQL in `supabase/migrations/0001_initial_schema.sql` in the Supabase SQL Editor.
5. Run `npm run dev`.

## First implementation milestone
- Supabase browser/server clients and session middleware
- Email/password registration and sign-in
- Member dashboard and sign-out
- Initial schema for profiles, categories, posts, comments, challenges, theories and saved items
- Private answer storage for challenges
- Row Level Security policies

## Safety scope
Investigation tools are for fictional-story consistency, literary analysis and safe educational reference. They do not simulate real-world crimes or provide actionable instructions for harming people.
