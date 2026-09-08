-- Minimal heartbeat table for the GitHub Actions keep-alive workflow.
-- The workflow upserts the single row (id = 1) directly via the service
-- role key every few days so this project registers write activity and
-- Supabase's free-tier auto-pause (no activity for 7 days) never triggers.
-- No RLS policies are added — only the service role (which bypasses RLS)
-- ever touches this table.

CREATE TABLE IF NOT EXISTS keep_alive (
  id SMALLINT PRIMARY KEY DEFAULT 1,
  pinged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE keep_alive ENABLE ROW LEVEL SECURITY;
