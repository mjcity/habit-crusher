# Habit Crusher

Neo-Brutalist habit tracker with Supabase auth + database.

## Stack
- React + Vite + Tailwind
- Supabase Auth + Postgres + RLS

## Setup
1. Copy `.env.example` to `.env` and add Supabase values.
2. Run SQL in Supabase: `supabase-setup.sql`.
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

## Deploy (GitHub Pages)
```bash
npm run build
# publish dist to gh-pages repository branch/repo
```
