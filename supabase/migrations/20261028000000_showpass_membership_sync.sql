-- Automatic bolt_member approval from Showpass membership purchases.
--
-- Showpass has no API for listing who holds a membership, so buyers are
-- recorded here from its invoice webhooks (app/api/webhooks/showpass) and
-- matched to website accounts by email, in whichever order they happen:
--   * account exists first -> the purchase row promotes it
--   * purchase exists first -> the new account is created as bolt_member
-- A refund/void/transfer-away demotes a bolt_member back to non_member when
-- they have no other active purchase. Executives and admins are never touched.

CREATE TABLE IF NOT EXISTS showpass_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Shared by every webhook event on a transaction, so a later refund,
  -- void or transfer lands on the same row.
  transaction_id TEXT NOT NULL,
  email TEXT NOT NULL,
  customer_name TEXT,
  membership_name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  last_event_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT showpass_memberships_transaction_email_key UNIQUE (transaction_id, email),
  CONSTRAINT showpass_memberships_status_check CHECK (status IN ('active', 'refunded', 'void', 'transferred')),
  CONSTRAINT showpass_memberships_email_lower_check CHECK (email = lower(trim(email)))
);

CREATE INDEX IF NOT EXISTS idx_showpass_memberships_email ON showpass_memberships(email);
CREATE INDEX IF NOT EXISTS idx_members_email_lower ON members(lower(email));

-- Every verified webhook delivery, since Showpass only keeps 15 days of logs.
CREATE TABLE IF NOT EXISTS showpass_webhook_events (
  webhook_event_uuid TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  transaction_id TEXT,
  outcome TEXT,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- No policies: only the service role (webhook route) and the SECURITY
-- DEFINER functions below read or write these tables.
ALTER TABLE showpass_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE showpass_webhook_events ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_showpass_memberships_updated_at ON showpass_memberships;
CREATE TRIGGER update_showpass_memberships_updated_at BEFORE UPDATE ON showpass_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION public.has_active_showpass_membership(p_email TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.showpass_memberships
    WHERE email = lower(trim(p_email)) AND status = 'active'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.has_active_showpass_membership(TEXT) FROM PUBLIC, anon, authenticated;

-- ============================================================================
-- members: role and email are no longer client-writable
-- ============================================================================
-- The "Users can update their own profile" / "Users can insert their own
-- profile" policies are row-scoped, not column-scoped, so before this a
-- signed-in user could set their own role (or claim a paid member's email)
-- straight from the browser. Role changes by admins all go through API
-- routes using the service role, and the signup trigger runs without a JWT,
-- so only browser sessions (anon/authenticated) are pinned here.

CREATE OR REPLACE FUNCTION public.enforce_member_role()
RETURNS TRIGGER AS $$
BEGIN
  IF coalesce(auth.role(), '') IN ('anon', 'authenticated') THEN
    IF TG_OP = 'INSERT' THEN
      NEW.role := 'non_member';
      NEW.email := (SELECT email FROM auth.users WHERE id = NEW.member_id);
    ELSE
      NEW.role := OLD.role;
      NEW.email := OLD.email;
    END IF;
  END IF;

  -- Only on creation, so an admin demoting someone later isn't overridden.
  IF TG_OP = 'INSERT'
     AND NEW.role = 'non_member'
     AND public.has_active_showpass_membership(NEW.email) THEN
    NEW.role := 'bolt_member';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS enforce_member_role ON members;
CREATE TRIGGER enforce_member_role
  BEFORE INSERT OR UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION public.enforce_member_role();

-- ============================================================================
-- showpass_memberships -> members.role
-- ============================================================================

CREATE OR REPLACE FUNCTION public.apply_showpass_membership()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    UPDATE public.members SET role = 'bolt_member'
    WHERE lower(email) = NEW.email AND role = 'non_member';
  ELSIF NOT public.has_active_showpass_membership(NEW.email) THEN
    UPDATE public.members SET role = 'non_member'
    WHERE lower(email) = NEW.email AND role = 'bolt_member';
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS apply_showpass_membership ON showpass_memberships;
CREATE TRIGGER apply_showpass_membership
  AFTER INSERT OR UPDATE OF status ON showpass_memberships
  FOR EACH ROW EXECUTE FUNCTION public.apply_showpass_membership();

-- Trigger-only; keep them off the public /rest/v1/rpc API.
REVOKE EXECUTE ON FUNCTION public.enforce_member_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.apply_showpass_membership() FROM PUBLIC, anon, authenticated;
