import { NextResponse } from 'next/server'
import { createUserClient, createServiceClient } from '@/lib/supabase-server'
import { emails, sendEmail } from '@/lib/email'

const clean = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(request: Request) {
  const supabase = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) return NextResponse.json({ error: 'auth' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const edition_slug = clean(body.edition, 80)
  const first_name = clean(body.first_name, 60)
  const last_name = clean(body.last_name, 60)
  const phone = clean(body.phone, 40)
  const city = clean(body.city, 80)
  const country = clean(body.country, 80)
  const instagram = clean(body.instagram, 60).replace(/^@+/, '')
  const places = Number(body.places) === 2 ? 2 : 1
  const companion_name = places === 2 ? clean(body.companion_name, 120) : ''
  const activity = clean(body.activity, 120)
  let website = clean(body.website, 200)
  if (website && !/^https?:\/\//i.test(website)) website = `https://${website}`
  const birth_year = Number(body.birth_year)
  const partner_consent = !!body.partner_consent
  const thisYear = new Date().getFullYear()

  if (!edition_slug || !first_name || !last_name || !phone || !city || !country || !activity || !body.consent) {
    return NextResponse.json({ error: 'missing' }, { status: 400 })
  }

  if (!Number.isInteger(birth_year) || birth_year < thisYear - 110 || thisYear - birth_year < 21) {
    return NextResponse.json({ error: 'age' }, { status: 400 })
  }

  const admin = createServiceClient()
  const { data: edition } = await admin.from('editions').select('slug, name, is_open').eq('slug', edition_slug).single()
  if (!edition || !edition.is_open) return NextResponse.json({ error: 'edition' }, { status: 400 })

  const { data: existing } = await admin.from('admissions').select('id')
    .eq('user_id', user.id).eq('edition_slug', edition_slug).in('status', ['pending', 'accepted', 'paid']).limit(1)
  if (existing && existing.length) return NextResponse.json({ error: 'duplicate' }, { status: 409 })

  const { error } = await admin.from('admissions').insert({
    user_id: user.id, edition_slug, email: user.email, first_name, last_name, phone, city, country,
    instagram: instagram || null, places, companion_name: companion_name || null,
    activity, website: website || null, birth_year, partner_consent,
  })
  if (error) return NextResponse.json({ error: 'save' }, { status: 500 })

  await admin.from('profiles').update({ first_name, last_name, phone }).eq('id', user.id)

  await sendEmail(user.email, 'Your request has been received', emails.received(edition.name, first_name))
  const adminList = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)
  if (adminList.length) {
    await sendEmail(adminList, `New admission request: ${first_name} ${last_name}, ${edition.name}`, emails.adminNew({
      Edition: edition.name, Name: `${first_name} ${last_name}`, Email: user.email, Phone: phone,
      City: `${city}, ${country}`, Activity: activity, Instagram: instagram ? `@${instagram}` : null, Website: website || null,
      Places: places, Companion: companion_name || null,
      'Partner content': partner_consent ? 'Accepted' : 'Declined', 'Birth year': birth_year,
    }))
  }

  return NextResponse.json({ ok: true, edition: edition.name })
}
