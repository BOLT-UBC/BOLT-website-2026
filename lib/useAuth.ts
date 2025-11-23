'use client'

import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { authService, type AuthUser } from './auth'

// Helper function to add timeout to promises
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    )
  ])
}

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
            try {
              const { error } = await withTimeout(
                supabase.auth.exchangeCodeForSession(authCode),
                10000 // 10 second timeout
              )

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
            } catch (timeoutError) {
              // eslint-disable-next-line no-console
              console.error('OAuth code exchange timed out:', timeoutError)
            }
          }
        }

        let session: Session | null = null
        let sessionError: Error | null = null

        try {
          const result = await withTimeout(
            supabase.auth.getSession(),
            10000 // 10 second timeout
          )
          session = result.data?.session || null
          sessionError = result.error ? new Error(result.error.message) : null
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('Session fetch error:', error)
          }
          sessionError = error instanceof Error ? error : new Error('Unknown error')
        }

        if (!isMounted) {
          setLoading(false)
          return
        }

        if (sessionError) {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('Failed to get session:', sessionError)
          }
          setUser(null)
          setLoading(false)
          return
        }

        if (session?.user) {
          try {
            const profile = await withTimeout(
              authService.getUserProfile(session.user.id),
              10000 // 10 second timeout
            )
            if (!isMounted) return
            setUser({
              ...session.user,
              profile
            } as AuthUser)
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.error('Failed to get user profile:', error)
            }
            if (session.user) {
              try {
                const newProfile = await withTimeout(
                  authService.createProfile(session.user, {
                    full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                    role: 'non_member'
                  }),
                  10000 // 10 second timeout
                )
                if (!isMounted) return
                setUser({
                  ...session.user,
                  profile: newProfile
                } as AuthUser)
              } catch (createError) {
                if (process.env.NODE_ENV === 'development') {
                  // eslint-disable-next-line no-console
                  console.error('Failed to create profile:', createError)
                }
                if (!isMounted) return
                // Set user without profile if profile operations fail
                setUser(session.user as AuthUser)
              }
            }
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        // Catch any unexpected errors
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Auth initialization error:', error)
        }
        if (isMounted) {
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
            const profile = await withTimeout(
              authService.getUserProfile(session.user.id),
              10000 // 10 second timeout
            )
            if (!isMounted) return
            setUser({
              ...session.user,
              profile
            } as AuthUser)
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.error('Failed to get user profile in auth state change:', error)
            }
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              try {
                const newProfile = await withTimeout(
                  authService.createProfile(session.user, {
                    full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                    role: 'non_member'
                  }),
                  10000 // 10 second timeout
                )
                if (!isMounted) return
                setUser({
                  ...session.user,
                  profile: newProfile
                } as AuthUser)
              } catch (createError) {
                if (process.env.NODE_ENV === 'development') {
                  // eslint-disable-next-line no-console
                  console.error('Failed to create profile in auth state change:', createError)
                }
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
