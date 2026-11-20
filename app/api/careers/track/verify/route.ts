import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { TRACK_COOKIE, cookieOptions, hashCode, isUuid, normEmail, sameHash, signSession, validEmail } from '@/lib/careers-track'

export const runtime = 'nodejs'

const hits = new Map<string, number[]>()

export async function POST(request: Request) {
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'x'
  const now = Date.now()
  const recentHits = (hits.get(ip) || []).filter(t => now - t < 600000)
  if (recentHits.length >= 20) return NextResponse.json({ error: 'rate' }, { status: 429 })
  hits.set(ip, [...recentHits, now])

  const body = await request.json().catch(() => ({}))
  const code = typeof body.code === 'string' ? body.code.replace(/\s+/g, '') : ''
  if (!/^\d{6}$/.test(code)) return NextResponse.json({ error: 'code' }, { status: 400 })

  const db = createServiceClient()
  let email = normEmail(body.email)
  if (isUuid(body.ref)) {
    const { data } = await db.from('job_applications').select('email').eq('id', body.ref).maybeSingle()
    email = normEmail(data?.email)
  }
  if (!validEmail(email)) return NextResponse.json({ error: 'code' }, { status: 400 })

  const { data: row } = await db.from('job_application_codes').select('id, code_hash, expires_at, attempts').eq('email', email).order('created_at', { ascending: false }).limit(1).maybeSingle()
  if (!row || new Date(row.expires_at).getTime() < now || row.attempts >= 5) return NextResponse.json({ error: 'expired' }, { status: 400 })
  if (!sameHash(row.code_hash, hashCode(email, code))) {
    await db.from('job_application_codes').update({ attempts: row.attempts + 1 }).eq('id', row.id)
    return NextResponse.json({ error: 'code' }, { status: 400 })
  }
  await db.from('job_application_codes').delete().eq('email', email)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(TRACK_COOKIE, signSession(email), cookieOptions())
  return res
}
