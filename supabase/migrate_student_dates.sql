-- One-time: normalize student dates — date_of_birth as DATE (nullable), no EMPTY text.
-- Run in Supabase SQL Editor after backup. Safe to re-run: skips if date_of_birth is already type date.
--
-- Then: NOTIFY pgrst, 'reload schema';

CREATE OR REPLACE FUNCTION public._migrate_student_dates_inner() RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  dt text;
BEGIN
  SELECT c.data_type INTO dt
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = 'students'
    AND c.column_name = 'date_of_birth';

  IF dt IS NULL THEN
    ALTER TABLE public.students ADD COLUMN date_of_birth date;
    RETURN;
  END IF;

  IF dt = 'date' THEN
    RAISE NOTICE 'students.date_of_birth is already type date — nothing to do.';
    RETURN;
  END IF;

  -- Legacy text / varchar: strip EMPTY-like junk
  UPDATE public.students s
  SET date_of_birth = NULL
  WHERE trim(coalesce(s.date_of_birth::text, '')) = ''
     OR lower(trim(s.date_of_birth::text)) IN ('empty', 'null');

  UPDATE public.students s
  SET date_of_birth = NULL
  WHERE s.date_of_birth IS NOT NULL
    AND trim(s.date_of_birth::text) <> ''
    AND trim(s.date_of_birth::text) !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$';

  -- Copy from dob when DOB column already populated
  UPDATE public.students s
  SET date_of_birth = to_char(s.dob, 'YYYY-MM-DD')
  WHERE s.dob IS NOT NULL
    AND (
      s.date_of_birth IS NULL
      OR trim(coalesce(s.date_of_birth::text, '')) = ''
    );

  ALTER TABLE public.students ALTER COLUMN date_of_birth DROP NOT NULL;
  ALTER TABLE public.students ALTER COLUMN date_of_birth DROP DEFAULT;

  ALTER TABLE public.students
    ALTER COLUMN date_of_birth TYPE date
    USING (
      CASE
        WHEN date_of_birth IS NULL THEN NULL::date
        WHEN trim(date_of_birth::text) = '' THEN NULL::date
        ELSE substring(trim(date_of_birth::text) FROM 1 FOR 10)::date
      END
    );

  -- Keep legacy dob column aligned for older queries
  UPDATE public.students s SET dob = s.date_of_birth;

  RAISE NOTICE 'students.date_of_birth migrated to type date.';
END;
$$;

SELECT public._migrate_student_dates_inner();
DROP FUNCTION public._migrate_student_dates_inner();

NOTIFY pgrst, 'reload schema';
