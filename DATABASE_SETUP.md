# BOLT Website Database Setup

This document outlines the database setup for the BOLT website membership portal using Supabase PostgreSQL.

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed
3. Environment variables configured

## Setup Instructions

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Note down your project URL and anon key from the project settings

### 2. Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Schema

Run the SQL schema in `supabase-schema.sql` in your Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the SQL

### 4. Authentication Setup

1. In Supabase dashboard, go to Authentication > Settings
2. Configure your site URL and redirect URLs
3. Enable email confirmations if needed
4. Set up any additional auth providers (Google, GitHub, etc.)

## Database Schema

### Tables

#### `teams`
- Stores executive department information (Leadership, Events, Marketing, etc.)
- Fields: id, name, description, created_at, updated_at
- Used to categorize executive members by their department

#### `profiles`
- Extends Supabase auth.users with additional profile information
- Fields: id (FK to auth.users), email, full_name, avatar_url, role, team_id, year, major, phone, linkedin_url, resume_url, resume_file_name, resume_uploaded_at
- Roles: `non_member`, `platinum_member`, `executive_member`, `admin`
- Resume fields: Only non-admin users can upload resumes

#### `events`
- Stores event information
- Fields: id, name, description, image_url, date, location, max_capacity, registration_open, registration_deadline

#### `event_registrations`
- Tracks user event registrations
- Fields: id, event_id, user_id, status, registered_at, notes

#### `partners`
- Stores partner/sponsor information
- Fields: id, name, logo_url, website_url, description, tier

#### `newsletter_subscribers`
- Newsletter subscription management
- Fields: id, email, subscribed_at, active

#### `resume_uploads`
- Resume file uploads for members (legacy table - now using profiles)
- Fields: id, user_id, file_name, file_url, file_size, file_type, uploaded_at, is_active
- Only non-admin users can upload resumes
- One active resume per user
- **Note**: Resume functionality now uses profile fields (resume_url, resume_file_name, resume_uploaded_at) instead

### Relationships

- `profiles.team_id` → `teams.id`
- `event_registrations.event_id` → `events.id`
- `event_registrations.user_id` → `profiles.id`
- `resume_uploads.user_id` → `profiles.id`

## Usage

### Database Services

The `lib/database.ts` file provides service functions for each table:

```typescript
import { teamService, eventService, profileService } from '@/lib/database'

// Get all teams
const teams = await teamService.getAll()

// Get upcoming events
const events = await eventService.getUpcoming()

// Get user profile (includes resume info)
const profile = await profileService.getById(userId)

// Update profile with resume info
const updatedProfile = await profileService.update(userId, {
  resume_url: 'https://...',
  resume_file_name: 'resume.pdf',
  resume_uploaded_at: new Date().toISOString()
})
```

### Authentication

The `lib/auth.ts` file provides authentication utilities:

```typescript
import { authService } from '@/lib/auth'

// Sign up
await authService.signUp(email, password, fullName)

// Sign in
await authService.signIn(email, password)

// Get current user
const user = await authService.getCurrentUser()
```

### Row Level Security (RLS)

RLS policies are configured to:
- Allow users to view all profiles and events
- Allow users to update only their own profile
- Allow users to register for events
- Restrict admin operations to admin users
- Executive members can access additional features based on their department

## API Routes

You can create API routes in `app/api/` to handle server-side operations:

```typescript
// app/api/events/route.ts
import { eventService } from '@/lib/database'

export async function GET() {
  const events = await eventService.getAll()
  return Response.json(events)
}
```

## Testing

Test the database connection:

```typescript
import { supabase } from '@/lib/supabase'

// Test connection
const { data, error } = await supabase.from('teams').select('*')
if (error) console.error('Database connection failed:', error)
else console.log('Database connected successfully')
```

## Security Notes

- All tables have RLS enabled
- Users can only access their own data where appropriate
- Admin operations require admin role
- Environment variables should be kept secure
- Use the anon key for client-side operations
- Use the service role key only for server-side admin operations
