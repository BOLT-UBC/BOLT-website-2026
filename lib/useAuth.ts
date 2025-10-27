'use client'

import { supabase } from './supabase'
import { authService, type AuthUser } from './auth'
import { useState, useEffect } from 'react'

// Auth state management hook for React components
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const profile = await authService.getUserProfile(session.user.id)
          setUser({
            ...session.user,
            profile
          } as AuthUser)
        } catch (error) {
          void error
          // If profile doesn't exist, create one (for OAuth users)
          try {
            const newProfile = await authService.createProfile(session.user, {
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
              role: 'non_member'
            })
            setUser({
              ...session.user,
              profile: newProfile
            } as AuthUser)
          } catch (createError) {
            void createError
            setUser(session.user as AuthUser)
          }
        }
      } else {
        setUser(null)
      }
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
            void error
            // If profile doesn't exist, create one (for OAuth users)
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              try {
                const newProfile = await authService.createProfile(session.user, {
                  full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                  role: 'non_member'
                })
                setUser({
                  ...session.user,
                  profile: newProfile
                } as AuthUser)
              } catch (createError) {
                void createError
                setUser(session.user as AuthUser)
              }
            } else {
              setUser(session.user as AuthUser)
            }
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
