import { NextResponse } from 'next/server'
import { verifyStripeSignature } from '@/lib/stripe'
import { markPaid } from '@/lib/payments'
import { markTourPaid } from '@/lib/studio-tours'
import { markMasterclassPaid } from '@/lib/masterclass-sessions'
import { applyIdentity } from '@/lib/identity'

export async function POST(request: Request) {
  const payload = await request.text()
  const secret = process.env.STRIPE_WEBHOOK_SECRET || ''
  if (!secret || !verifyStripeSignature(payload, request.headers.get('stripe-signature'), secret)) {
    return NextResponse.json({ error: 'signature' }, { status: 400 })
  }

  const event = JSON.parse(payload)
  if (event.type?.startsWith('identity.verification_session.')) {
    const sid = event.data?.object?.id
    if (sid) { try { await applyIdentity(sid) } catch {} }
    return NextResponse.json({ received: true })
  }
  if (event.type !== 'checkout.session.completed') return NextResponse.json({ received: true })

  const session = event.data?.object
  const id = session?.metadata?.admission_id
  if (!id || session.payment_status !== 'paid') return NextResponse.json({ received: true })

  if (id.startsWith('tour_')) await markTourPaid(id.slice(5))
  else if (id.startsWith('mc_')) await markMasterclassPaid(id.slice(3))
  else await markPaid(id)

  return NextResponse.json({ received: true })
}
