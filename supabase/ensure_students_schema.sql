-- Idempotent: safe on fresh DB or existing `public.students`.
-- Run via Supabase SQL Editor, psql, or: node --env-file=.env.local scripts/apply-ensure-students.mjs
--
-- Target columns: student_id (registry id), id, name, "class", section, roll_number, tuition,
-- dob + date_of_birth (DATE — mirrored by app), father_* , mother_*,
-- address, city, famous_landmark, admission_date (DATE), profile_image (Storage URL), created_at

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

alter table public.students add column if not exists name text not null default '';
alter table public.students add column if not exists "class" text not null default '';
alter table public.students add column if not exists section text not null default '';
alter table public.students add column if not exists roll_number bigint not null default 0;
alter table public.students add column if not exists student_id text;
alter table public.students add column if not exists tuition bigint not null default 0;
alter table public.students add column if not exists dob date;
alter table public.students add column if not exists address text;
alter table public.students add column if not exists city text;
alter table public.students add column if not exists famous_landmark text;
alter table public.students add column if not exists admission_date date;
alter table public.students add column if not exists profile_image text;
alter table public.students add column if not exists date_of_birth date;
alter table public.students add column if not exists father_phone text;
alter table public.students add column if not exists father_name text;
alter table public.students add column if not exists father_occupation text;
alter table public.students add column if not exists father_qualification text;
alter table public.students add column if not exists mother_name text;
alter table public.students add column if not exists mother_phone text;
alter table public.students add column if not exists mother_occupation text;
alter table public.students add column if not exists mother_qualification text;
alter table public.students add column if not exists created_at timestamptz not null default now();

create unique index if not exists students_student_id_unique on public.students (student_id);

-- If upgrading from old schema (date_of_birth as text): run supabase/migrate_student_dates.sql once.

-- One-time: copy legacy parent_name / parent_phone into structured columns if present, then drop legacy cols.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'students' and column_name = 'parent_name'
  ) then
    update public.students s
    set
      father_name = coalesce(nullif(trim(s.father_name), ''), nullif(trim(split_part(s.parent_name, ' · ', 1)), '')),
      mother_name = coalesce(nullif(trim(s.mother_name), ''), nullif(trim(split_part(s.parent_name, ' · ', 2)), ''))
    where s.parent_name is not null and trim(s.parent_name) <> ''
      and position(' · ' in s.parent_name) > 0;

    update public.students s
    set father_name = coalesce(nullif(trim(s.father_name), ''), nullif(trim(s.parent_name), ''))
    where s.parent_name is not null and trim(s.parent_name) <> ''
      and position(' · ' in s.parent_name) = 0
      and (s.father_name is null or trim(coalesce(s.father_name, '')) = '');
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'students' and column_name = 'parent_phone'
  ) then
    update public.students s
    set father_phone = coalesce(nullif(trim(s.father_phone), ''), nullif(trim(s.parent_phone), ''))
    where (s.father_phone is null or trim(coalesce(s.father_phone, '')) = '')
      and s.parent_phone is not null and trim(s.parent_phone) <> '';
  end if;
end $$;

alter table public.students drop column if exists parent_name;
alter table public.students drop column if exists parent_phone;

-- Prefer legacy text columns when name / class empty
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'students' and column_name = 'full_name'
  ) then
    update public.students s
    set name = coalesce(nullif(trim(s.name), ''), nullif(trim(s.full_name), ''), s.name)
    where coalesce(nullif(trim(s.name), ''), '') = ''
      and coalesce(nullif(trim(s.full_name), ''), '') <> '';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'students' and column_name = 'class_grade'
  ) then
    update public.students s
    set "class" = coalesce(nullif(trim(s."class"), ''), nullif(trim(s.class_grade), ''), s."class")
    where coalesce(nullif(trim(s."class"), ''), '') = ''
      and coalesce(nullif(trim(s.class_grade), ''), '') <> '';
  end if;
end $$;

alter table public.students enable row level security;

drop policy if exists "students_select_anon" on public.students;
drop policy if exists "students_insert_anon" on public.students;
drop policy if exists "students_update_anon" on public.students;
drop policy if exists "students_delete_anon" on public.students;

-- Explicit roles so inserts work for anon key and logged-in Supabase Auth (authenticated).
create policy "students_select_anon" on public.students for select to anon, authenticated using (true);
create policy "students_insert_anon" on public.students for insert to anon, authenticated with check (true);
create policy "students_update_anon" on public.students for update to anon, authenticated using (true) with check (true);
create policy "students_delete_anon" on public.students for delete to anon, authenticated using (true);

grant usage on schema public to anon, authenticated;
grant all on table public.students to anon, authenticated;

-- Test row (bigint PK only)
do $$
declare
  pk_type text;
begin
  select c.data_type into pk_type
  from information_schema.columns c
  where c.table_schema = 'public' and c.table_name = 'students' and c.column_name = 'id';

  if pk_type = 'bigint' then
    insert into public.students (name, "class", section, roll_number, tuition)
    select 'Test Student', '10', 'A', 1, 5000
    where not exists (
      select 1 from public.students s
      where s.name = 'Test Student'
        and coalesce(s."class", '') = '10'
        and coalesce(s.section, '') = 'A'
        and coalesce(s.roll_number::text, '') = '1'
    );
  elsif pk_type = 'uuid' then
    insert into public.students (id, name, "class", section, roll_number, tuition)
    select gen_random_uuid(), 'Test Student', '10', 'A', 1::bigint, 5000::bigint
    where not exists (
      select 1 from public.students s
      where s.name = 'Test Student'
        and coalesce(s."class", '') = '10'
        and coalesce(s.section, '') = 'A'
        and coalesce(s.roll_number::text, '') = '1'
    );
  else
    raise notice 'Skipping test insert: students.id type % — add row manually or align PK.', pk_type;
  end if;
end $$;
