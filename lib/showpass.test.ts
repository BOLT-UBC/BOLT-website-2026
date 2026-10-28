// No test runner is set up in this repo yet. Run with Node's built-in runner
// through a TypeScript loader, e.g. `npx tsx --test lib/showpass.test.ts`.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac } from 'crypto'
import { computeSignature, interpretEvent, verifySignature, type ShowpassWebhook } from './showpass'

const SECRET = 'test_secret_123'

// Shape copied from the Showpass docs example, switched from a ticket to a membership.
function samplePayload(overrides: Partial<ShowpassWebhook> = {}, itemType = 'membership'): ShowpassWebhook {
  return {
    id: 'f1-1068-4af6-be8f-1222417da0f2',
    event_type: 'invoice.purchase',
    webhook_event_uuid: '09117c09-e1f8-4913-b2f5-52cc161cf5f7',
    data: {
      transaction_id: 'f1-1068-4af6-be8f-1222417da0f2',
      showpass_organization_id: '5796',
      customer_name: 'Jane Doe',
      customer_email: '  Jane.Doe@Student.UBC.ca ',
      ticket_items: [{ ticket_item_type: itemType, ticket_type_name: 'BOLT UBC General Membership', email_on_ticket: null }],
      invoice_items: [{ invoice_item_type: itemType, ticket_type_name: 'BOLT UBC General Membership' }],
    },
    ...overrides,
  }
}

test('signature matches the Node example in the Showpass docs (HMAC-SHA1 of the id, hex)', () => {
  const id = 'f1-1068-4af6-be8f-1222417da0f2'
  const nodeSig = createHmac('sha1', SECRET).update(id).digest('hex')
  assert.equal(computeSignature(SECRET, id), nodeSig)
  assert.ok(verifySignature(SECRET, id, nodeSig))
  assert.ok(verifySignature(SECRET, id, nodeSig.toUpperCase()))
  assert.ok(!verifySignature(SECRET, id, nodeSig.slice(0, -1) + '0'))
  assert.ok(!verifySignature('wrong', id, nodeSig))
  assert.ok(!verifySignature(SECRET, id, null))
})

test('buying a membership -> grant, with the email normalized', () => {
  assert.deepEqual(interpretEvent(samplePayload()), {
    kind: 'grant',
    status: 'active',
    transactionId: 'f1-1068-4af6-be8f-1222417da0f2',
    emails: ['jane.doe@student.ubc.ca'],
    customerName: 'Jane Doe',
    membershipName: 'BOLT UBC General Membership',
    eventType: 'invoice.purchase',
  })
})

test('a membership bought for someone else grants both emails', () => {
  const payload = samplePayload()
  payload.data!.ticket_items![0].email_on_ticket = 'Friend@Example.com'
  const action = interpretEvent(payload)
  assert.equal(action.kind, 'grant')
  assert.deepEqual(action.kind === 'grant' && action.emails, ['jane.doe@student.ubc.ca', 'friend@example.com'])
})

test('buying just an event ticket (no membership) -> ignored', () => {
  assert.equal(interpretEvent(samplePayload({}, 'ticket')).kind, 'ignore')
})

test('refund / void / transferred -> revoke, transfer -> grant', () => {
  const expected = { 'invoice.refund': 'refunded', 'invoice.void': 'void', 'invoice.transferred': 'transferred' }
  for (const [eventType, status] of Object.entries(expected)) {
    const action = interpretEvent(samplePayload({ event_type: eventType }))
    assert.equal(action.kind, 'revoke', eventType)
    assert.equal(action.kind === 'revoke' && action.status, status, eventType)
  }
  assert.equal(interpretEvent(samplePayload({ event_type: 'invoice.transfer' })).kind, 'grant')
})

test('test pings, unknown events and missing emails are ignored', () => {
  assert.equal(interpretEvent(samplePayload({ event_type: 'webhook.test' })).kind, 'ignore')
  assert.equal(interpretEvent(samplePayload({ event_type: 'invoice.something_new' })).kind, 'ignore')
  const payload = samplePayload()
  payload.data!.customer_email = null
  assert.equal(interpretEvent(payload).kind, 'ignore')
})

test('the dashboard "Send test" ping (endpoint settings, no event_type) is ignored', () => {
  const ping = { id: 1230, url: 'https://www.boltubc.com/api/webhooks/showpass', is_enabled: true } as unknown as ShowpassWebhook
  assert.equal(interpretEvent(ping).kind, 'ignore')
})

test('payloads from another organization are ignored when SHOWPASS_ORG_ID is set', () => {
  assert.equal(interpretEvent(samplePayload(), '5796').kind, 'grant')
  assert.equal(interpretEvent(samplePayload(), '1234').kind, 'ignore')
  assert.equal(interpretEvent(samplePayload()).kind, 'grant')
})
