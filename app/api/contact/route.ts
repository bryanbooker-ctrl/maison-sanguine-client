import { NextResponse } from 'next/server'
import { emails, sendEmail } from '@/lib/email'

const clean = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const hits = new Map<string, number[]>()

export async function POST(request: Request) {
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'x'
  const now = Date.now()
  const list = (hits.get(ip) || []).filter(t => now - t < 600000)
  if (list.length >= 5) return NextResponse.json({ error: 'rate' }, { status: 429 })
  hits.set(ip, [...list, now])

  const b = await request.json().catch(() => ({}))
  if (clean(b.website)) return NextResponse.json({ ok: true })
  const d = {
    salutation: clean(b.salutation, 40),
    first: clean(b.first, 60),
    last: clean(b.last, 60),
    country: clean(b.country, 80),
    email: clean(b.email, 200).toLowerCase(),
    dial: clean(b.dial, 8),
    phone: clean(b.phone, 30),
    mode: clean(b.mode, 30),
    reason: clean(b.reason, 80),
    message: clean(b.message, 4000),
    local: clean(b.local, 80),
    lang: clean(b.lang, 12),
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) || !d.first || !d.last || !d.reason || !d.message || b.consent !== true)
    return NextResponse.json({ error: 'fields' }, { status: 400 })

  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: 'config' }, { status: 500 })
  const to = (process.env.CONTACT_EMAILS || process.env.ADMIN_EMAILS || 'guestrelations@maisonsanguine.com').split(',').map(e => e.trim()).filter(Boolean)

  const sent = await sendEmail(to, `Contact: ${d.reason}, ${d.first} ${d.last}`, emails.contactNew({
    Salutation: d.salutation, 'First name': d.first, 'Last name': d.last, Residence: d.country, Email: d.email,
    Phone: d.phone ? `${d.dial} ${d.phone}`.trim() : '', 'Preferred contact': d.mode, Reason: d.reason,
    'Local contact': d.local, Language: d.lang, Message: d.message,
  }), d.email)
  if (!('ok' in sent) || !sent.ok) return NextResponse.json({ error: 'send' }, { status: 502 })

  await sendEmail(d.email, 'Your message has been received', emails.contactReceived(d.first))
  return NextResponse.json({ ok: true })
}
