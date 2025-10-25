import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  profile?: {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    role: 'non_member' | 'platinum_member' | 'executive_member' | 'admin'
    team_id: string | null
    graduation_year: number | null
    major: string | null
    phone: string | null
    linkedin_url: string | null
    resume_url: string | null
    resume_file_name: string | null
    resume_uploaded_at: string | null
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
      .from('profiles')
      .select(`
        *,
        teams:team_id (
          id,
          name
        )
      `)
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  // Create user profile after signup
  async createProfile(user: User, additionalData?: {
    full_name?: string
    role?: 'non_member' | 'platinum_member' | 'executive_member' | 'admin'
    team_id?: string
    graduation_year?: number
    major?: string
    phone?: string
    linkedin_url?: string
  }) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email!,
        full_name: additionalData?.full_name || user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
        role: additionalData?.role || 'non_member',
        team_id: additionalData?.team_id,
        year: additionalData?.year,
        major: additionalData?.major,
        phone: additionalData?.phone,
        linkedin_url: additionalData?.linkedin_url
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update user profile
  async updateProfile(userId: string, updates: {
    full_name?: string
    avatar_url?: string
    team_id?: string
    graduation_year?: number
    major?: string
    phone?: string
    linkedin_url?: string
  }) {
    // Input validation and sanitization
    const sanitizedUpdates: Record<string, string | number | null> = {}

    if (updates.full_name) {
      sanitizedUpdates.full_name = this.sanitizeInput(updates.full_name)
    }
    if (updates.major) {
      sanitizedUpdates.major = this.sanitizeInput(updates.major)
    }
    if (updates.phone) {
      // Basic phone validation
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(updates.phone.replace(/[\s\-()]/g, ''))) {
        throw new Error('Invalid phone number format')
      }
      sanitizedUpdates.phone = updates.phone.replace(/[^\d+()\s]/g, '')
    }
    if (updates.linkedin_url) {
      // Basic URL validation
      try {
        new URL(updates.linkedin_url)
        sanitizedUpdates.linkedin_url = updates.linkedin_url
      } catch {
        throw new Error('Invalid LinkedIn URL format')
      }
    }
    if (updates.graduation_year !== undefined) {
      if (updates.graduation_year < 2020 || updates.graduation_year > 2030) {
        throw new Error('Graduation year must be between 2020 and 2030')
      }
      sanitizedUpdates.graduation_year = updates.graduation_year
    }
    if (updates.team_id) {
      sanitizedUpdates.team_id = updates.team_id
    }
    if (updates.avatar_url) {
      sanitizedUpdates.avatar_url = updates.avatar_url
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(sanitizedUpdates)
      .eq('id', userId)
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

  // Delete user account
  async deleteAccount(userId: string) {
    // First, delete the user's profile (this will cascade to related data)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) throw profileError

    // Then delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) throw authError

    return { success: true }
  },

  // Check if user is admin
  async isAdmin(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data?.role === 'admin'
  },

  // Check if user is executive or admin
  async isExecutiveOrAdmin(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data?.role === 'executive_member' || data?.role === 'admin'
  }
}

