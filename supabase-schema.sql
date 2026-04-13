create table if not exists public.app_state (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

create policy "anon can read app_state"
on public.app_state
for select
to anon
using (true);

create policy "anon can insert app_state"
on public.app_state
for insert
to anon
with check (true);

create policy "anon can update app_state"
on public.app_state
for update
to anon
using (true)
with check (true);

alter publication supabase_realtime add table public.app_state;
