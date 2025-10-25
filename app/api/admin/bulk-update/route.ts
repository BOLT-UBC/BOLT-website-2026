import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userIds, updates } = await request.json()

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'User IDs are required' }, { status: 400 })
    }

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Updates are required' }, { status: 400 })
    }

    // Validate role if provided
    if (updates.role) {
      const validRoles = ['non_member', 'platinum_member', 'executive_member', 'admin']
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

    // Update all users
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .in('id', userIds)
      .select()

    if (error) {
      console.error('Error updating users:', error)
      return NextResponse.json({ error: 'Failed to update users' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${data?.length || 0} users successfully`,
      updatedUsers: data
    })

  } catch (error) {
    console.error('Error in bulk-update API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
