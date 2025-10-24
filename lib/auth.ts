import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

export interface AuthUser extends User {
  profile?: {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    role: 'non_member' | 'platinum_member' | 'executive_member' | 'admin'
    team_id: string | null
    year: number | null
    major: string | null
    phone: string | null
    linkedin_url: string | null
    resume_url: string | null
    resume_file_name: string | null
    resume_uploaded_at: string | null
  }
}

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    if (error) throw error
    return data
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
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
    year?: number
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
    year?: number
    major?: string
    phone?: string
    linkedin_url?: string
  }) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) throw error
  },

  // Update password
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
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

// Auth state management hook for React components
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user as AuthUser || null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Get user profile
          try {
            const profile = await authService.getUserProfile(session.user.id)
            setUser({
              ...session.user,
              profile
            } as AuthUser)
          } catch (error) {
            console.error('Error fetching user profile:', error)
            setUser(session.user as AuthUser)
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
