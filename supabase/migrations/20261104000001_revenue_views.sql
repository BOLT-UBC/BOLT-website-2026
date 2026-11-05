create or replace view public.revenue_by_budget_line
with (security_invoker = true) as
select
  b.id as budget_line_id,
  b.name,
  b.category,
  b.fiscal_year,
  b.budget_amount,
  coalesce(sum(r.amount), 0) as total_received,
  count(r.id) as entries
from public.budget_lines b
left join public.revenue r on r.budget_line_id = b.id
where b.kind = 'revenue'
group by b.id, b.name, b.category, b.fiscal_year, b.budget_amount;

create or replace view public.revenue_totals
with (security_invoker = true) as
select
  b.fiscal_year,
  coalesce(sum(r.amount), 0) as total_revenue,
  count(r.id) as entries
from public.budget_lines b
left join public.revenue r on r.budget_line_id = b.id
where b.kind = 'revenue'
group by b.fiscal_year;
