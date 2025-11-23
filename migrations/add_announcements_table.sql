-- Create announcements table
CREATE TABLE announcements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX idx_announcements_is_pinned ON announcements(is_pinned);
CREATE INDEX idx_announcements_created_by ON announcements(created_by);

-- Create trigger for updated_at
CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view announcements
CREATE POLICY "Anyone can view announcements"
    ON announcements FOR SELECT
    USING (true);

-- Only admins and executives can create announcements
CREATE POLICY "Admins and executives can create announcements"
    ON announcements FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT id FROM profiles
            WHERE role IN ('admin', 'executive_member')
        )
    );

-- Only admins and executives can update announcements
CREATE POLICY "Admins and executives can update announcements"
    ON announcements FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT id FROM profiles
            WHERE role IN ('admin', 'executive_member')
        )
    );

-- Only admins and executives can delete announcements
CREATE POLICY "Admins and executives can delete announcements"
    ON announcements FOR DELETE
    USING (
        auth.uid() IN (
            SELECT id FROM profiles
            WHERE role IN ('admin', 'executive_member')
        )
    );

