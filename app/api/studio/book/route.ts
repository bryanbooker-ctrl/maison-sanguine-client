import { NextResponse } from 'next/server'
import { createServiceClient, siteUrl } from '@/lib/supabase-server'
import { createCheckout } from '@/lib/stripe'
import { TOUR, availability, dateLabel, isDate } from '@/lib/studio-tours'

const clean = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const date = body.date
  const slot = clean(body.slot, 5)
  const language = clean(body.language, 2)
  const places = Number(body.places)
  const first_name = clean(body.first_name, 60)
  const last_name = clean(body.last_name, 60)
  const email = clean(body.email, 160).toLowerCase()
  const phone = clean(body.phone, 40)

  if (!isDate(date) || !TOUR.slots.includes(slot) || !TOUR.languages.includes(language) || !Number.isInteger(places) || places < 1 || places > TOUR.capacity
    || !first_name || !last_name || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'missing' }, { status: 400 })
  }
  if (!body.consent) return NextResponse.json({ error: 'consent' }, { status: 400 })

  const days = await availability(date, date)
  const s = days[date]?.[slot]
  if (!s || s.left < places || (s.lang && s.lang !== language)) return NextResponse.json({ error: 'full' }, { status: 409 })

  const admin = createServiceClient()
  const { data: row, error } = await admin.from('studio_tours').insert({
    tour_date: date, slot, language, places, first_name, last_name, email, phone,
    amount_cents: TOUR.priceCents * places,
  }).select('id').single()
  if (error || !row) return NextResponse.json({ error: 'save' }, { status: 500 })

  const base = siteUrl()
  try {
    const checkout = await createCheckout({
      name: `Guided Tour, Maison Sanguine Studio, ${dateLabel(date)}, ${slot}`,
      amount: TOUR.priceCents, currency: TOUR.currency, quantity: places, email,
      admissionId: `tour_${row.id}`,
      successUrl: `${base}/api/studio/done/${row.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${base}/api/studio/cancel/${row.id}`,
      expiresAt: Math.floor(Date.now() / 1000) + 31 * 60,
    })
    await admin.from('studio_tours').update({ stripe_session: checkout.id }).eq('id', row.id)
    return NextResponse.json({ url: checkout.url })
  } catch (e) {
    console.error('MS studio tour error:', e instanceof Error ? e.message : e)
    await admin.from('studio_tours').update({ status: 'cancelled' }).eq('id', row.id)
    return NextResponse.json({ error: 'save' }, { status: 500 })
  }
}
