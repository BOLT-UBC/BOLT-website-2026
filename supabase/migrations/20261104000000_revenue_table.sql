create table if not exists public.revenue (
  id uuid primary key default gen_random_uuid(),
  amount numeric(10, 2) not null check (amount > 0),
  received_on date not null default current_date,
  budget_line_id uuid not null references public.budget_lines(id),
  item_type_id uuid references public.item_types(id),
  description text,
  entered_by uuid references public.members(member_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_revenue_budget_line_id on public.revenue(budget_line_id);
create index if not exists idx_revenue_received_on on public.revenue(received_on);

drop trigger if exists update_revenue_updated_at on public.revenue;
create trigger update_revenue_updated_at before update on public.revenue
for each row execute function update_updated_at_column();

alter table public.revenue enable row level security;

drop policy if exists "Admins can manage revenue" on public.revenue;
create policy "Admins can manage revenue" on public.revenue for all
using (auth.uid() in (select member_id from members where role = 'admin'));
