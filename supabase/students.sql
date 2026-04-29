-- Run in Supabase SQL Editor (Dashboard → SQL → New query).
-- Prefer `ensure_students_schema.sql` for incremental ALTERs on existing DBs.

create extension if not exists "pgcrypto";

create table if not exists public.students (
  id bigint generated always as identity primary key,
  name text not null default '',
  "class" text not null default '',
  section text not null default '',
  roll_number bigint not null default 0,
  student_id text,
  tuition bigint not null default 0,
  dob date,
  father_name text,
  father_phone text,
  father_occupation text,
  father_qualification text,
  mother_name text,
  mother_phone text,
  mother_occupation text,
  mother_qualification text,
  address text,
  city text,
  famous_landmark text,
  admission_date date,
  profile_image text,
  date_of_birth date,
  created_at timestamptz not null default now()
);

create unique index if not exists students_student_id_unique on public.students (student_id);

alter table public.students enable row level security;

drop policy if exists "students_select_anon" on public.students;
drop policy if exists "students_insert_anon" on public.students;
drop policy if exists "students_update_anon" on public.students;
drop policy if exists "students_delete_anon" on public.students;

create policy "students_select_anon" on public.students for select to anon, authenticated using (true);
create policy "students_insert_anon" on public.students for insert to anon, authenticated with check (true);
create policy "students_update_anon" on public.students for update to anon, authenticated using (true) with check (true);
create policy "students_delete_anon" on public.students for delete to anon, authenticated using (true);

grant usage on schema public to anon, authenticated;
grant all on table public.students to anon, authenticated;

alter table public.students replica identity full;

insert into public.students (name, "class", section, roll_number, tuition)
select 'Test Student', '10', 'A', 1, 5000
where not exists (
  select 1 from public.students s
  where s.name = 'Test Student'
    and s."class" = '10'
    and s.section = 'A'
    and s.roll_number = 1
);
