-- Align the 2026-2027 membership DB with the application schema.
-- Idempotent: safe to run multiple times. Tables are empty, so destructive
-- ALTERs on existing columns are safe.

-- ============================================================================
-- 0. Bootstrap base tables. No-ops against prod, which already has these
--    five tables in this exact bare shape; required for a freshly created
--    dev project that starts with no tables at all.
-- ============================================================================

CREATE TABLE IF NOT EXISTS teams (
  team_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT
);

CREATE TABLE IF NOT EXISTS members (
  member_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  phone_num TEXT,
  full_name TEXT,
  faculty TEXT,
  major TEXT,
  graduation_date DATE,
  avatar TEXT,
  role TEXT,
  team_id UUID REFERENCES teams(team_id),
  linkedin TEXT
);

CREATE TABLE IF NOT EXISTS events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT,
  event_date DATE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS event_attendance (
  member_id UUID REFERENCES members(member_id),
  event_id UUID REFERENCES events(event_id),
  attending BOOLEAN DEFAULT false,
  PRIMARY KEY (member_id, event_id)
);

CREATE TABLE IF NOT EXISTS resumes (
  resume_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(member_id),
  resume TEXT,
  time_stamp_added TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2a. members (was the bare member_id/email/... table, becomes the profile
--     table keyed off auth.users)
-- ============================================================================

ALTER TABLE members ALTER COLUMN member_id DROP DEFAULT;

ALTER TABLE members
  DROP CONSTRAINT IF EXISTS members_member_id_fkey;
ALTER TABLE members
  ADD CONSTRAINT members_member_id_fkey
  FOREIGN KEY (member_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE members ALTER COLUMN email SET NOT NULL;
ALTER TABLE members
  DROP CONSTRAINT IF EXISTS members_email_key;
ALTER TABLE members
  ADD CONSTRAINT members_email_key UNIQUE (email);

ALTER TABLE members ALTER COLUMN role SET DEFAULT 'non_member';
UPDATE members SET role = 'non_member' WHERE role IS NULL;
ALTER TABLE members ALTER COLUMN role SET NOT NULL;
ALTER TABLE members
  DROP CONSTRAINT IF EXISTS members_role_check;
ALTER TABLE members
  ADD CONSTRAINT members_role_check
  CHECK (role IN ('non_member', 'bolt_member', 'executive_member', 'admin'));

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS pronouns TEXT,
  ADD COLUMN IF NOT EXISTS discord_username TEXT,
  ADD COLUMN IF NOT EXISTS ubc_student_id TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Deleting a team must not be blocked by members still on it.
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_team_id_fkey;
ALTER TABLE members
  ADD CONSTRAINT members_team_id_fkey
  FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE SET NULL;

-- ============================================================================
-- 2a. teams
-- ============================================================================

ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE teams
  DROP CONSTRAINT IF EXISTS teams_team_name_key;
ALTER TABLE teams
  ADD CONSTRAINT teams_team_name_key UNIQUE (team_name);

-- ============================================================================
-- 2a. events
-- ============================================================================

ALTER TABLE events ALTER COLUMN event_date TYPE TIMESTAMPTZ USING event_date::TIMESTAMPTZ;

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS max_capacity INTEGER,
  ADD COLUMN IF NOT EXISTS registration_open BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS applications_open_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS application_deadline_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS decision_release_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS confirmation_due_date TIMESTAMPTZ;

-- ============================================================================
-- 2a. event_attendance (was a composite-PK attendance flag table, becomes
--     the registration table)
-- ============================================================================

ALTER TABLE event_attendance
  ADD COLUMN IF NOT EXISTS registration_id UUID DEFAULT gen_random_uuid();

UPDATE event_attendance SET registration_id = gen_random_uuid() WHERE registration_id IS NULL;

ALTER TABLE event_attendance ALTER COLUMN registration_id SET NOT NULL;

ALTER TABLE event_attendance DROP CONSTRAINT IF EXISTS event_attendance_pkey;
ALTER TABLE event_attendance ADD PRIMARY KEY (registration_id);

ALTER TABLE event_attendance
  DROP CONSTRAINT IF EXISTS event_attendance_member_id_event_id_key;
ALTER TABLE event_attendance
  ADD CONSTRAINT event_attendance_member_id_event_id_key UNIQUE (member_id, event_id);

ALTER TABLE event_attendance
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS application_responses JSONB NOT NULL DEFAULT '{}';

ALTER TABLE event_attendance
  DROP CONSTRAINT IF EXISTS event_attendance_status_check;
ALTER TABLE event_attendance
  ADD CONSTRAINT event_attendance_status_check
  CHECK (status IN ('pending', 'confirmed', 'cancelled'));

-- A member or event being deleted must cascade to their registrations,
-- matching the old event_registrations behavior.
ALTER TABLE event_attendance DROP CONSTRAINT IF EXISTS event_attendance_member_id_fkey;
ALTER TABLE event_attendance
  ADD CONSTRAINT event_attendance_member_id_fkey
  FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE;

ALTER TABLE event_attendance DROP CONSTRAINT IF EXISTS event_attendance_event_id_fkey;
ALTER TABLE event_attendance
  ADD CONSTRAINT event_attendance_event_id_fkey
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE;

-- ============================================================================
-- 2a. resumes
-- ============================================================================

ALTER TABLE resumes
  ADD COLUMN IF NOT EXISTS file_name TEXT,
  ADD COLUMN IF NOT EXISTS file_size INTEGER,
  ADD COLUMN IF NOT EXISTS file_type TEXT;

ALTER TABLE resumes
  DROP CONSTRAINT IF EXISTS resumes_member_id_key;
ALTER TABLE resumes
  ADD CONSTRAINT resumes_member_id_key UNIQUE (member_id);

ALTER TABLE resumes DROP CONSTRAINT IF EXISTS resumes_member_id_fkey;
ALTER TABLE resumes
  ADD CONSTRAINT resumes_member_id_fkey
  FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE;

-- ============================================================================
-- 2b. New tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES members(member_id) ON DELETE SET NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  link TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES members(member_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS application_form_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL UNIQUE REFERENCES events(event_id) ON DELETE CASCADE,
  fields JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  milestone TEXT NOT NULL,
  date TIMESTAMPTZ,
  is_complete BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_is_pinned ON announcements(is_pinned);
CREATE INDEX IF NOT EXISTS idx_resources_display_order ON resources(display_order);
CREATE INDEX IF NOT EXISTS idx_application_form_configs_event_id ON application_form_configs(event_id);
CREATE INDEX IF NOT EXISTS idx_event_timeline_event_id ON event_timeline(event_id);
CREATE INDEX IF NOT EXISTS idx_event_timeline_order ON event_timeline(display_order);
CREATE INDEX IF NOT EXISTS idx_members_team_id ON members(team_id);
CREATE INDEX IF NOT EXISTS idx_members_role ON members(role);
CREATE INDEX IF NOT EXISTS idx_event_attendance_event_id ON event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_member_id ON event_attendance(member_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_status ON event_attendance(status);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);

-- ============================================================================
-- 2c. updated_at triggers
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements;
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_application_form_configs_updated_at ON application_form_configs;
CREATE TRIGGER update_application_form_configs_updated_at BEFORE UPDATE ON application_form_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_timeline_updated_at ON event_timeline;
CREATE TRIGGER update_event_timeline_updated_at BEFORE UPDATE ON event_timeline FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2c. handle_new_user — sign-up-then-exec-approves hook
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.members (member_id, email, full_name, avatar, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    'non_member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 2c. RLS
-- ============================================================================

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_form_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_timeline ENABLE ROW LEVEL SECURITY;

-- members: intentionally no blanket "allow insert for anyone" policy — that
-- redundant WITH CHECK (true) policy from the old schema nullified the
-- admin-only check below it. Self-insert is scoped to auth.uid() = member_id
-- instead, added in 20260807000000_allow_self_insert_members.sql.
DROP POLICY IF EXISTS "Users can view all profiles" ON members;
CREATE POLICY "Users can view all profiles" ON members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON members;
CREATE POLICY "Users can update their own profile" ON members FOR UPDATE USING (auth.uid() = member_id);

DROP POLICY IF EXISTS "Admins can insert profiles" ON members;
CREATE POLICY "Admins can insert profiles" ON members FOR INSERT WITH CHECK (auth.uid() IN (SELECT member_id FROM members WHERE role = 'admin'));

DROP POLICY IF EXISTS "Admins can delete profiles" ON members;
CREATE POLICY "Admins can delete profiles" ON members FOR DELETE USING (auth.uid() IN (SELECT member_id FROM members WHERE role = 'admin'));

DROP POLICY IF EXISTS "Anyone can view teams" ON teams;
CREATE POLICY "Anyone can view teams" ON teams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage teams" ON teams;
CREATE POLICY "Admins can manage teams" ON teams FOR ALL USING (auth.uid() IN (SELECT member_id FROM members WHERE role = 'admin'));

DROP POLICY IF EXISTS "Anyone can view events" ON events;
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage events" ON events;
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (auth.uid() IN (SELECT member_id FROM members WHERE role = 'admin'));

-- event_attendance: the bootcamp application page does a direct browser
-- upsert (app/membership/events/bolt-bootcamp/page.tsx), so INSERT/UPDATE
-- policies for the owning member are required — they never existed before.
DROP POLICY IF EXISTS "Users can view their own registrations" ON event_attendance;
CREATE POLICY "Users can view their own registrations" ON event_attendance FOR SELECT USING (auth.uid() = member_id);

DROP POLICY IF EXISTS "Users can register for events" ON event_attendance;
CREATE POLICY "Users can register for events" ON event_attendance FOR INSERT WITH CHECK (auth.uid() = member_id);

DROP POLICY IF EXISTS "Users can update their own registrations" ON event_attendance;
CREATE POLICY "Users can update their own registrations" ON event_attendance FOR UPDATE USING (auth.uid() = member_id);

DROP POLICY IF EXISTS "Admins can view all registrations" ON event_attendance;
CREATE POLICY "Admins can view all registrations" ON event_attendance FOR SELECT USING (auth.uid() IN (SELECT member_id FROM members WHERE role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage all registrations" ON event_attendance;
CREATE POLICY "Admins can manage all registrations" ON event_attendance FOR ALL USING (auth.uid() IN (SELECT member_id FROM members WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can view their own resume" ON resumes;
CREATE POLICY "Users can view their own resume" ON resumes FOR SELECT USING (auth.uid() = member_id);

DROP POLICY IF EXISTS "Users can upload their own resume" ON resumes;
CREATE POLICY "Users can upload their own resume" ON resumes FOR INSERT WITH CHECK (auth.uid() = member_id);

DROP POLICY IF EXISTS "Users can update their own resume" ON resumes;
CREATE POLICY "Users can update their own resume" ON resumes FOR UPDATE USING (auth.uid() = member_id);

DROP POLICY IF EXISTS "Users can delete their own resume" ON resumes;
CREATE POLICY "Users can delete their own resume" ON resumes FOR DELETE USING (auth.uid() = member_id);

DROP POLICY IF EXISTS "Admins can view all resumes" ON resumes;
CREATE POLICY "Admins can view all resumes" ON resumes FOR SELECT USING (auth.uid() IN (SELECT member_id FROM members WHERE role = 'admin'));

DROP POLICY IF EXISTS "Anyone can view announcements" ON announcements;
CREATE POLICY "Anyone can view announcements" ON announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Execs and admins can manage announcements" ON announcements;
CREATE POLICY "Execs and admins can manage announcements" ON announcements FOR ALL USING (auth.uid() IN (SELECT member_id FROM members WHERE role IN ('admin', 'executive_member')));

DROP POLICY IF EXISTS "Anyone can view resources" ON resources;
CREATE POLICY "Anyone can view resources" ON resources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Execs and admins can manage resources" ON resources;
CREATE POLICY "Execs and admins can manage resources" ON resources FOR ALL USING (auth.uid() IN (SELECT member_id FROM members WHERE role IN ('admin', 'executive_member')));

DROP POLICY IF EXISTS "Anyone can view form configs" ON application_form_configs;
CREATE POLICY "Anyone can view form configs" ON application_form_configs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage form configs" ON application_form_configs;
CREATE POLICY "Admins can manage form configs" ON application_form_configs FOR ALL USING (auth.uid() IN (SELECT member_id FROM members WHERE role = 'admin'));

DROP POLICY IF EXISTS "Anyone can view event timeline" ON event_timeline;
CREATE POLICY "Anyone can view event timeline" ON event_timeline FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage event timeline" ON event_timeline;
CREATE POLICY "Admins can manage event timeline" ON event_timeline FOR ALL USING (auth.uid() IN (SELECT member_id FROM members WHERE role = 'admin'));

-- ============================================================================
-- 2c. Storage bucket + policies
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('bolt-resumes-2026', 'bolt-resumes-2026', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload their own resume file" ON storage.objects;
CREATE POLICY "Users can upload their own resume file" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'bolt-resumes-2026' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can read their own resume file" ON storage.objects;
CREATE POLICY "Users can read their own resume file" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'bolt-resumes-2026' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update their own resume file" ON storage.objects;
CREATE POLICY "Users can update their own resume file" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'bolt-resumes-2026' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own resume file" ON storage.objects;
CREATE POLICY "Users can delete their own resume file" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'bolt-resumes-2026' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Admins can read all resume files" ON storage.objects;
CREATE POLICY "Admins can read all resume files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'bolt-resumes-2026' AND
    auth.uid() IN (SELECT member_id FROM members WHERE role = 'admin')
  );

-- ============================================================================
-- 2c. Seed data
-- ============================================================================

INSERT INTO teams (team_name, description) VALUES
('Leadership', 'Executive leadership team - President, VPs'),
('Advising', 'Advising and mentorship team'),
('Community Relations', 'Community outreach and relations'),
('Case Development', 'Case study development team'),
('Events', 'Event planning and management'),
('Marketing', 'Marketing and communications'),
('Development', 'Technical development team'),
('Club Operations', 'Club operations and logistics'),
('Finance', 'Financial management'),
('First Year Representatives', 'First and second year representatives')
ON CONFLICT (team_name) DO NOTHING;

INSERT INTO events (event_id, event_name, description, image_url, registration_open) VALUES
('2d144452-6cb2-44e3-8cf3-5af2ecf46058', 'BOLT Bootcamp', 'Intensive learning program', 'bootcamp.webp', true)
ON CONFLICT (event_id) DO NOTHING;

INSERT INTO events (event_name, description, image_url, registration_open)
SELECT v.event_name, v.description, v.image_url, v.registration_open
FROM (VALUES
  ('First Byte', 'Introduction to BOLT and tech careers', 'byte.webp', true),
  ('BOLT Connect', 'Networking event with industry professionals', 'bolt-connect.webp', true),
  ('Byte University', 'Workshops and open networking with industry professionals', 'bolt-circuit.webp', true)
) AS v(event_name, description, image_url, registration_open)
WHERE NOT EXISTS (SELECT 1 FROM events e WHERE e.event_name = v.event_name);

-- Default bootcamp application form + timeline (formerly
-- scripts/migrate-bootcamp-form-config.sql)
DO $$
DECLARE
    bootcamp_event_id UUID := '2d144452-6cb2-44e3-8cf3-5af2ecf46058';
BEGIN
    IF NOT EXISTS (SELECT 1 FROM application_form_configs WHERE event_id = bootcamp_event_id) THEN
        INSERT INTO application_form_configs (event_id, fields)
        VALUES (
            bootcamp_event_id,
            '[
                {"id": "full_name", "label": "Full Name", "type": "text", "required": true, "order": 0, "profileField": "full_name", "placeholder": "e.g. John Doe"},
                {"id": "email", "label": "Email", "type": "email", "required": true, "order": 1, "profileField": "email", "placeholder": "name@gmail.com"},
                {"id": "major", "label": "Major", "type": "text", "required": true, "order": 2, "profileField": "major", "placeholder": "e.g. Computer Science"},
                {"id": "graduation_date", "label": "Graduation Date", "type": "date", "required": false, "order": 3, "profileField": "graduation_date"},
                {"id": "notes", "label": "Notes", "type": "textarea", "required": false, "order": 4, "placeholder": "Anything else you would like to let us know?"}
            ]'::jsonb
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM event_timeline WHERE event_id = bootcamp_event_id) THEN
        INSERT INTO event_timeline (event_id, milestone, date, is_complete, display_order)
        VALUES
            (bootcamp_event_id, 'Applications Open', NULL, false, 0),
            (bootcamp_event_id, 'Application Deadline', NULL, false, 1),
            (bootcamp_event_id, 'Decision Release', NULL, false, 2),
            (bootcamp_event_id, 'Confirmation Due', NULL, false, 3),
            (bootcamp_event_id, 'Event Day', NULL, false, 4);
    END IF;
END $$;
