export interface UserProfile {
  member_id: string
  email: string
  full_name: string | null
  avatar: string | null
  role: 'non_member' | 'bolt_member' | 'executive_member' | 'admin'
  team_id: string | null
  graduation_date: string | null
  faculty: string | null
  major: string | null
  phone_num: string | null
  linkedin: string | null
  bio: string | null
  pronouns: string | null
  discord_username: string | null
  ubc_student_id: string | null
  created_at: string
  updated_at: string
}

export interface Resume {
  resume_id: string
  member_id: string
  resume: string | null
  file_name: string | null
  file_size: number | null
  file_type: string | null
  time_stamp_added: string
}

export interface Event {
  event_id: string
  event_name: string
  description: string | null
  image_url: string | null
  event_date: string | null
  location: string | null
  max_capacity: number | null
  registration_open: boolean
  registration_deadline: string | null
  applications_open_date: string | null
  application_deadline_date: string | null
  decision_release_date: string | null
  confirmation_due_date: string | null
}

export interface Team {
  team_id: string
  team_name: string
  description: string | null
}

export interface AdminStats {
  totalUsers: number
  roleRegistrations: Record<string, number>
  newSignups: number
  recentSignups: number
  completeProfiles: number
  usersWithResumes: number
  profileCompletionRate: number
  resumeUploadRate: number
  maxMonthlySignups: number
}

export interface EditForm {
  full_name: string
  email: string
  graduation_date: string
  major: string
  phone_num: string
  linkedin: string
  bio: string
  pronouns: string
  discord_username: string
  ubc_student_id: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  created_by: string | null
  is_pinned: boolean
  created_at: string
  updated_at: string
  members?: {
    full_name: string | null
    email: string
  } | null
}
