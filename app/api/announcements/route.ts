import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAuthContext, getSupabaseAdmin } from '@/lib/serverAuth'

// GET - Fetch all announcements (public, ordered by pinned first, then by date)
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select(`
        *,
        profiles:created_by (
          full_name,
          email
        )
      `)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching announcements:', error)
      return NextResponse.json(
        { error: 'Failed to fetch announcements' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      announcements: data || []
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new announcement (admin/executive only)
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or executive
    if (auth.role !== 'admin' && auth.role !== 'executive_member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { title, content, is_pinned } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Check if service role client is available
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({
        error: 'Service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables.'
      }, { status: 500 })
    }

    // Use service role client (bypasses RLS) - we've already verified permissions above
    const { data, error } = await supabaseAdmin
      .from('announcements')
      .insert({
        title: title.trim(),
        content: content.trim(),
        created_by: auth.userId,
        is_pinned: is_pinned || false
      })
      .select(`
        *,
        profiles:created_by (
          full_name,
          email
        )
      `)
      .single()

    if (error) {
      console.error('Error creating announcement:', error)
      return NextResponse.json(
        { error: 'Failed to create announcement', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      announcement: data
    }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

