import { NextResponse } from 'next/server'
import { createUserClient, createServiceClient, isAdmin, siteUrl } from '@/lib/supabase-server'
import { invitationCode } from '@/lib/codes'
import { emails, sendEmail } from '@/lib/email'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const { action } = await request.json().catch(() => ({ action: '' }))
  const admin = createServiceClient()

  const { data: a } = await admin.from('admissions').select('*').eq('id', id).single()
  if (!a) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (a.status !== 'pending') return NextResponse.json({ error: 'already_reviewed' }, { status: 409 })

  const { data: ed } = await admin.from('editions').select('*').eq('slug', a.edition_slug).single()
  if (!ed) return NextResponse.json({ error: 'edition' }, { status: 400 })

  if (action === 'decline') {
    await admin.from('admissions').update({ status: 'declined', reviewed_at: new Date().toISOString() }).eq('id', id)
    await sendEmail(a.email, `Your request for ${ed.name}`, emails.declined(ed.name, a.first_name || ''))
    return NextResponse.json({ ok: true, status: 'declined' })
  }

  if (action !== 'accept') return NextResponse.json({ error: 'action' }, { status: 400 })

  const paid = !ed.price_cents
  let code = ''
  for (let i = 0; i < 5 && !code; i++) {
    const c = invitationCode(ed.slug, ed.edition_date)
    const { error } = await admin.from('invitations').insert({
      code: c, experience_name: ed.name, experience_date: ed.edition_date, user_id: a.user_id, claimed_at: new Date().toISOString(),
    })
    if (!error) code = c
  }
  if (!code) return NextResponse.json({ error: 'code' }, { status: 500 })

  await admin.from('reservations').insert({
    user_id: a.user_id, experience_name: ed.name, experience_date: ed.edition_date,
    guests: a.places, status: paid ? 'confirmed' : 'pending', admission_id: a.id,
  })

  await admin.from('admissions').update({
    status: paid ? 'paid' : 'accepted', invitation_code: code, reviewed_at: new Date().toISOString(),
    paid_at: paid ? new Date().toISOString() : null,
  }).eq('id', id)

  await sendEmail(a.email, "YOU'RE IN", emails.accepted(ed.name, a.first_name || '', code, paid ? null : `${siteUrl()}/api/pay/${a.id}`))

  return NextResponse.json({ ok: true, status: paid ? 'paid' : 'accepted', code })
}
