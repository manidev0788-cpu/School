-- Migrate existing uuid-based `students` (and linked fees / attendance) to bigint ids.
-- Run in Supabase SQL Editor as postgres (or owner). Backup production first.
--
-- Skips automatically if `students.id` is already bigint (safe to re-run).

do $$
declare
  id_type text;
begin
  select c.data_type into id_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'students'
    and c.column_name = 'id';

  if id_type is null then
    raise notice 'No public.students table — run students.sql first.';
    return;
  end if;

  if id_type = 'bigint' then
    raise notice 'students.id is already bigint — migration skipped.';
    return;
  end if;

  if id_type <> 'uuid' then
    raise exception 'Unexpected students.id type: % (expected uuid)', id_type;
  end if;
end $$;

-- Bail out if skipped (Postgres lacks conditional execution after DO block); run remaining only when uuid.
-- Use separate transaction blocks in dashboard: comment/uncomment OR run full script when uuid.

do $$
declare
  id_type text;
begin
  select c.data_type into id_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'students'
    and c.column_name = 'id';

  if id_type is distinct from 'uuid' then
    return;
  end if;

  alter table if exists public.attendance drop constraint if exists attendance_student_id_fkey;
  alter table if exists public.fees drop constraint if exists fees_student_id_fkey;

  alter table public.students rename to students_legacy;

  create table public.students (
    id bigint generated always as identity primary key,
    name text not null default '',
    "class" text not null default '',
    section text not null default '',
    roll_number bigint not null default 0,
    tuition bigint not null default 0,
    created_at timestamptz not null default now()
  );

  insert into public.students (name, "class", section, roll_number, tuition, created_at)
  select
    coalesce(
      nullif(trim(sl.name::text), ''),
      nullif(trim(sl.full_name::text), ''),
      nullif(trim(sl.student_name::text), ''),
      'Unknown'
    ),
    coalesce(nullif(trim(sl.class_grade::text), ''), ''),
    coalesce(nullif(trim(sl.section::text), ''), ''),
    coalesce(
      nullif(regexp_replace(coalesce(sl.roll_no::text, ''), '\D', '', 'g'), '')::bigint,
      0
    ),
    0,
    coalesce(sl.created_at, now())
  from public.students_legacy sl;

  create temporary table _student_id_map on commit drop as
  with
    ordered_old as (
      select id as old_uuid, row_number() over (order by created_at nulls last, id) as rn
      from public.students_legacy
    ),
    ordered_new as (
      select id as new_id, row_number() over (order by created_at nulls last, id) as rn
      from public.students
    )
  select o.old_uuid, n.new_id
  from ordered_old o
  inner join ordered_new n on o.rn = n.rn;

  if (select count(*)::bigint from public.students_legacy) <>
     (select count(*)::bigint from public.students)
  then
    raise exception 'Row count mismatch between students_legacy and students — aborting.';
  end if;

  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'fees') then
    alter table public.fees add column if not exists student_id_new bigint references public.students (id) on delete cascade;

    update public.fees f
    set student_id_new = m.new_id
    from _student_id_map m
    where f.student_id = m.old_uuid;

    alter table public.fees drop column student_id;
    alter table public.fees rename column student_id_new to student_id;
    alter table public.fees alter column student_id set not null;
  end if;

  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'attendance') then
    alter table public.attendance add column if not exists student_id_new bigint references public.students (id) on delete cascade;

    update public.attendance a
    set student_id_new = m.new_id
    from _student_id_map m
    where a.student_id = m.old_uuid;

    alter table public.attendance drop column student_id;
    alter table public.attendance rename column student_id_new to student_id;
    alter table public.attendance alter column student_id set not null;
  end if;
  drop table public.students_legacy;

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

  raise notice 'students migrated to bigint; fees and attendance student_id updated.';
end $$;
