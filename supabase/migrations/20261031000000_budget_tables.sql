create table if not exists public.budget_lines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null check (kind in ('revenue', 'expense')),
  category text not null,
  fiscal_year text not null default '2026-2027',
  budget_amount numeric(10, 2),
  ams_extension text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, fiscal_year)
);

create table if not exists public.item_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  kind text not null check (kind in ('revenue', 'expense')),
  ams_account_code text,
  created_at timestamptz not null default now()
);

drop trigger if exists update_budget_lines_updated_at on public.budget_lines;
create trigger update_budget_lines_updated_at before update on public.budget_lines
for each row execute function update_updated_at_column();

alter table public.budget_lines enable row level security;
alter table public.item_types enable row level security;

drop policy if exists "Execs and admins can view budget lines" on public.budget_lines;
create policy "Execs and admins can view budget lines" on public.budget_lines for select
using (auth.uid() in (select member_id from members where role in ('admin', 'executive_member')));

drop policy if exists "Execs and admins can view item types" on public.item_types;
create policy "Execs and admins can view item types" on public.item_types for select
using (auth.uid() in (select member_id from members where role in ('admin', 'executive_member')));

drop policy if exists "Admins can manage budget lines" on public.budget_lines;
create policy "Admins can manage budget lines" on public.budget_lines for all
using (auth.uid() in (select member_id from members where role = 'admin'));

drop policy if exists "Admins can manage item types" on public.item_types;
create policy "Admins can manage item types" on public.item_types for all
using (auth.uid() in (select member_id from members where role = 'admin'));

insert into public.budget_lines (name, kind, category) values
  ('Membership fees', 'revenue', 'Memberships'),
  ('CUS funding Term 1', 'revenue', 'CUS Funding'),
  ('CUS funding Term 2', 'revenue', 'CUS Funding'),
  ('Walter Gage Memorial Fund', 'revenue', 'Grants'),
  ('Company sponsorship', 'revenue', 'Sponsorship'),
  ('Other sponsorships', 'revenue', 'Sponsorship'),
  ('First BYTE', 'expense', 'Event'),
  ('BOLT Connect', 'expense', 'Event'),
  ('TECHForward', 'expense', 'Event'),
  ('BOLT Bootcamp', 'expense', 'Event'),
  ('End of Term Social', 'expense', 'Social'),
  ('End of Year Social', 'expense', 'Social'),
  ('Case Dev ops', 'expense', 'Team operations'),
  ('Finance ops', 'expense', 'Team operations'),
  ('Events ops', 'expense', 'Team operations'),
  ('Marketing ops', 'expense', 'Team operations'),
  ('Corporate Relations ops', 'expense', 'Team operations'),
  ('Tech & Development ops', 'expense', 'Team operations'),
  ('Merchandise', 'expense', 'Merchandise'),
  ('Admin & bank fees', 'expense', 'Admin')
on conflict (name, fiscal_year) do nothing;

insert into public.item_types (name, kind) values
  ('Food & Drinks', 'expense'),
  ('Venue & AV', 'expense'),
  ('Prizes & Swag', 'expense'),
  ('Speaker & Mentor Gifts', 'expense'),
  ('Marketing & Print', 'expense'),
  ('Supplies & Software', 'expense'),
  ('Activities', 'expense'),
  ('Transportation', 'expense'),
  ('Merch', 'expense'),
  ('Bank Fees', 'expense'),
  ('Other', 'expense'),
  ('Membership Fees', 'revenue'),
  ('Sponsorship', 'revenue'),
  ('Grant / Funding', 'revenue'),
  ('Ticket Sales', 'revenue'),
  ('Merch Sales', 'revenue'),
  ('Other Revenue', 'revenue')
on conflict (name) do nothing;

update public.item_types set ams_account_code = '70080' where name = 'Food & Drinks' and ams_account_code is null;
update public.item_types set ams_account_code = '70107' where name = 'Other' and ams_account_code is null;
update public.item_types set ams_account_code = '50070' where name = 'Other Revenue' and ams_account_code is null;
