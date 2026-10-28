import { createHmac, timingSafeEqual } from 'crypto'

// Pure helpers for the Showpass webhook (app/api/webhooks/showpass), kept
// separate from the route so they can be tested without a request/database.
// Payload docs: https://dev.showpass.com/webhooks/webhooks-payload-invoice-object
// Signature docs: https://dev.showpass.com/webhooks/webhooks-security

export interface ShowpassItem {
  invoice_item_type?: string
  ticket_item_type?: string
  ticket_type_name?: string | null
  email_on_ticket?: string | null
}

export interface ShowpassWebhook {
  // Transaction id, shared by every event on a transaction. The only signed field.
  id: string | number
  // Missing on the dashboard's "Send test" ping.
  event_type?: string
  // Unique per delivery.
  webhook_event_uuid?: string
  data?: {
    transaction_id?: string
    showpass_organization_id?: string | number
    customer_name?: string | null
    customer_email?: string | null
    invoice_items?: ShowpassItem[]
    ticket_items?: ShowpassItem[]
  }
}

export type MembershipStatus = 'active' | 'refunded' | 'void' | 'transferred'

export type MembershipAction =
  | { kind: 'ignore'; reason: string }
  | {
      kind: 'grant' | 'revoke'
      status: MembershipStatus
      transactionId: string
      emails: string[]
      customerName: string | null
      membershipName: string | null
      eventType: string
    }

// Transfers are unverified: the docs don't say which email each side
// carries. Assumed here that invoice.transfer names the receiver (gains
// access) and invoice.transferred names the original owner (loses it).
// Confirm with a real transfer before relying on this.
const STATUS_BY_EVENT: Record<string, MembershipStatus> = {
  'invoice.purchase': 'active',
  'invoice.transfer': 'active',
  'invoice.refund': 'refunded',
  'invoice.void': 'void',
  'invoice.transferred': 'transferred',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Showpass sends hex(HMAC-SHA1(secret, payload.id)) in X-SHOWPASS-SIGNATURE.
export function computeSignature(secret: string, id: string): string {
  return createHmac('sha1', secret).update(id).digest('hex')
}

export function verifySignature(secret: string, id: string, signature: string | null): boolean {
  if (!secret || !id || !signature) return false
  const expected = Buffer.from(computeSignature(secret, id))
  const received = Buffer.from(signature.trim().toLowerCase())
  return expected.length === received.length && timingSafeEqual(expected, received)
}

export function normalizeEmail(email: string | null | undefined): string | null {
  const normalized = email?.toLowerCase().trim()
  return normalized && EMAIL_REGEX.test(normalized) ? normalized : null
}

export function interpretEvent(payload: ShowpassWebhook, orgId?: string): MembershipAction {
  if (payload.event_type === 'webhook.test') return { kind: 'ignore', reason: 'test event' }

  const status = payload.event_type ? STATUS_BY_EVENT[payload.event_type] : undefined
  if (!status) return { kind: 'ignore', reason: `unhandled event_type ${payload.event_type}` }

  const data = payload.data
  if (!data) return { kind: 'ignore', reason: 'no data' }

  if (
    orgId &&
    data.showpass_organization_id !== undefined &&
    String(data.showpass_organization_id) !== orgId
  ) {
    return { kind: 'ignore', reason: 'different organization' }
  }

  // The same Showpass account sells event tickets, so only memberships count.
  const membershipItems = (data.invoice_items ?? []).filter(
    (item) => item.invoice_item_type === 'membership'
  )
  const membershipTickets = (data.ticket_items ?? []).filter(
    (item) => item.ticket_item_type === 'membership'
  )
  if (membershipItems.length === 0 && membershipTickets.length === 0) {
    return { kind: 'ignore', reason: 'no membership items in invoice' }
  }

  // The buyer, plus anyone named on a membership they bought for someone else.
  const emails = new Set<string>()
  const buyerEmail = normalizeEmail(data.customer_email)
  if (buyerEmail) emails.add(buyerEmail)
  for (const ticket of membershipTickets) {
    const ticketEmail = normalizeEmail(ticket.email_on_ticket)
    if (ticketEmail) emails.add(ticketEmail)
  }
  if (emails.size === 0) return { kind: 'ignore', reason: 'membership invoice has no email' }

  const transactionId = data.transaction_id || String(payload.id)

  return {
    kind: status === 'active' ? 'grant' : 'revoke',
    status,
    transactionId,
    emails: Array.from(emails),
    customerName: data.customer_name ?? null,
    membershipName:
      membershipItems[0]?.ticket_type_name ?? membershipTickets[0]?.ticket_type_name ?? null,
    eventType: payload.event_type!,
  }
}
