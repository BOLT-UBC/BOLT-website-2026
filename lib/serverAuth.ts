import type { NextRequest } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export interface AuthContext {
  userId: string
  email: string | null
  role: 'non_member' | 'bolt_member' | 'executive_member' | 'admin'
}

function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim()
  }
  return null
}

export async function getAuthContext(request: NextRequest): Promise<AuthContext | null> {
  const accessToken = getBearerToken(request)
  if (!accessToken) return null

  const { data: userData, error } = await supabase.auth.getUser(accessToken)
  if (error || !userData.user) return null

  const userId = userData.user.id

  // Use admin client to bypass RLS - we've already verified the user exists via getUser
  // This is safe because we're only reading the profile of the authenticated user
  if (!supabaseAdmin) {
    // In production, supabaseAdmin should always be configured
    // If not available, we can't reliably get the profile due to RLS
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('SUPABASE_SERVICE_ROLE_KEY not configured - cannot fetch user profile')
    }
    return null
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, email, role')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch user profile:', profileError)
    }
    return null
  }

  return {
    userId: profile.id,
    email: profile.email,
    role: profile.role,
  }
}


