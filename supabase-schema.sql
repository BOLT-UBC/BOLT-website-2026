-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create teams table (for executive departments)
CREATE TABLE teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'non_member' CHECK (role IN ('non_member', 'bolt_member', 'executive_member', 'admin')),
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    graduation_year INTEGER,
    major VARCHAR(255),
    phone VARCHAR(20),
    linkedin_url TEXT,
    bio TEXT,
    pronouns VARCHAR(50),
    discord_username VARCHAR(100),
    ubc_student_id VARCHAR(20),
    resume_url TEXT,
    resume_file_name VARCHAR(255),
    resume_uploaded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(255),
    max_capacity INTEGER,
    registration_open BOOLEAN DEFAULT true,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_registrations table
CREATE TABLE event_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    application_responses JSONB DEFAULT '{}',
    UNIQUE(event_id, user_id)
);

-- Create application_form_configs table (stores form structure per event)
CREATE TABLE application_form_configs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE UNIQUE,
    fields JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_timeline table (flexible timeline milestones per event)
CREATE TABLE event_timeline (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    milestone VARCHAR(255) NOT NULL,
    date TIMESTAMP WITH TIME ZONE,
    is_complete BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partners table
CREATE TABLE partners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    description TEXT,
    tier VARCHAR(50) DEFAULT 'bronze' CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active BOOLEAN DEFAULT true
);

-- Create resume_uploads table
CREATE TABLE resume_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id) -- One active resume per user
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_team_id ON profiles(team_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_status ON event_registrations(status);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_registration_open ON events(registration_open);
CREATE INDEX idx_partners_tier ON partners(tier);
CREATE INDEX idx_resume_uploads_user_id ON resume_uploads(user_id);
CREATE INDEX idx_resume_uploads_active ON resume_uploads(is_active);
CREATE INDEX idx_application_form_configs_event_id ON application_form_configs(event_id);
CREATE INDEX idx_event_timeline_event_id ON event_timeline(event_id);
CREATE INDEX idx_event_timeline_order ON event_timeline(display_order);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_application_form_configs_updated_at BEFORE UPDATE ON application_form_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_timeline_updated_at BEFORE UPDATE ON event_timeline FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_form_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_timeline ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can insert profiles" ON profiles FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Allow profile creation for new users" ON profiles FOR INSERT WITH CHECK (true);

-- Teams policies
CREATE POLICY "Anyone can view teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Admins can manage teams" ON teams FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Events policies
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Event registrations policies
CREATE POLICY "Users can view their own registrations" ON event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register for events" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own registrations" ON event_registrations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all registrations" ON event_registrations FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Partners policies
CREATE POLICY "Anyone can view partners" ON partners FOR SELECT USING (true);
CREATE POLICY "Admins can manage partners" ON partners FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Newsletter subscribers policies
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view newsletter subscribers" ON newsletter_subscribers FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Resume uploads policies
CREATE POLICY "Users can view their own resume" ON resume_uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Non-admin users can upload resume" ON resume_uploads FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('non_member', 'bolt_member', 'executive_member'))
);
CREATE POLICY "Users can update their own resume" ON resume_uploads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own resume" ON resume_uploads FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all resumes" ON resume_uploads FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Application form configs policies
CREATE POLICY "Anyone can view form configs" ON application_form_configs FOR SELECT USING (true);
CREATE POLICY "Admins can manage form configs" ON application_form_configs FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Event timeline policies
CREATE POLICY "Anyone can view event timeline" ON event_timeline FOR SELECT USING (true);
CREATE POLICY "Admins can manage event timeline" ON event_timeline FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Insert initial teams data (executive departments)
INSERT INTO teams (name, description) VALUES
('Leadership', 'Executive leadership team - President, VPs'),
('Advising', 'Advising and mentorship team'),
('Community Relations', 'Community outreach and relations'),
('Case Development', 'Case study development team'),
('Events', 'Event planning and management'),
('Marketing', 'Marketing and communications'),
('Development', 'Technical development team'),
('Club Operations', 'Club operations and logistics'),
('Finance', 'Financial management'),
('First Year Representatives', 'First and second year representatives');

-- Insert initial events data
INSERT INTO events (name, description, image_url, registration_open) VALUES
('First Byte', 'Introduction to BOLT and tech careers', 'byte.webp', true),
('BOLT Connect', 'Networking event with industry professionals', 'bolt-connect.webp', true),
('BOLT Circuit', 'Technical workshops and competitions', 'bolt-circuit.webp', true),
('BOLT Bootcamp', 'Intensive learning program', 'bootcamp.webp', true);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
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

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial partners data
INSERT INTO partners (name, logo_url, tier) VALUES
('Google', 'google.webp', 'platinum'),
('Microsoft', 'microsoft.webp', 'platinum'),
('Deloitte', 'Deloitte.webp', 'gold'),
('Mastercard', 'mastercard.webp', 'gold'),
('CGI', 'cgi.webp', 'silver'),
('Red Bull', 'redbull.webp', 'silver'),
('UBC', 'ubc.webp', 'bronze');
