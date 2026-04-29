-- If you see: Could not find the 'profile_image' column of 'students' in the schema cache
-- Run this in Supabase SQL Editor, then:
--   NOTIFY pgrst, 'reload schema';

alter table public.students add column if not exists profile_image text;
