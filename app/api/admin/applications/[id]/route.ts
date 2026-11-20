import { NextResponse } from 'next/server'
import { createUserClient, createServiceClient, isAdmin } from '@/lib/supabase-server'
import { emails, sendEmail } from '@/lib/email'
import { STATUSES, careersUrl, langOf } from '@/lib/careers-track'

export const runtime = 'nodejs'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const body = await request.json().catch(() => ({}))
  const status = String(body.status || '')
  if (!(STATUSES as readonly string[]).includes(status)) return NextResponse.json({ error: 'status' }, { status: 400 })

  const db = createServiceClient()
  const { data: a } = await db.from('job_applications').select('id, email, first_name, job_title, locale, status').eq('id', id).maybeSingle()
  if (!a) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  await db.from('job_applications').update({ status, updated_at: new Date().toISOString() }).eq('id', id)

  let notified = false
  if (body.notify && status !== a.status && ['review', 'interview', 'offer', 'declined'].includes(status)) {
    const lang = langOf(a.locale)
    const subject = lang === 'fr' ? 'Mise à jour de votre candidature' : 'An update on your application'
    const sent = await sendEmail(a.email, subject, emails.applicationStatus(a.first_name || '', a.job_title, status, `${careersUrl()}/applications?ref=${a.id}`, lang))
    notified = 'ok' in sent && !!sent.ok
  }
  return NextResponse.json({ ok: true, status, notified })
}
