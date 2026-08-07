import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, getSupabaseAdmin } from '@/lib/serverAuth'

const CIRCUIT_EVENT_ID = 'dea7b900-2284-407f-a4c5-ce21cc61cc2f'


export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    const { data, error } = await supabaseAdmin
      .from('events')
      .select('applications_open_date, application_deadline_date, decision_release_date, confirmation_due_date, event_date')
      .eq('id', CIRCUIT_EVENT_ID)
      .single()

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[events/timeline] Failed to fetch timeline:', error)
      return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 })
    }

    return NextResponse.json({
      timeline: {
        applicationsOpen: data?.applications_open_date || null,
        applicationDeadline: data?.application_deadline_date || null,
        decisionRelease: data?.decision_release_date || null,
        confirmationDue: data?.confirmation_due_date || null,
        eventDate: data?.event_date || null,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[events/timeline] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // AuthN / AuthZ: require admin
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { applicationsOpen, applicationDeadline, decisionRelease, confirmationDue, eventDate } = await request.json()

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    const updates: {
      applications_open_date?: string | null
      application_deadline_date?: string | null
      decision_release_date?: string | null
      confirmation_due_date?: string | null
      event_date?: string | null
    } = {}

    if (applicationsOpen !== undefined) updates.applications_open_date = applicationsOpen
    if (applicationDeadline !== undefined) updates.application_deadline_date = applicationDeadline
    if (decisionRelease !== undefined) updates.decision_release_date = decisionRelease
    if (confirmationDue !== undefined) updates.confirmation_due_date = confirmationDue
    if (eventDate !== undefined) updates.event_date = eventDate

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('events')
      .update(updates)
      .eq('id', CIRCUIT_EVENT_ID)
      .select('applications_open_date, application_deadline_date, decision_release_date, confirmation_due_date, event_date')
      .single()

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[events/timeline] Failed to update timeline:', error)
      return NextResponse.json({ error: 'Failed to update timeline' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      timeline: {
        applicationsOpen: data?.applications_open_date || null,
        applicationDeadline: data?.application_deadline_date || null,
        decisionRelease: data?.decision_release_date || null,
        confirmationDue: data?.confirmation_due_date || null,
        eventDate: data?.event_date || null,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[events/timeline] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

