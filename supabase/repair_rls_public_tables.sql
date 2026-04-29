-- ONE-SHOT FIX: RLS errors when saving students/fees, missing profile_image column, and storage policies.
-- Run in Supabase Dashboard → SQL → New query → Run.
-- Then refresh PostgREST (optional): SQL Editor → run: NOTIFY pgrst, 'reload schema';
-- Or wait ~1 min for cache to refresh.
--
-- Uses explicit TO anon, authenticated so inserts work whether the browser uses the anon key only
-- or a logged-in Supabase Auth session (authenticated role).

-- Profile photo URL column (required if you upload images; safe no-op if already present).
alter table public.students add column if not exists profile_image text;

-- ─── students ───────────────────────────────────────────────────────────────
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

-- ─── fees (auto tuition row after student insert) ──────────────────────────
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'fees'
  ) then
    execute 'alter table public.fees enable row level security';
    execute 'drop policy if exists "fees_select_anon" on public.fees';
    execute 'drop policy if exists "fees_insert_anon" on public.fees';
    execute 'drop policy if exists "fees_update_anon" on public.fees';
    execute 'drop policy if exists "fees_delete_anon" on public.fees';
    execute $p$
      create policy "fees_select_anon" on public.fees for select to anon, authenticated using (true)
    $p$;
    execute $p$
      create policy "fees_insert_anon" on public.fees for insert to anon, authenticated with check (true)
    $p$;
    execute $p$
      create policy "fees_update_anon" on public.fees for update to anon, authenticated using (true) with check (true)
    $p$;
    execute $p$
      create policy "fees_delete_anon" on public.fees for delete to anon, authenticated using (true)
    $p$;
    execute 'grant all on table public.fees to anon, authenticated';
  end if;
end $$;

-- ─── class_fees (read catalog for tuition amounts) ────────────────────────
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'class_fees'
  ) then
    execute 'alter table public.class_fees enable row level security';
    execute 'drop policy if exists "class_fees_select_anon" on public.class_fees';
    execute 'drop policy if exists "class_fees_insert_anon" on public.class_fees';
    execute 'drop policy if exists "class_fees_update_anon" on public.class_fees';
    execute 'drop policy if exists "class_fees_delete_anon" on public.class_fees';
    execute $p$
      create policy "class_fees_select_anon" on public.class_fees for select to anon, authenticated using (true)
    $p$;
    execute $p$
      create policy "class_fees_insert_anon" on public.class_fees for insert to anon, authenticated with check (true)
    $p$;
    execute $p$
      create policy "class_fees_update_anon" on public.class_fees for update to anon, authenticated using (true) with check (true)
    $p$;
    execute $p$
      create policy "class_fees_delete_anon" on public.class_fees for delete to anon, authenticated using (true)
    $p$;
    execute 'grant all on table public.class_fees to anon, authenticated';
  end if;
end $$;

-- ─── Storage: profile images (optional — safe if bucket missing) ───────────
-- Re-applies same rules as storage_student_images.sql.
insert into storage.buckets (id, name, public)
values ('student-images', 'student-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "student_images_public_select" on storage.objects;
create policy "student_images_public_select"
on storage.objects for select
to public
using (bucket_id = 'student-images');

drop policy if exists "student_images_insert" on storage.objects;
create policy "student_images_insert"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'student-images');

drop policy if exists "student_images_update" on storage.objects;
create policy "student_images_update"
on storage.objects for update
to anon, authenticated
using (bucket_id = 'student-images')
with check (bucket_id = 'student-images');

drop policy if exists "student_images_delete" on storage.objects;
create policy "student_images_delete"
on storage.objects for delete
to anon, authenticated
using (bucket_id = 'student-images');
