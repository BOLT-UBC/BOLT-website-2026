import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthContext } from '@/lib/serverAuth'

export async function POST(request: NextRequest) {
  try {
    // AuthN / AuthZ: require admin
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userIds, updates } = await request.json()

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'User IDs are required' }, { status: 400 })
    }

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Updates are required' }, { status: 400 })
    }

    // Validate role if provided
    if (updates.role) {
      const validRoles = ['non_member', 'bolt_member', 'executive_member', 'admin']
      if (!validRoles.includes(updates.role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
      }
    }

    // Validate graduation year if provided
    if (updates.graduation_year) {
      const year = parseInt(updates.graduation_year)
      if (year < 2020 || year > 2030) {
        return NextResponse.json({ error: 'Graduation year must be between 2020 and 2030' }, { status: 400 })
      }
    }

    // Check if service role client is available
    if (!supabaseAdmin) {
      return NextResponse.json({
        error: 'Service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables.'
      }, { status: 500 })
    }

    // Update all users using service role (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .in('id', userIds)
      .select()

    if (error) {
      // Failed to update users
      void error
      return NextResponse.json({ error: 'Failed to update users' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${data?.length || 0} users successfully`,
      updatedUsers: data
    })

  } catch (error) {
    // Failed to process bulk update
    void error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
