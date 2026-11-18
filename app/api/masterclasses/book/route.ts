import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceClient, siteUrl } from '@/lib/supabase-server'
import { createCheckout } from '@/lib/stripe'
import { MC, getEdition, sessionsFor, unitPrice } from '@/lib/masterclass-sessions'
import { dateLabel } from '@/lib/studio-tours'

const clean = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const slug = clean(body.edition, 80)
  const sessionId = clean(body.session, 40)
  const places = Number(body.places)
  const first_name = clean(body.first_name, 60)
  const last_name = clean(body.last_name, 60)
  const email = clean(body.email, 160).toLowerCase()
  const phone = clean(body.phone, 40)
  const companion_name = places === 2 ? clean(body.companion_name, 120) : ''

  if (!slug || !/^[0-9a-f-]{36}$/i.test(sessionId) || !Number.isInteger(places) || places < 1 || places > MC.maxPlaces
    || !first_name || !last_name || !phone || (places === 2 && !companion_name) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'missing' }, { status: 400 })
  }
  if (!body.adult) return NextResponse.json({ error: 'adult' }, { status: 400 })
  if (!body.consent) return NextResponse.json({ error: 'consent' }, { status: 400 })

  const ed = await getEdition(slug)
  if (!ed) return NextResponse.json({ error: 'edition' }, { status: 400 })
  const jar = await cookies()
  const price = unitPrice(ed, jar.get('ms_loc')?.value, jar.get('ms_region')?.value)
  if (!price) return NextResponse.json({ error: 'price' }, { status: 400 })

  const s = (await sessionsFor(slug)).find(x => x.id === sessionId)
  if (!s || s.left < places) return NextResponse.json({ error: 'full' }, { status: 409 })

  const admin = createServiceClient()
  const { data: row, error } = await admin.from('masterclass_bookings').insert({
    session_id: sessionId, places, first_name, last_name, email, phone, companion_name: companion_name || null,
    amount_cents: price.amount * places, currency: price.currency,
  }).select('id').single()
  if (error || !row) return NextResponse.json({ error: 'save' }, { status: 500 })

  const base = siteUrl()
  try {
    const checkout = await createCheckout({
      name: `${ed.name}, ${dateLabel(s.date)}, ${s.time}`,
      amount: price.amount, currency: price.currency, quantity: places, email,
      admissionId: `mc_${row.id}`,
      successUrl: `${base}/api/masterclasses/done/${row.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${base}/api/masterclasses/cancel/${row.id}`,
      expiresAt: Math.floor(Date.now() / 1000) + 31 * 60,
    })
    await admin.from('masterclass_bookings').update({ stripe_session: checkout.id }).eq('id', row.id)
    return NextResponse.json({ url: checkout.url })
  } catch (e) {
    console.error('MS masterclass booking error:', e instanceof Error ? e.message : e)
    await admin.from('masterclass_bookings').update({ status: 'cancelled' }).eq('id', row.id)
    return NextResponse.json({ error: 'save' }, { status: 500 })
  }
}
