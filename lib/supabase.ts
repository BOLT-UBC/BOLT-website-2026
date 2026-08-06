import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SECRET_KEY || ''

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Service role client for admin operations (bypasses RLS)
// Only create if service role key is available
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Form field types for application form configuration
export type FormFieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date'

export interface FormField {
  id: string
  label: string
  type: FormFieldType
  required: boolean
  placeholder?: string
  options?: string[] // For select fields
  defaultValue?: string | number | boolean
  order: number
  profileField?: string // Maps to a members column (e.g., 'full_name', 'major', 'graduation_date')
}

export interface TimelineMilestone {
  id: string
  event_id: string
  milestone: string
  date: string | null
  is_complete: boolean
  display_order: number
}

// Database types
export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
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
        Insert: {
          member_id: string
          email: string
          full_name?: string | null
          avatar?: string | null
          role?: 'non_member' | 'bolt_member' | 'executive_member' | 'admin'
          team_id?: string | null
          graduation_date?: string | null
          faculty?: string | null
          major?: string | null
          phone_num?: string | null
          linkedin?: string | null
          bio?: string | null
          pronouns?: string | null
          discord_username?: string | null
          ubc_student_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          member_id?: string
          email?: string
          full_name?: string | null
          avatar?: string | null
          role?: 'non_member' | 'bolt_member' | 'executive_member' | 'admin'
          team_id?: string | null
          graduation_date?: string | null
          faculty?: string | null
          major?: string | null
          phone_num?: string | null
          linkedin?: string | null
          bio?: string | null
          pronouns?: string | null
          discord_username?: string | null
          ubc_student_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          team_id: string
          team_name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          team_id?: string
          team_name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          team_id?: string
          team_name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
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
          created_at: string
          updated_at: string
        }
        Insert: {
          event_id?: string
          event_name: string
          description?: string | null
          image_url?: string | null
          event_date?: string | null
          location?: string | null
          max_capacity?: number | null
          registration_open?: boolean
          registration_deadline?: string | null
          applications_open_date?: string | null
          application_deadline_date?: string | null
          decision_release_date?: string | null
          confirmation_due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          event_id?: string
          event_name?: string
          description?: string | null
          image_url?: string | null
          event_date?: string | null
          location?: string | null
          max_capacity?: number | null
          registration_open?: boolean
          registration_deadline?: string | null
          applications_open_date?: string | null
          application_deadline_date?: string | null
          decision_release_date?: string | null
          confirmation_due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_attendance: {
        Row: {
          registration_id: string
          event_id: string
          member_id: string
          attending: boolean
          status: 'pending' | 'confirmed' | 'cancelled'
          registered_at: string
          notes: string | null
          application_responses: Record<string, unknown>
        }
        Insert: {
          registration_id?: string
          event_id: string
          member_id: string
          attending?: boolean
          status?: 'pending' | 'confirmed' | 'cancelled'
          registered_at?: string
          notes?: string | null
          application_responses?: Record<string, unknown>
        }
        Update: {
          registration_id?: string
          event_id?: string
          member_id?: string
          attending?: boolean
          status?: 'pending' | 'confirmed' | 'cancelled'
          registered_at?: string
          notes?: string | null
          application_responses?: Record<string, unknown>
        }
        Relationships: []
      }
      resumes: {
        Row: {
          resume_id: string
          member_id: string
          resume: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          time_stamp_added: string
        }
        Insert: {
          resume_id?: string
          member_id: string
          resume?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          time_stamp_added?: string
        }
        Update: {
          resume_id?: string
          member_id?: string
          resume?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          time_stamp_added?: string
        }
        Relationships: []
      }
      application_form_configs: {
        Row: {
          id: string
          event_id: string
          fields: FormField[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          fields: FormField[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          fields?: FormField[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_timeline: {
        Row: {
          id: string
          event_id: string
          milestone: string
          date: string | null
          is_complete: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          milestone: string
          date?: string | null
          is_complete?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          milestone?: string
          date?: string | null
          is_complete?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          created_by: string | null
          is_pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          created_by?: string | null
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          created_by?: string | null
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string | null
          link: string
          display_order: number
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          link: string
          display_order?: number
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          link?: string
          display_order?: number
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
