-- The on_auth_user_created trigger (SECURITY DEFINER, owned by postgres,
-- which has BYPASSRLS) was expected to bypass RLS when inserting the new
-- member's row. In practice that bypass did not reliably take effect during
-- real signups via Supabase Auth's own connection, and the insert failed
-- with "new row violates row-level security policy for table members" —
-- confirmed via postgres logs. The app already has a client-side fallback
-- for exactly this (authService.createProfile in lib/auth.ts, invoked
-- automatically by useAuth.ts whenever a profile fetch comes back empty),
-- but that fallback was equally blocked with no self-insert policy in
-- place. This policy is scoped tightly to a user only ever being able to
-- insert a row for their own auth id.

DROP POLICY IF EXISTS "Users can insert their own profile" ON members;
CREATE POLICY "Users can insert their own profile" ON members FOR INSERT WITH CHECK (auth.uid() = member_id);
