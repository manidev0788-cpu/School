-- Run in Supabase SQL Editor after `students.sql` (or standalone).
-- Classes roster — links to students via matching grade + section.

create extension if not exists "pgcrypto";

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  grade text not null,
  section text not null,
  class_teacher text default '',
  created_at timestamptz not null default now(),
  unique (grade, section)
);

alter table public.classes enable row level security;

drop policy if exists "classes_select_anon" on public.classes;
drop policy if exists "classes_insert_anon" on public.classes;
drop policy if exists "classes_update_anon" on public.classes;
drop policy if exists "classes_delete_anon" on public.classes;

create policy "classes_select_anon" on public.classes for select using (true);
create policy "classes_insert_anon" on public.classes for insert with check (true);
create policy "classes_update_anon" on public.classes for update using (true) with check (true);
create policy "classes_delete_anon" on public.classes for delete using (true);

-- Seed demo rows (optional — skip if you manage classes only via app)
insert into public.classes (grade, section, class_teacher)
values
  ('10', 'A', 'Priya Menon'),
  ('10', 'B', 'Rajesh Iyer'),
  ('9', 'A', 'Ananya Das'),
  ('9', 'B', ''),
  ('8', 'A', 'Meera Krishnan'),
  ('8', 'B', 'Sunita Rao'),
  ('11', 'A', 'Dev Patel')
on conflict (grade, section) do nothing;
