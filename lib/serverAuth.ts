import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', userId)
    .single()

  if (!profile) return null

  return {
    userId: profile.id,
    email: profile.email,
    role: profile.role,
  }
}


