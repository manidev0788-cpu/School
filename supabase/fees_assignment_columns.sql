-- Run once if `fees` already existed WITHOUT assignment columns (additive migration).

alter table public.fees add column if not exists fee_source text not null default 'manual';

alter table public.fees drop constraint if exists fees_fee_source_check;
alter table public.fees add constraint fees_fee_source_check check (fee_source in ('manual', 'class_assignment'));

alter table public.fees add column if not exists student_name text;
alter table public.fees add column if not exists class_label text;

update public.fees set fee_source = coalesce(nullif(fee_source, ''), 'manual');

create unique index if not exists fees_one_class_assignment_per_student on public.fees (student_id)
where fee_source = 'class_assignment';
