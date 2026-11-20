import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { emails, sendEmail } from '@/lib/email'
import { CODE_TTL_MS, hashCode, isUuid, maskEmail, newCode, normEmail, validEmail } from '@/lib/careers-track'

export const runtime = 'nodejs'

const hits = new Map<string, number[]>()

export async function POST(request: Request) {
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'x'
  const now = Date.now()
  const recentHits = (hits.get(ip) || []).filter(t => now - t < 600000)
  if (recentHits.length >= 8) return NextResponse.json({ error: 'rate' }, { status: 429 })
  hits.set(ip, [...recentHits, now])

  const body = await request.json().catch(() => ({}))
  const db = createServiceClient()
  let email = normEmail(body.email)
  if (isUuid(body.ref)) {
    const { data } = await db.from('job_applications').select('email').eq('id', body.ref).maybeSingle()
    email = normEmail(data?.email)
  }
  if (!validEmail(email)) return NextResponse.json({ error: 'email' }, { status: 400 })
  const masked = maskEmail(email)

  const { data: apps } = await db.from('job_applications').select('locale').eq('email', email).order('created_at', { ascending: false }).limit(1)
  if (!apps || !apps.length) return NextResponse.json({ ok: true, masked })

  const { data: recent } = await db.from('job_application_codes').select('created_at').eq('email', email).gte('created_at', new Date(now - 3600000).toISOString()).order('created_at', { ascending: false })
  if (recent && (recent.length >= 5 || (recent[0] && now - new Date(recent[0].created_at).getTime() < 30000))) return NextResponse.json({ ok: true, masked })

  const code = newCode()
  await db.from('job_application_codes').delete().lt('created_at', new Date(now - 86400000).toISOString())
  const { error } = await db.from('job_application_codes').insert({ email, code_hash: hashCode(email, code), expires_at: new Date(now + CODE_TTL_MS).toISOString() })
  if (error) return NextResponse.json({ error: 'server' }, { status: 500 })

  const lang = apps[0].locale === 'fr' ? 'fr' : 'en'
  const sent = await sendEmail(email, lang === 'fr' ? `Votre code Maison Sanguine : ${code}` : `Your Maison Sanguine code: ${code}`, emails.trackCode(code, lang))
  if (!('ok' in sent) || !sent.ok) return NextResponse.json({ error: 'send' }, { status: 502 })
  return NextResponse.json({ ok: true, masked })
}
