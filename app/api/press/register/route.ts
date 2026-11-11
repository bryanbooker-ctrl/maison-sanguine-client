import { NextResponse } from 'next/server'
import { emails, sendEmail } from '@/lib/email'

const clean = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const REQUIRED = ['lastname', 'firstname', 'street', 'city', 'zip', 'country', 'phone', 'email', 'market'] as const

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  if (clean(body.website)) return NextResponse.json({ ok: true })

  const d = {
    title: clean(body.title, 10),
    lastname: clean(body.lastname, 80),
    firstname: clean(body.firstname, 80),
    street: clean(body.street, 200),
    city: clean(body.city, 100),
    region: clean(body.region, 100),
    zip: clean(body.zip, 20),
    country: clean(body.country, 80),
    phone: clean(body.phone, 40),
    media: clean(body.media, 120),
    function: clean(body.function, 120),
    email: clean(body.email, 200).toLowerCase(),
    market: clean(body.market, 60),
  }

  if (REQUIRED.some(k => !d[k]) || body.consent !== true) return NextResponse.json({ error: 'fields' }, { status: 400 })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return NextResponse.json({ error: 'email' }, { status: 400 })

  const inbox = process.env.PRESS_INBOX || 'press@maisonsanguine.com'
  const rows = {
    Name: `${d.title} ${d.firstname} ${d.lastname}`.trim(),
    Email: d.email,
    Phone: d.phone,
    Media: d.media,
    Function: d.function,
    Market: d.market,
    Address: [d.street, `${d.zip} ${d.city}`.trim(), d.region, d.country].filter(Boolean).join(', '),
  }

  const sent = await sendEmail(inbox, `Pressroom request: ${rows.Name}${d.media ? ` (${d.media})` : ''}`, emails.pressNew(rows))
  if ('ok' in sent && !sent.ok) return NextResponse.json({ error: 'send' }, { status: 502 })
  await sendEmail(d.email, 'Your Maison Sanguine pressroom request', emails.pressReceived(d.firstname))

  return NextResponse.json({ ok: true })
}
