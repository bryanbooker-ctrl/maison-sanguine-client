import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { LANG_NAMES } from '@/lib/studio-tours'

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'id' }, { status: 400 })
  const admin = createServiceClient()
  const { data: b } = await admin.from('masterclass_bookings').select('session_id,places,status,first_name').eq('id', id).maybeSingle()
  if (!b) return NextResponse.json({ error: 'id' }, { status: 404 })
  const { data: s } = await admin.from('masterclass_sessions').select('edition_slug,session_date,session_time,language').eq('id', b.session_id).maybeSingle()
  const { data: ed } = await admin.from('editions').select('name').eq('slug', s?.edition_slug).maybeSingle()
  return NextResponse.json({
    name: ed?.name || '', date: s?.session_date, time: s?.session_time, language: LANG_NAMES[s?.language] || s?.language,
    places: b.places, status: b.status, first_name: b.first_name,
  }, { headers: { 'cache-control': 'no-store' } })
}
