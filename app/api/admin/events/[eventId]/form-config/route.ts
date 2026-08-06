import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, getSupabaseAdmin } from '@/lib/serverAuth'
import type { FormField } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ eventId: string }>
}

// GET - Retrieve form configuration for an event
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    // Verify event exists
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('event_id, event_name')
      .eq('event_id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Get form config
    const { data: formConfig, error: configError } = await supabaseAdmin
      .from('application_form_configs')
      .select('*')
      .eq('event_id', eventId)
      .single()

    if (configError && configError.code !== 'PGRST116') {
      // PGRST116 is "not found", which is OK - we'll return null
      // eslint-disable-next-line no-console
      console.error('[form-config] Failed to fetch form config:', configError)
      return NextResponse.json({ error: 'Failed to fetch form config' }, { status: 500 })
    }

    return NextResponse.json({
      formConfig: formConfig || null,
      event: { id: event.event_id, name: event.event_name }
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[form-config] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create form configuration for an event
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

    const { fields } = await request.json() as { fields: FormField[] }

    if (!fields || !Array.isArray(fields)) {
      return NextResponse.json({ error: 'Fields array is required' }, { status: 400 })
    }

    // Validate fields structure
    for (const field of fields) {
      if (!field.id || !field.label || !field.type) {
        return NextResponse.json({ 
          error: 'Each field must have id, label, and type' 
        }, { status: 400 })
      }
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    // Verify event exists
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('event_id')
      .eq('event_id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if config already exists
    const { data: existingConfig } = await supabaseAdmin
      .from('application_form_configs')
      .select('id')
      .eq('event_id', eventId)
      .single()

    if (existingConfig) {
      return NextResponse.json({ 
        error: 'Form config already exists for this event. Use PUT to update.' 
      }, { status: 409 })
    }

    // Create form config
    const { data: formConfig, error: createError } = await supabaseAdmin
      .from('application_form_configs')
      .insert({
        event_id: eventId,
        fields: fields
      })
      .select()
      .single()

    if (createError) {
      // eslint-disable-next-line no-console
      console.error('[form-config] Failed to create form config:', createError)
      return NextResponse.json({ error: 'Failed to create form config' }, { status: 500 })
    }

    return NextResponse.json({ formConfig }, { status: 201 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[form-config] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update form configuration for an event
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

    const { fields } = await request.json() as { fields: FormField[] }

    if (!fields || !Array.isArray(fields)) {
      return NextResponse.json({ error: 'Fields array is required' }, { status: 400 })
    }

    // Validate fields structure
    for (const field of fields) {
      if (!field.id || !field.label || !field.type) {
        return NextResponse.json({ 
          error: 'Each field must have id, label, and type' 
        }, { status: 400 })
      }
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    // Check if config exists
    const { data: existingConfig } = await supabaseAdmin
      .from('application_form_configs')
      .select('id')
      .eq('event_id', eventId)
      .single()

    let formConfig

    if (existingConfig) {
      // Update existing config
      const { data, error: updateError } = await supabaseAdmin
        .from('application_form_configs')
        .update({ fields: fields })
        .eq('event_id', eventId)
        .select()
        .single()

      if (updateError) {
        // eslint-disable-next-line no-console
        console.error('[form-config] Failed to update form config:', updateError)
        return NextResponse.json({ error: 'Failed to update form config' }, { status: 500 })
      }
      formConfig = data
    } else {
      // Create new config (upsert behavior)
      const { data, error: createError } = await supabaseAdmin
        .from('application_form_configs')
        .insert({
          event_id: eventId,
          fields: fields
        })
        .select()
        .single()

      if (createError) {
        // eslint-disable-next-line no-console
        console.error('[form-config] Failed to create form config:', createError)
        return NextResponse.json({ error: 'Failed to create form config' }, { status: 500 })
      }
      formConfig = data
    }

    return NextResponse.json({ formConfig })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[form-config] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete form configuration for an event
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

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    const { error: deleteError } = await supabaseAdmin
      .from('application_form_configs')
      .delete()
      .eq('event_id', eventId)

    if (deleteError) {
      // eslint-disable-next-line no-console
      console.error('[form-config] Failed to delete form config:', deleteError)
      return NextResponse.json({ error: 'Failed to delete form config' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[form-config] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
