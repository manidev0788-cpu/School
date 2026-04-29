-- Public bucket for student profile photos (run in Supabase SQL Editor).
-- Optional: Dashboard → Storage → student-images → set file size limit (2 MB) and allowed MIME (jpeg, png).

insert into storage.buckets (id, name, public)
values ('student-images', 'student-images', true)
on conflict (id) do update set public = excluded.public;

-- Allow anyone to read objects (public bucket URLs).
drop policy if exists "student_images_public_select" on storage.objects;
create policy "student_images_public_select"
on storage.objects for select
to public
using (bucket_id = 'student-images');

-- Allow anon + authenticated clients (matches students table API usage).
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
