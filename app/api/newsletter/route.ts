import { NextResponse } from 'next/server'
import { emails, sendEmail } from '@/lib/email'

const clean = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const email = clean(body.email, 200).toLowerCase()
  const first_name = clean(body.first, 60)
  const last_name = clean(body.last, 60)

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ error: 'email' }, { status: 400 })

  const key = process.env.RESEND_API_KEY
  if (!key) return NextResponse.json({ error: 'config' }, { status: 500 })

  const audience = process.env.RESEND_AUDIENCE_ID
  const url = audience ? `https://api.resend.com/audiences/${audience}/contacts` : 'https://api.resend.com/contacts'
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, first_name: first_name || undefined, last_name: last_name || undefined, unsubscribed: false }),
  })
  if (!res.ok && res.status !== 409 && res.status !== 422) return NextResponse.json({ error: 'save' }, { status: 502 })

  await sendEmail(email, 'Welcome to Maison Sanguine', emails.newsletter(first_name))
  return NextResponse.json({ ok: true })
}
