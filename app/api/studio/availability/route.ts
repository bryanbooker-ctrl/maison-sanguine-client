import { NextResponse } from 'next/server'
import { TOUR, availability, addDays } from '@/lib/studio-tours'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const month = new URL(request.url).searchParams.get('month') || ''
  if (!/^\d{4}-\d{2}$/.test(month)) return NextResponse.json({ error: 'month' }, { status: 400 })
  const from = `${month}-01`
  const next = new Date(from + 'T12:00:00Z')
  next.setUTCMonth(next.getUTCMonth() + 1)
  const to = addDays(next.toISOString().slice(0, 10), -1)
  try {
    const days = await availability(from, to)
    return NextResponse.json({ days, slots: TOUR.slots, capacity: TOUR.capacity, price: TOUR.priceCents / 100 }, { headers: { 'cache-control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'load' }, { status: 500 })
  }
}
