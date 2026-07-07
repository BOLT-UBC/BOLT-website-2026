import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client for admin operations (bypasses RLS)
// Only create if service role key is available
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
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
  profileField?: string // Maps to profile field (e.g., 'full_name', 'major', 'graduation_year')
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
      profiles: {
        Row: {
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
          bio: string | null
          pronouns: string | null
          discord_username: string | null
          ubc_student_id: string | null
          resume_url: string | null
          resume_file_name: string | null
          resume_uploaded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'non_member' | 'bolt_member' | 'executive_member' | 'admin'
          team_id?: string | null
          graduation_year?: number | null
          major?: string | null
          phone?: string | null
          linkedin_url?: string | null
          bio?: string | null
          pronouns?: string | null
          discord_username?: string | null
          ubc_student_id?: string | null
          resume_url?: string | null
          resume_file_name?: string | null
          resume_uploaded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'non_member' | 'bolt_member' | 'executive_member' | 'admin'
          team_id?: string | null
          graduation_year?: number | null
          major?: string | null
          phone?: string | null
          linkedin_url?: string | null
          bio?: string | null
          pronouns?: string | null
          discord_username?: string | null
          ubc_student_id?: string | null
          resume_url?: string | null
          resume_file_name?: string | null
          resume_uploaded_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          date: string | null
          location: string | null
          max_capacity: number | null
          registration_open: boolean
          registration_deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          date?: string | null
          location?: string | null
          max_capacity?: number | null
          registration_open?: boolean
          registration_deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          date?: string | null
          location?: string | null
          max_capacity?: number | null
          registration_open?: boolean
          registration_deadline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string
          status: 'pending' | 'confirmed' | 'cancelled'
          registered_at: string
          notes: string | null
          application_responses: Record<string, unknown>
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          registered_at?: string
          notes?: string | null
          application_responses?: Record<string, unknown>
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          registered_at?: string
          notes?: string | null
          application_responses?: Record<string, unknown>
        }
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
      }
      partners: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          website_url: string | null
          description: string | null
          tier: 'platinum' | 'gold' | 'silver' | 'bronze'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          website_url?: string | null
          description?: string | null
          tier?: 'platinum' | 'gold' | 'silver' | 'bronze'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          website_url?: string | null
          description?: string | null
          tier?: 'platinum' | 'gold' | 'silver' | 'bronze'
          created_at?: string
          updated_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          subscribed_at: string
          active: boolean
        }
        Insert: {
          id?: string
          email: string
          subscribed_at?: string
          active?: boolean
        }
        Update: {
          id?: string
          email?: string
          subscribed_at?: string
          active?: boolean
        }
      }
      resume_uploads: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_url: string
          file_size: number
          file_type: string
          uploaded_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_url: string
          file_size: number
          file_type: string
          uploaded_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_url?: string
          file_size?: number
          file_type?: string
          uploaded_at?: string
          is_active?: boolean
        }
      }
    }
  }
}
