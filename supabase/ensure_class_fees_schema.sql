-- Idempotent: creates `public.class_fees` + RLS + seed rows (no drops).
-- Run in Supabase SQL Editor or: node --env-file=.env.local scripts/apply-ensure-class-fees.mjs
--
-- Columns: id (bigint PK), class_name (unique), fee_amount (int8), created_at

create extension if not exists "pgcrypto";

create table if not exists public.class_fees (
  id bigint generated always as identity primary key,
  class_name text not null,
  fee_amount bigint not null check (fee_amount >= 0),
  created_at timestamptz not null default now(),
  unique (class_name)
);

alter table public.class_fees enable row level security;

drop policy if exists "class_fees_select_anon" on public.class_fees;
drop policy if exists "class_fees_insert_anon" on public.class_fees;
drop policy if exists "class_fees_update_anon" on public.class_fees;
drop policy if exists "class_fees_delete_anon" on public.class_fees;

create policy "class_fees_select_anon" on public.class_fees for select to anon, authenticated using (true);
create policy "class_fees_insert_anon" on public.class_fees for insert to anon, authenticated with check (true);
create policy "class_fees_update_anon" on public.class_fees for update to anon, authenticated using (true) with check (true);
create policy "class_fees_delete_anon" on public.class_fees for delete to anon, authenticated using (true);

grant usage on schema public to anon, authenticated;
grant all on table public.class_fees to anon, authenticated;

insert into public.class_fees (class_name, fee_amount)
values
  ('Nursery', 2000),
  ('LKG', 2500),
  ('UKG', 3000),
  ('1', 3500),
  ('2', 4000),
  ('3', 4500),
  ('4', 5000),
  ('5', 5500),
  ('6', 6000),
  ('7', 6500),
  ('8', 7000),
  ('9', 7500),
  ('10', 8000),
  ('11', 8500),
  ('12', 9000)
on conflict (class_name) do update set fee_amount = excluded.fee_amount;
