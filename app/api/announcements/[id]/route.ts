import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, getSupabaseAdmin } from '@/lib/serverAuth'

// PUT - Update an announcement (admin/executive only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or executive
    if (auth.role !== 'admin' && auth.role !== 'executive_member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
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
        error: 'Service role key not configured. Please add SUPABASE_SECRET_KEY to your environment variables.'
      }, { status: 500 })
    }

    // Use service role client (bypasses RLS) - we've already verified permissions above
    const { data, error } = await supabaseAdmin
      .from('announcements')
      .update({
        title: title.trim(),
        content: content.trim(),
        is_pinned: is_pinned !== undefined ? is_pinned : false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        members:created_by (
          full_name,
          email
        )
      `)
      .single()

    if (error) {
      console.error('Error updating announcement:', error)
      return NextResponse.json(
        { error: 'Failed to update announcement', details: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      announcement: data
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an announcement (admin/executive only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or executive
    if (auth.role !== 'admin' && auth.role !== 'executive_member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    // Check if service role client is available
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({
        error: 'Service role key not configured. Please add SUPABASE_SECRET_KEY to your environment variables.'
      }, { status: 500 })
    }

    // Use service role client (bypasses RLS) - we've already verified permissions above
    const { error } = await supabaseAdmin
      .from('announcements')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting announcement:', error)
      return NextResponse.json(
        { error: 'Failed to delete announcement', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Announcement deleted successfully'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

