create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text default 'yellow',
  streak_count integer not null default 0,
  best_streak integer not null default 0,
  last_completed_date date,
  completion_history jsonb not null default '[]'::jsonb,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.habits add column if not exists details jsonb not null default '{}'::jsonb;

alter table public.habits enable row level security;

drop policy if exists "Users can read own habits" on public.habits;
create policy "Users can read own habits" on public.habits
for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own habits" on public.habits;
create policy "Users can insert own habits" on public.habits
for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own habits" on public.habits;
create policy "Users can update own habits" on public.habits
for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own habits" on public.habits;
create policy "Users can delete own habits" on public.habits
for delete using (auth.uid() = user_id);
