import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json()

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 })
    }

    // Validate role
    const validRoles = ['non_member', 'platinum_member', 'executive_member', 'admin']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Update the user's role in the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('email', email.toLowerCase().trim())
      .select()

    if (error) {
      return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Role updated successfully',
      user: data[0]
    })

  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
