create table if not exists public.app_state (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  sku text primary key,
  image text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;
alter table public.product_images enable row level security;

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

create policy "anon can read product_images"
on public.product_images
for select
to anon
using (true);

create policy "anon can insert product_images"
on public.product_images
for insert
to anon
with check (true);

create policy "anon can update product_images"
on public.product_images
for update
to anon
using (true)
with check (true);

create policy "anon can delete product_images"
on public.product_images
for delete
to anon
using (true);
