import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { MC, getEdition, money, sessionsFor, unitPrice } from '@/lib/masterclass-sessions'
import { LANG_NAMES } from '@/lib/studio-tours'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const slug = (new URL(request.url).searchParams.get('edition') || '').slice(0, 80)
  if (!slug) return NextResponse.json({ error: 'edition' }, { status: 400 })
  try {
    const ed = await getEdition(slug)
    if (!ed) return NextResponse.json({ error: 'edition' }, { status: 404 })
    const jar = await cookies()
    const price = unitPrice(ed, jar.get('ms_loc')?.value, jar.get('ms_region')?.value)
    const sessions = (await sessionsFor(slug)).map(s => ({ ...s, languageName: LANG_NAMES[s.language] || s.language }))
    return NextResponse.json({
      name: ed.name, sessions, maxPlaces: MC.maxPlaces,
      price: price ? { amount: price.amount, currency: price.currency, label: money(price.amount, price.currency) } : null,
    }, { headers: { 'cache-control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'load' }, { status: 500 })
  }
}
