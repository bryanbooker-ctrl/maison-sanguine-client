import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { LANG_NAMES } from '@/lib/studio-tours'

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'id' }, { status: 400 })
  const { data: t } = await createServiceClient().from('studio_tours')
    .select('tour_date,slot,language,places,status,first_name').eq('id', id).maybeSingle()
  if (!t) return NextResponse.json({ error: 'id' }, { status: 404 })
  return NextResponse.json({
    date: t.tour_date, slot: t.slot, language: LANG_NAMES[t.language] || t.language,
    places: t.places, status: t.status, first_name: t.first_name,
  }, { headers: { 'cache-control': 'no-store' } })
}
