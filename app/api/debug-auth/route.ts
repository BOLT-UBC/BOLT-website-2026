import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, getSupabaseAdmin } from '@/lib/serverAuth'

// Debug endpoint to check authentication and environment variables
export async function GET(request: NextRequest) {
  const debugInfo: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    hasAuthHeader: !!request.headers.get('authorization'),
    authHeaderValue: request.headers.get('authorization')?.substring(0, 20) + '...',
    envVars: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    },
  }

  // Try to create admin client
  const adminClient = getSupabaseAdmin()
  debugInfo.adminClientCreated = !!adminClient

  // Try to get auth context
  try {
    const auth = await getAuthContext(request)
    debugInfo.authContext = {
      success: !!auth,
      userId: auth?.userId || null,
      email: auth?.email || null,
      role: auth?.role || null,
    }
  } catch (error) {
    debugInfo.authContext = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }

  return NextResponse.json(debugInfo, { status: 200 })
}

