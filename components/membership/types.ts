export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'non_member' | 'bolt_member' | 'executive_member' | 'admin'
  team_id: string | null
  graduation_year: number | null
  major: string | null
  phone: string | null
  linkedin_url: string | null
  resume_url: string | null
  resume_file_name: string | null
  resume_uploaded_at: string | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  name: string
  description: string | null
  image_url: string | null
  date: string | null
  location: string | null
  max_capacity: number | null
  registration_open: boolean
  registration_deadline: string | null
}

export interface Team {
  id: string
  name: string
  description: string | null
}

export interface AdminStats {
  totalUsers: number
  roleDistribution: Record<string, number>
  newSignups: number
  recentSignups: number
  completeProfiles: number
  usersWithResumes: number
  profileCompletionRate: number
  resumeUploadRate: number
}

export interface EditForm {
  full_name: string
  email: string
  graduation_year: string
  major: string
  phone: string
  linkedin_url: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  created_by: string | null
  is_pinned: boolean
  created_at: string
  updated_at: string
  profiles?: {
    full_name: string | null
    email: string
  } | null
}
