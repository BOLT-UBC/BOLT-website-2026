import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseAdmin } from '@/lib/serverAuth'
import { interpretEvent, verifySignature, type MembershipAction, type ShowpassWebhook } from '@/lib/showpass'

// Receives Showpass invoice webhooks and records membership buyers in
// showpass_memberships. Database triggers take it from there: matching
// website accounts are promoted to bolt_member (or demoted on refund/void).
// See supabase/migrations/20261028000000_showpass_membership_sync.sql.
//
// Setup: Showpass dashboard -> Webhooks -> add this URL subscribed to all
// five invoice.* events, then set SHOWPASS_WEBHOOK_SECRET to its key.
// SHOWPASS_ORG_ID is optional and drops payloads from other organizations.

type RecordedAction = Exclude<MembershipAction, { kind: 'ignore' }>

async function recordMembership(supabaseAdmin: SupabaseClient, action: RecordedAction) {
  const rows = action.emails.map((email) => ({
    transaction_id: action.transactionId,
    email,
    customer_name: action.customerName,
    membership_name: action.membershipName,
    status: action.status,
    last_event_type: action.eventType,
  }))

  // Grants never change an existing row, so a resent purchase can't bring
  // back a membership that was already refunded, voided or transferred.
  if (action.kind === 'grant') {
    const { error } = await supabaseAdmin
      .from('showpass_memberships')
      .upsert(rows, { onConflict: 'transaction_id,email', ignoreDuplicates: true })
    if (error) throw error
    return
  }

  // A refund/void cancels the whole transaction, including memberships
  // bought for other people. A transfer only removes the named owner.
  let revoke = supabaseAdmin
    .from('showpass_memberships')
    .update({ status: action.status, last_event_type: action.eventType })
    .eq('transaction_id', action.transactionId)
  if (action.status === 'transferred') revoke = revoke.in('email', action.emails)

  const { data: updated, error } = await revoke.select('email')
  if (error) throw error

  // Purchase never recorded (or not yet arrived): store it already revoked
  // so the late purchase is ignored by the grant path above.
  const updatedEmails = new Set((updated ?? []).map((row) => row.email))
  const missing = rows.filter((row) => !updatedEmails.has(row.email))
  if (missing.length > 0) {
    const { error: insertError } = await supabaseAdmin
      .from('showpass_memberships')
      .upsert(missing, { onConflict: 'transaction_id,email', ignoreDuplicates: true })
    if (insertError) throw insertError
  }
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.SHOWPASS_WEBHOOK_SECRET
    if (!secret) {
      console.error('[showpass webhook] SHOWPASS_WEBHOOK_SECRET is not set')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    let payload: ShowpassWebhook
    try {
      payload = (await request.json()) as ShowpassWebhook
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    // Only `id` is required: the dashboard's "Send test" posts the endpoint's
    // own settings, which have no event_type. interpretEvent ignores those.
    if (payload?.id === undefined || payload.id === null) {
      return NextResponse.json({ error: 'Malformed payload' }, { status: 400 })
    }

    if (!verifySignature(secret, String(payload.id), request.headers.get('x-showpass-signature'))) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    const action = interpretEvent(payload, process.env.SHOWPASS_ORG_ID || undefined)

    if (action.kind !== 'ignore') {
      try {
        await recordMembership(supabaseAdmin, action)
      } catch (error) {
        console.error('[showpass webhook] Failed to record membership:', error)
        // Non-2xx shows as failed in the Showpass dashboard so it can be resent.
        return NextResponse.json({ error: 'Failed to record membership' }, { status: 500 })
      }
    }

    // Our own history, since Showpass only keeps 15 days of webhook logs.
    // Test pings have no webhook_event_uuid, so give them one to log them too.
    {
      const { error: logError } = await supabaseAdmin.from('showpass_webhook_events').upsert(
        {
          webhook_event_uuid: payload.webhook_event_uuid ?? `no-uuid:${randomUUID()}`,
          event_type: payload.event_type ?? 'unknown',
          transaction_id: payload.data?.transaction_id ?? String(payload.id),
          outcome: action.kind === 'ignore' ? `ignore: ${action.reason}` : action.status,
          payload,
        },
        { onConflict: 'webhook_event_uuid', ignoreDuplicates: true }
      )
      if (logError) console.error('[showpass webhook] Failed to log event:', logError)
    }

    return NextResponse.json({ received: true, action: action.kind })
  } catch (error) {
    console.error('[showpass webhook] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
