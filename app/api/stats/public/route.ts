import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, getSupabaseAdmin } from '@/lib/serverAuth'

/**
 * Public stats endpoint - accessible to all authenticated users
 * Returns community statistics without sensitive admin data
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication but allow any role
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure service role client is available
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    // Get total users
    const { count: totalUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Get upcoming events count
    const { count: upcomingEvents } = await supabaseAdmin
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('registration_open', true)

    // Get total events
    const { count: totalEvents } = await supabaseAdmin
      .from('events')
      .select('*', { count: 'exact', head: true })

    // Get users with resumes uploaded (for community engagement)
    const { count: usersWithResumes } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .not('resume_url', 'is', null)

    return NextResponse.json({
      totalMembers: totalUsers || 0,
      upcomingEvents: upcomingEvents || 0,
      totalEvents: totalEvents || 0,
      membersWithResumes: usersWithResumes || 0,
    })

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[stats/public] Unexpected error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

