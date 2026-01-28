import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, getSupabaseAdmin } from '@/lib/serverAuth'

interface RouteParams {
  params: Promise<{ eventId: string }>
}

interface TimelineMilestoneInput {
  id?: string
  milestone: string
  date: string | null
  is_complete?: boolean
  display_order: number
}

// GET - Retrieve timeline milestones for an event
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { eventId } = await params

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    // Verify event exists
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('id, name')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Get timeline milestones
    const { data: milestones, error: milestonesError } = await supabaseAdmin
      .from('event_timeline')
      .select('*')
      .eq('event_id', eventId)
      .order('display_order', { ascending: true })

    if (milestonesError) {
      // eslint-disable-next-line no-console
      console.error('[timeline] Failed to fetch milestones:', milestonesError)
      return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 })
    }

    return NextResponse.json({
      milestones: milestones || [],
      event: { id: event.id, name: event.name }
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[timeline] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update or replace timeline milestones for an event
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { eventId } = await params
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const { milestones } = await request.json() as { milestones: TimelineMilestoneInput[] }

    if (!milestones || !Array.isArray(milestones)) {
      return NextResponse.json({ error: 'Milestones array is required' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    // Verify event exists
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('id')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Delete existing milestones and replace with new ones
    const { error: deleteError } = await supabaseAdmin
      .from('event_timeline')
      .delete()
      .eq('event_id', eventId)

    if (deleteError) {
      // eslint-disable-next-line no-console
      console.error('[timeline] Failed to delete existing milestones:', deleteError)
      return NextResponse.json({ error: 'Failed to update timeline' }, { status: 500 })
    }

    // Insert new milestones if any
    if (milestones.length > 0) {
      const milestonesToInsert = milestones.map((m, index) => ({
        event_id: eventId,
        milestone: m.milestone,
        date: m.date || null,
        is_complete: m.is_complete || false,
        display_order: m.display_order ?? index
      }))

      const { data: insertedMilestones, error: insertError } = await supabaseAdmin
        .from('event_timeline')
        .insert(milestonesToInsert)
        .select()
        .order('display_order', { ascending: true })

      if (insertError) {
        // eslint-disable-next-line no-console
        console.error('[timeline] Failed to insert milestones:', insertError)
        return NextResponse.json({ error: 'Failed to update timeline' }, { status: 500 })
      }

      return NextResponse.json({ milestones: insertedMilestones })
    }

    return NextResponse.json({ milestones: [] })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[timeline] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update a single milestone
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { eventId } = await params
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const { milestoneId, milestone, date, is_complete, display_order } = await request.json()

    if (!milestoneId) {
      return NextResponse.json({ error: 'Milestone ID is required' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    // Build update object
    const updates: Record<string, unknown> = {}
    if (milestone !== undefined) updates.milestone = milestone
    if (date !== undefined) updates.date = date
    if (is_complete !== undefined) updates.is_complete = is_complete
    if (display_order !== undefined) updates.display_order = display_order

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    const { data: updatedMilestone, error: updateError } = await supabaseAdmin
      .from('event_timeline')
      .update(updates)
      .eq('id', milestoneId)
      .eq('event_id', eventId)
      .select()
      .single()

    if (updateError) {
      // eslint-disable-next-line no-console
      console.error('[timeline] Failed to update milestone:', updateError)
      return NextResponse.json({ error: 'Failed to update milestone' }, { status: 500 })
    }

    return NextResponse.json({ milestone: updatedMilestone })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[timeline] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add a new milestone to an event
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { eventId } = await params
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const { milestone, date, is_complete, display_order } = await request.json()

    if (!milestone) {
      return NextResponse.json({ error: 'Milestone name is required' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    // Verify event exists
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('id')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Get the highest display_order if not provided
    let order = display_order
    if (order === undefined) {
      const { data: existingMilestones } = await supabaseAdmin
        .from('event_timeline')
        .select('display_order')
        .eq('event_id', eventId)
        .order('display_order', { ascending: false })
        .limit(1)

      order = existingMilestones && existingMilestones.length > 0 
        ? existingMilestones[0].display_order + 1 
        : 0
    }

    const { data: newMilestone, error: insertError } = await supabaseAdmin
      .from('event_timeline')
      .insert({
        event_id: eventId,
        milestone,
        date: date || null,
        is_complete: is_complete || false,
        display_order: order
      })
      .select()
      .single()

    if (insertError) {
      // eslint-disable-next-line no-console
      console.error('[timeline] Failed to add milestone:', insertError)
      return NextResponse.json({ error: 'Failed to add milestone' }, { status: 500 })
    }

    return NextResponse.json({ milestone: newMilestone }, { status: 201 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[timeline] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a milestone
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { eventId } = await params
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const milestoneId = searchParams.get('milestoneId')

    if (!milestoneId) {
      return NextResponse.json({ error: 'Milestone ID is required' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    const { error: deleteError } = await supabaseAdmin
      .from('event_timeline')
      .delete()
      .eq('id', milestoneId)
      .eq('event_id', eventId)

    if (deleteError) {
      // eslint-disable-next-line no-console
      console.error('[timeline] Failed to delete milestone:', deleteError)
      return NextResponse.json({ error: 'Failed to delete milestone' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[timeline] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
