-- Fix ON DELETE behavior on FKs that apply_migration created with default
-- NO ACTION. Deleting a team must not be blocked by members on it; deleting
-- a member must cascade to their resume and event registrations.

ALTER TABLE members DROP CONSTRAINT IF EXISTS members_team_id_fkey;
ALTER TABLE members
  ADD CONSTRAINT members_team_id_fkey
  FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE SET NULL;

ALTER TABLE event_attendance DROP CONSTRAINT IF EXISTS event_attendance_member_id_fkey;
ALTER TABLE event_attendance
  ADD CONSTRAINT event_attendance_member_id_fkey
  FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE;

ALTER TABLE event_attendance DROP CONSTRAINT IF EXISTS event_attendance_event_id_fkey;
ALTER TABLE event_attendance
  ADD CONSTRAINT event_attendance_event_id_fkey
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE;

ALTER TABLE resumes DROP CONSTRAINT IF EXISTS resumes_member_id_fkey;
ALTER TABLE resumes
  ADD CONSTRAINT resumes_member_id_fkey
  FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE;
