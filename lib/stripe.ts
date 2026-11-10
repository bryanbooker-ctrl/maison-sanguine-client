import { createHmac, timingSafeEqual } from 'crypto'

export async function createCheckout(p: {
  name: string; amount: number; currency: string; quantity: number; email: string;
  admissionId: string; successUrl: string; cancelUrl: string
}) {
  const body = new URLSearchParams({
    mode: 'payment',
    customer_email: p.email,
    success_url: p.successUrl,
    cancel_url: p.cancelUrl,
    'line_items[0][quantity]': String(p.quantity),
    'line_items[0][price_data][currency]': p.currency,
    'line_items[0][price_data][unit_amount]': String(p.amount),
    'line_items[0][price_data][product_data][name]': p.name,
    'metadata[admission_id]': p.admissionId,
    'payment_intent_data[metadata][admission_id]': p.admissionId,
    'adaptive_pricing[enabled]': 'false',
  })
  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || 'Stripe error')
  return data as { id: string; url: string }
}

export function verifyStripeSignature(payload: string, header: string | null, secret: string) {
  if (!header) return false
  const parts = Object.fromEntries(header.split(',').map(kv => kv.split('=') as [string, string]))
  const t = parts.t
  const sigs = header.split(',').filter(x => x.startsWith('v1=')).map(x => x.slice(3))
  if (!t || !sigs.length) return false
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false
  const expected = createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex')
  return sigs.some(s => s.length === expected.length && timingSafeEqual(Buffer.from(s), Buffer.from(expected)))
}

async function stripeApi(path: string, method: 'GET' | 'POST', body?: URLSearchParams, key = process.env.STRIPE_SECRET_KEY) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || 'Stripe error')
  return data
}

export type IdentitySession = {
  id: string; url: string | null; livemode?: boolean; status: 'requires_input' | 'processing' | 'verified' | 'canceled'
  metadata?: Record<string, string>
  last_error?: { code?: string; reason?: string } | null
  verified_outputs?: { first_name?: string; last_name?: string; dob?: { day: number; month: number; year: number } } | null
}

export async function createIdentitySession(p: { email: string; admissionId: string; userId: string; returnUrl: string }) {
  return stripeApi('identity/verification_sessions', 'POST', new URLSearchParams({
    type: 'document',
    'options[document][require_matching_selfie]': 'true',
    'options[document][require_live_capture]': 'true',
    'provided_details[email]': p.email,
    'metadata[admission_id]': p.admissionId,
    'metadata[user_id]': p.userId,
    return_url: p.returnUrl,
  })) as Promise<IdentitySession>
}

export async function getIdentitySession(id: string) {
  return stripeApi(
    `identity/verification_sessions/${id}?expand[]=verified_outputs&expand[]=verified_outputs.dob`,
    'GET', undefined, process.env.STRIPE_IDENTITY_KEY || process.env.STRIPE_SECRET_KEY,
  ) as Promise<IdentitySession>
}

export async function getCheckoutSession(id: string) {
  return stripeApi(`checkout/sessions/${id}`, 'GET') as Promise<{ id: string; payment_status: string; metadata?: Record<string, string> }>
}
