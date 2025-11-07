'use client'

import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { authService, type AuthUser } from './auth'

// Auth state management hook for React components
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href)
          const authCode = url.searchParams.get('code')
          const errorDescription = url.searchParams.get('error_description')

          if (errorDescription) {
            // eslint-disable-next-line no-console
            console.error('Supabase OAuth error:', decodeURIComponent(errorDescription))
          }

          if (authCode) {
            const { error } = await supabase.auth.exchangeCodeForSession(authCode)

            if (error) {
              // eslint-disable-next-line no-console
              console.error('Failed to exchange OAuth code for session:', error)
            } else {
              url.searchParams.delete('code')
              url.searchParams.delete('state')
              url.searchParams.delete('scope')
              url.searchParams.delete('auth_type')
              url.searchParams.delete('provider')
              url.searchParams.delete('provider_token')

              const cleanedUrl = `${url.pathname}${url.search}${url.hash}`
              window.history.replaceState(window.history.state, '', cleanedUrl)
            }
          }
        }

        const { data: { session } } = await supabase.auth.getSession()

        if (!isMounted) return

        if (session?.user) {
          try {
            const profile = await authService.getUserProfile(session.user.id)
            if (!isMounted) return
            setUser({
              ...session.user,
              profile
            } as AuthUser)
          } catch (error) {
            void error
            if (session.user) {
              try {
                const newProfile = await authService.createProfile(session.user, {
                  full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                  role: 'non_member'
                })
                if (!isMounted) return
                setUser({
                  ...session.user,
                  profile: newProfile
                } as AuthUser)
              } catch (createError) {
                void createError
                if (!isMounted) return
                setUser(session.user as AuthUser)
              }
            }
          }
        } else {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            const profile = await authService.getUserProfile(session.user.id)
            if (!isMounted) return
            setUser({
              ...session.user,
              profile
            } as AuthUser)
          } catch (error) {
            void error
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              try {
                const newProfile = await authService.createProfile(session.user, {
                  full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                  role: 'non_member'
                })
                if (!isMounted) return
                setUser({
                  ...session.user,
                  profile: newProfile
                } as AuthUser)
              } catch (createError) {
                void createError
                if (!isMounted) return
                setUser(session.user as AuthUser)
              }
            } else if (isMounted) {
              setUser(session.user as AuthUser)
            }
          }
        } else if (isMounted) {
          setUser(null)
        }
        if (isMounted) {
          setLoading(false)
        }
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}
