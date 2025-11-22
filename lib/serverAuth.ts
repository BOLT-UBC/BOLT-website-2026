import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

// Create admin client on-demand to ensure env vars are read at runtime
// Export this so API routes can use it instead of module-level supabaseAdmin
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    // eslint-disable-next-line no-console
    console.error('[getSupabaseAdmin] Missing env vars:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceRoleKey,
    })
    return null
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function getAuthContext(request: NextRequest): Promise<AuthContext | null> {
  const accessToken = getBearerToken(request)
  if (!accessToken) {
    // eslint-disable-next-line no-console
    console.error('[getAuthContext] No access token found')
    return null
  }

  // Create admin client on-demand to ensure env vars are available
  const adminClient = getSupabaseAdmin()
  if (!adminClient) {
    // eslint-disable-next-line no-console
    console.error('[getAuthContext] Failed to create admin client - check SUPABASE_SERVICE_ROLE_KEY env var')
    return null
  }

  // Use admin client to verify the token and get user
  // This works because admin client has permissions to verify tokens
  const { data: userData, error: getUserError } = await adminClient.auth.getUser(accessToken)
  if (getUserError || !userData.user) {
    // eslint-disable-next-line no-console
    console.error('[getAuthContext] Failed to get user:', {
      error: getUserError?.message,
      code: getUserError?.status,
      hasUser: !!userData?.user,
    })
    return null
  }

  const userId = userData.user.id

  // Use admin client to bypass RLS - we've already verified the user exists via getUser
  // This is safe because we're only reading the profile of the authenticated user
  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('id, email, role')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    // eslint-disable-next-line no-console
    console.error('[getAuthContext] Failed to fetch user profile:', {
      error: profileError?.message,
      code: profileError?.code,
      userId,
      hasProfile: !!profile,
    })
    return null
  }

  return {
    userId: profile.id,
    email: profile.email,
    role: profile.role,
  }
}


