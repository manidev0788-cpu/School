-- Demo students (structured father/mother fields only).
-- Run in Supabase → SQL Editor → Run.
-- If REST/API still errors afterward: SQL Editor → NOTIFY pgrst, 'reload schema'; (see Supabase troubleshooting docs).

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

-- Match ensure_students_schema: migrate legacy cols if present, then remove them.
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

delete from public.students
where (name = 'Harshit Sharma' and roll_number = 101)
   or (name = 'Kanika Verma' and roll_number = 202);

insert into public.students (
  student_id,
  name,
  "class",
  section,
  roll_number,
  tuition,
  dob,
  admission_date,
  father_name,
  father_phone,
  father_occupation,
  father_qualification,
  mother_name,
  mother_phone,
  mother_occupation,
  mother_qualification,
  address,
  city,
  famous_landmark,
  date_of_birth
)
values
  (
    'HAR-1205-01',
    'Harshit Sharma',
    '10',
    'A',
    101,
    8000,
    '2010-05-12'::date,
    '2024-04-01'::date,
    'Rajesh Sharma',
    '9876543210',
    'Business',
    'MBA',
    'Sunita Sharma',
    '9123456780',
    'Homemaker',
    'Graduate',
    'House No 12, Sector 5',
    'Delhi',
    'Near Metro Station',
    '2010-05-12'::date
  ),
  (
    'KAN-2509-01',
    'Kanika Verma',
    '8',
    'B',
    202,
    7000,
    '2012-09-25'::date,
    '2024-04-01'::date,
    'Amit Verma',
    '9812345678',
    'Engineer',
    'B.Tech',
    'Neha Verma',
    '9098765432',
    'Teacher',
    'M.A',
    'Flat 45, Green Park',
    'Noida',
    'Near City Mall',
    '2012-09-25'::date
  );
