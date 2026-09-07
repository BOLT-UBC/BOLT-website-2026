import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/serverAuth'

const CIRCUIT_EVENT_ID = 'dea7b900-2284-407f-a4c5-ce21cc61cc2f'

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    // Fetch only the 'fields' JSON from the config table
    const { data, error } = await supabaseAdmin
      .from('application_form_configs')
      .select('fields')
      .eq('event_id', CIRCUIT_EVENT_ID)
      .maybeSingle()

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[events/form-config] Failed to fetch fields:', error)
      return NextResponse.json({ error: 'Failed to fetch form configuration' }, { status: 500 })
    }

    // Return the fields array (or an empty array if not found)
    return NextResponse.json({
      fields: data?.fields || [],
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[events/form-config] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}