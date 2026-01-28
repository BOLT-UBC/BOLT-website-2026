import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, getSupabaseAdmin } from '@/lib/serverAuth'

const BOOTCAMP_EVENT_ID = '2d144452-6cb2-44e3-8cf3-5af2ecf46058'

export async function GET(request: NextRequest) {
  try {
    // AuthN / AuthZ: require admin
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    // Ensure service role client is available (bypasses RLS for admin operations)
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    // Build the query - join with profiles to get user info
    let query = supabaseAdmin
      .from('event_registrations')
      .select(`
        id,
        status,
        registered_at,
        notes,
        application_responses,
        profiles:user_id (
          id,
          email,
          full_name,
          graduation_year,
          major,
          phone,
          linkedin_url
        )
      `)
      .eq('event_id', BOOTCAMP_EVENT_ID)
      .order('registered_at', { ascending: false })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[admin/bootcamp-registrations] Failed to fetch registrations:', {
        message: error.message,
        code: error.code,
        details: error.details,
      })
      return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
    }

    // Filter by search term if provided (search in name or email)
    interface RegistrationWithProfile {
      profiles: {
        full_name: string | null
        email: string
      } | null
    }

    let filteredData = (data || []) as unknown as RegistrationWithProfile[]
    if (search) {
      const searchLower = search.toLowerCase()
      filteredData = filteredData.filter((reg) => {
        const profile = reg.profiles
        if (!profile) return false
        const name = profile.full_name?.toLowerCase() || ''
        const email = profile.email?.toLowerCase() || ''
        return name.includes(searchLower) || email.includes(searchLower)
      })
    }

    return NextResponse.json({
      registrations: filteredData,
      total: filteredData.length,
    })
  } catch (error) {
    console.error('[admin/bootcamp-registrations] Unexpected error:', error)
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

    const { registrationId, status, notes, application_responses } = await request.json()

    if (!registrationId) {
      return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 })
    }

    // Validate status if provided
    if (status && !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Ensure service role client is available
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    // Build update object
    const updates: { status?: string; notes?: string | null; application_responses?: Record<string, unknown> } = {}
    if (status) updates.status = status
    if (notes !== undefined) updates.notes = notes || null
    if (application_responses !== undefined) updates.application_responses = application_responses || {}

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    // Update the registration
    const { data, error } = await supabaseAdmin
      .from('event_registrations')
      .update(updates)
      .eq('id', registrationId)
      .eq('event_id', BOOTCAMP_EVENT_ID)
      .select(`
        id,
        status,
        registered_at,
        notes,
        application_responses,
        profiles:user_id (
          id,
          email,
          full_name,
          graduation_year,
          major,
          phone,
          linkedin_url
        )
      `)
      .single()

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[admin/bootcamp-registrations] Failed to update registration:', error)
      return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      registration: data,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[admin/bootcamp-registrations] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    const { registrationIds, status } = await request.json()

    if (!registrationIds || !Array.isArray(registrationIds) || registrationIds.length === 0) {
      return NextResponse.json({ error: 'Registration IDs are required' }, { status: 400 })
    }

    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Valid status is required' }, { status: 400 })
    }

    // Ensure service role client is available
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    // Bulk update registrations
    const { data, error } = await supabaseAdmin
      .from('event_registrations')
      .update({ status })
      .in('id', registrationIds)
      .eq('event_id', BOOTCAMP_EVENT_ID)
      .select()

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[admin/bootcamp-registrations] Failed to bulk update registrations:', error)
      return NextResponse.json({ error: 'Failed to update registrations' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      updated: data?.length || 0,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[admin/bootcamp-registrations] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

