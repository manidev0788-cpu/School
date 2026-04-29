-- Run after `students.sql`. Fee entries linked to students.

create extension if not exists "pgcrypto";

create table if not exists public.fees (
  id uuid primary key default gen_random_uuid(),
  student_id bigint not null references public.students (id) on delete cascade,
  amount numeric(14, 2) not null check (amount >= 0),
  status text not null check (status in ('paid', 'pending')),
  payment_date date not null,
  fee_source text not null default 'manual' check (fee_source in ('manual', 'class_assignment')),
  student_name text,
  class_label text,
  created_at timestamptz not null default now()
);

create index if not exists fees_student_id_idx on public.fees (student_id);
create index if not exists fees_payment_date_idx on public.fees (payment_date desc);

create unique index if not exists fees_one_class_assignment_per_student on public.fees (student_id)
where fee_source = 'class_assignment';

alter table public.fees enable row level security;

drop policy if exists "fees_select_anon" on public.fees;
drop policy if exists "fees_insert_anon" on public.fees;
drop policy if exists "fees_update_anon" on public.fees;
drop policy if exists "fees_delete_anon" on public.fees;

create policy "fees_select_anon" on public.fees for select to anon, authenticated using (true);
create policy "fees_insert_anon" on public.fees for insert to anon, authenticated with check (true);
create policy "fees_update_anon" on public.fees for update to anon, authenticated using (true) with check (true);
create policy "fees_delete_anon" on public.fees for delete to anon, authenticated using (true);

grant all on table public.fees to anon, authenticated;
