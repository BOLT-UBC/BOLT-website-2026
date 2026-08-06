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
      .from('members')
      .select('*', { count: 'exact', head: true })

    // Get roles and creation dates
    const { data: roleStats } = await supabaseAdmin
      .from('members')
      .select('role, created_at')
      .not('role', 'is', null)

    const roleRegistrations = roleStats?.map(row => ({
      role: row.role,
      createdAt: new Date(row.created_at).getTime()
    })) || []

    const monthlyCounts: Record<string, number> = {}
    roleRegistrations.forEach(reg => {
      const date = new Date(reg.createdAt)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}` // Unique key per month/year
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1
    })

    // Find the highest count in any single month (default to 5 so chart isn't empty)
    const maxMonthlySignups = Math.max(...Object.values(monthlyCounts), 5)

    // Get new signups in the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: newSignups } = await supabaseAdmin
      .from('members')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    // Get new signups in the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count: recentSignups } = await supabaseAdmin
      .from('members')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())

    // Get users with complete profiles (have most fields filled)
    const { data: completeProfiles } = await supabaseAdmin
      .from('members')
      .select('*')
      .not('full_name', 'is', null)
      .not('graduation_date', 'is', null)
      .not('major', 'is', null)

    // Get users with resumes uploaded (resumes now live in their own table)
    const { count: usersWithResumes } = await supabaseAdmin
      .from('resumes')
      .select('member_id', { count: 'exact', head: true })

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      roleRegistrations,
      newSignups: newSignups || 0,
      recentSignups: recentSignups || 0,
      completeProfiles: completeProfiles?.length || 0,
      usersWithResumes: usersWithResumes || 0,
      profileCompletionRate: totalUsers ? Math.round((completeProfiles?.length || 0) / totalUsers * 100) : 0,
      resumeUploadRate: totalUsers ? Math.round((usersWithResumes || 0) / totalUsers * 100) : 0,
      maxMonthlySignups
    })

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[admin/statistics] Unexpected error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
