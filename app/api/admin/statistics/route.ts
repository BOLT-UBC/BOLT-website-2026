import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, getSupabaseAdmin } from '@/lib/serverAuth'

export async function GET(request: NextRequest) {
  try {
    // AuthN / AuthZ: require admin
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Ensure service role client is available (bypasses RLS for admin operations)
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    // Get total users
    const { count: totalUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Get role distribution
    const { data: roleStats } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .not('role', 'is', null)

    const roleDistribution = roleStats?.reduce((acc: Record<string, number>, user: { role: string }) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {}) || {}

    // Get new signups in the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: newSignups } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    // Get new signups in the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count: recentSignups } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())

    // Get users with complete profiles (have most fields filled)
    const { data: completeProfiles } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .not('full_name', 'is', null)
      .not('graduation_year', 'is', null)
      .not('major', 'is', null)

    // Get users with resumes uploaded
    const { count: usersWithResumes } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .not('resume_url', 'is', null)

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      roleDistribution,
      newSignups: newSignups || 0,
      recentSignups: recentSignups || 0,
      completeProfiles: completeProfiles?.length || 0,
      usersWithResumes: usersWithResumes || 0,
      profileCompletionRate: totalUsers ? Math.round((completeProfiles?.length || 0) / totalUsers * 100) : 0,
      resumeUploadRate: totalUsers ? Math.round((usersWithResumes || 0) / totalUsers * 100) : 0
    })

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[admin/statistics] Unexpected error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
