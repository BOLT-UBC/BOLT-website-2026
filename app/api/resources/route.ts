import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, getSupabaseAdmin } from '@/lib/serverAuth'

// GET - Fetch all resources (public)
export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('resources')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch resources' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      resources: data || []
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new resource (admin/executive only)
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (auth.role !== 'admin' && auth.role !== 'executive_member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { title, description, link, display_order } = await request.json()

    if (!title || !link) {
      return NextResponse.json(
        { error: 'Title and link are required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('resources')
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        link: link.trim(),
        display_order: display_order || 0,
        created_by: auth.userId
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create resource', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      resource: data
    }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update a resource (admin/executive only)
export async function PATCH(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (auth.role !== 'admin' && auth.role !== 'executive_member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, title, description, link, display_order } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      )
    }

    const updates: {
      title?: string
      description?: string | null
      link?: string
      display_order?: number
    } = {}

    if (title !== undefined) updates.title = title.trim()
    if (description !== undefined) updates.description = description?.trim() || null
    if (link !== undefined) updates.link = link.trim()
    if (display_order !== undefined) updates.display_order = display_order

    const { data, error } = await supabaseAdmin
      .from('resources')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update resource', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      resource: data
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a resource (admin/executive only)
export async function DELETE(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (auth.role !== 'admin' && auth.role !== 'executive_member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      )
    }

    const { error } = await supabaseAdmin
      .from('resources')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete resource', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

