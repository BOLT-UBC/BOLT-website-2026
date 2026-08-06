import { supabase } from './supabase'
import type { Database } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  profile?: {
    member_id: string
    email: string
    full_name: string | null
    avatar: string | null
    role: 'non_member' | 'bolt_member' | 'executive_member' | 'admin'
    team_id: string | null
    graduation_date: string | null
    major: string | null
    phone_num: string | null
    linkedin: string | null
  }
}

export const authService = {
  // Input validation helper
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 255
  },

  validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' }
    }
    if (password.length > 128) {
      return { valid: false, message: 'Password must be less than 128 characters' }
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' }
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' }
    }
    if (!/(?=.*\d)/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' }
    }
    return { valid: true }
  },

  sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '')
  },

  // Sign up with email and password
  async signUp(email: string, password: string, fullName?: string) {
    // Input validation
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email format')
    }

    const passwordValidation = this.validatePassword(password)
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message)
    }

    const sanitizedEmail = email.toLowerCase().trim()
    const sanitizedFullName = fullName ? this.sanitizeInput(fullName) : undefined

    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        data: {
          full_name: sanitizedFullName
        }
      }
    })

    if (error) throw error
    return { user: data.user, error: null }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    // Input validation
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email format')
    }

    const sanitizedEmail = email.toLowerCase().trim()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password
    })

    if (error) throw error
    return { user: data.user, error: null }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('members')
      .select(`
        *,
        teams:team_id (
          team_id,
          team_name
        )
      `)
      .eq('member_id', userId)
      .single()

    if (error) throw error
    return data
  },

  // Create user profile. Only used as a fallback for the rare case where the
  // on_auth_user_created trigger's row isn't visible yet by the time the
  // client fetches it; RLS restricts member inserts to admins, so this will
  // fail (and be caught by the caller) once the trigger's row already exists.
  async createProfile(user: User, additionalData?: {
    full_name?: string
    role?: 'non_member' | 'bolt_member' | 'executive_member' | 'admin'
    team_id?: string
    graduation_date?: string
    major?: string
    phone_num?: string
    linkedin?: string
  }) {
    const { data, error } = await supabase
      .from('members')
      .insert({
        member_id: user.id,
        email: user.email!,
        full_name: additionalData?.full_name || user.user_metadata?.full_name,
        avatar: user.user_metadata?.avatar_url,
        role: additionalData?.role || 'non_member',
        team_id: additionalData?.team_id,
        graduation_date: additionalData?.graduation_date,
        major: additionalData?.major,
        phone_num: additionalData?.phone_num,
        linkedin: additionalData?.linkedin
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update user profile
  async updateProfile(userId: string, updates: {
    full_name?: string
    avatar?: string
    team_id?: string
    graduation_date?: string
    major?: string
    phone_num?: string
    linkedin?: string
    bio?: string
    pronouns?: string
    discord_username?: string
    ubc_student_id?: string
  }) {
    // Input validation and sanitization
    const sanitizedUpdates: Database['public']['Tables']['members']['Update'] = {}

    if (updates.full_name) {
      sanitizedUpdates.full_name = this.sanitizeInput(updates.full_name)
    }
    if (updates.major) {
      sanitizedUpdates.major = this.sanitizeInput(updates.major)
    }
    if (updates.phone_num) {
      // Basic phone validation
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(updates.phone_num.replace(/[\s\-()]/g, ''))) {
        throw new Error('Invalid phone number format')
      }
      sanitizedUpdates.phone_num = updates.phone_num.replace(/[^\d+()\s]/g, '')
    }
    if (updates.linkedin) {
      // Basic URL validation
      try {
        new URL(updates.linkedin)
        sanitizedUpdates.linkedin = updates.linkedin
      } catch {
        throw new Error('Invalid LinkedIn URL format')
      }
    }
    if (updates.graduation_date !== undefined) {
      sanitizedUpdates.graduation_date = updates.graduation_date
    }
    if (updates.team_id) {
      sanitizedUpdates.team_id = updates.team_id
    }
    if (updates.avatar) {
      sanitizedUpdates.avatar = updates.avatar
    }
    if (updates.bio !== undefined) {
      sanitizedUpdates.bio = updates.bio ? this.sanitizeInput(updates.bio) : null
    }
    if (updates.pronouns !== undefined) {
      sanitizedUpdates.pronouns = updates.pronouns ? this.sanitizeInput(updates.pronouns) : null
    }
    if (updates.discord_username !== undefined) {
      sanitizedUpdates.discord_username = updates.discord_username ? this.sanitizeInput(updates.discord_username) : null
    }
    if (updates.ubc_student_id !== undefined) {
      sanitizedUpdates.ubc_student_id = updates.ubc_student_id ? this.sanitizeInput(updates.ubc_student_id) : null
    }

    const { data, error } = await supabase
      .from('members')
      .update(sanitizedUpdates)
      .eq('member_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Reset password
  async resetPassword(email: string) {
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email format')
    }

    const sanitizedEmail = email.toLowerCase().trim()

    const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) throw error
  },

  // Update password
  async updatePassword(newPassword: string) {
    const passwordValidation = this.validatePassword(newPassword)
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message)
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
  },

  // Update email
  async updateEmail(newEmail: string) {
    if (!this.validateEmail(newEmail)) {
      throw new Error('Invalid email format')
    }

    const sanitizedEmail = newEmail.toLowerCase().trim()

    const { error } = await supabase.auth.updateUser({
      email: sanitizedEmail
    })

    if (error) throw error
  },

  // Delete user account. Runs through the API route because deleting the
  // auth user requires the service-role admin client, which can never be
  // used from a browser module.
  async deleteAccount(userId: string) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const response = await fetch(`/api/account/delete?userId=${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete account')
    }

    return { success: true }
  },

  // Check if user is admin
  async isAdmin(userId: string) {
    const { data, error } = await supabase
      .from('members')
      .select('role')
      .eq('member_id', userId)
      .single()

    if (error) throw error
    return data?.role === 'admin'
  },

  // Check if user is executive or admin
  async isExecutiveOrAdmin(userId: string) {
    const { data, error } = await supabase
      .from('members')
      .select('role')
      .eq('member_id', userId)
      .single()

    if (error) throw error
    return data?.role === 'executive_member' || data?.role === 'admin'
  }
}
