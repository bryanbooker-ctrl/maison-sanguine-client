import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase-server'
import { TRACK_COOKIE, isUuid, readSession } from '@/lib/careers-track'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const email = readSession((await cookies()).get(TRACK_COOKIE)?.value)
  if (!email) return NextResponse.json({ error: 'auth' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  if (!isUuid(body.id) || !['download', 'withdraw', 'delete'].includes(body.action)) return NextResponse.json({ error: 'fields' }, { status: 400 })

  const db = createServiceClient()
  const { data: row } = await db.from('job_applications').select('*').eq('id', body.id).eq('email', email).maybeSingle()
  if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  if (body.action === 'download') {
    const { photo, ...rest } = row
    return NextResponse.json({ ok: true, data: { ...rest, photo: photo ? 'included' : null } })
  }
  if (body.action === 'withdraw') {
    await db.from('job_applications').update({ status: 'withdrawn', updated_at: new Date().toISOString() }).eq('id', row.id)
    return NextResponse.json({ ok: true, status: 'withdrawn' })
  }
  await db.from('job_applications').delete().eq('id', row.id)
  return NextResponse.json({ ok: true })
}
