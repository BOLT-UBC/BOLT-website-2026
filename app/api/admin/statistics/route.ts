import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Get role distribution
    const { data: roleStats } = await supabase
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

    const { count: newSignups } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    // Get new signups in the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count: recentSignups } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())

    // Get users with complete profiles (have most fields filled)
    const { data: completeProfiles } = await supabase
      .from('profiles')
      .select('*')
      .not('full_name', 'is', null)
      .not('graduation_year', 'is', null)
      .not('major', 'is', null)

    // Get users with resumes uploaded
    const { count: usersWithResumes } = await supabase
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
    // Failed to get statistics
    void error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
