-- Run after `students.sql` and `classes.sql`.
-- Daily attendance per student, class, and date.

create extension if not exists "pgcrypto";

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id bigint not null references public.students (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  date date not null,
  status text not null check (status in ('present', 'absent')),
  created_at timestamptz not null default now(),
  unique (student_id, class_id, date)
);

create index if not exists attendance_class_date_idx on public.attendance (class_id, date desc);

alter table public.attendance enable row level security;

drop policy if exists "attendance_select_anon" on public.attendance;
drop policy if exists "attendance_insert_anon" on public.attendance;
drop policy if exists "attendance_update_anon" on public.attendance;
drop policy if exists "attendance_delete_anon" on public.attendance;

create policy "attendance_select_anon" on public.attendance for select using (true);
create policy "attendance_insert_anon" on public.attendance for insert with check (true);
create policy "attendance_update_anon" on public.attendance for update using (true);
create policy "attendance_delete_anon" on public.attendance for delete using (true);

grant all on table public.attendance to anon, authenticated;
