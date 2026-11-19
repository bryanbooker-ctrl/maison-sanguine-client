import { createServiceClient } from '@/lib/supabase-server'
import { emails, sendEmail } from '@/lib/email'
import { addDays, dateLabel, parisToday, LANG_NAMES } from '@/lib/studio-tours'
import { currencyOf, isContext } from '@/lib/locations'
import { fixedPrice, minorUnits } from '@/lib/prices'

export const MC = { holdMinutes: 33, maxPlaces: 2 }

export function bookPath(slug: string) {
  return slug.startsWith('mc-the-making-of-a-night') ? '/studio/masterclasses/book' : '/masterclasses/book'
}

export type McSession = { id: string; date: string; time: string; language: string; left: number }

type Edition = { slug: string; name: string; kind: string | null; is_open: boolean; price_cents: number | null; currency: string | null; prices?: Record<string, number> | null }

export async function getEdition(slug: string) {
  const { data } = await createServiceClient().from('editions').select('*').eq('slug', slug).eq('kind', 'masterclass').maybeSingle()
  return (data as Edition | null) && (data as Edition).is_open ? (data as Edition) : null
}

export function unitPrice(ed: Edition, ctx: string | undefined, region: string | undefined) {
  if (!ed.price_cents) return null
  const wanted = (isContext(ctx) ? currencyOf(ctx, region) : null)?.toLowerCase()
  const fixed = wanted ? fixedPrice(ed.price_cents / 100, wanted) : null
  const local = wanted && ed.prices && Number(ed.prices[wanted]) > 0 ? Number(ed.prices[wanted]) : fixed && wanted ? minorUnits(fixed, wanted) : null
  return { amount: local ?? ed.price_cents, currency: local ? wanted! : (ed.currency || 'eur').toLowerCase() }
}

export async function sessionsFor(slug: string): Promise<McSession[]> {
  const admin = createServiceClient()
  const today = parisToday()
  const { data: rows } = await admin.from('masterclass_sessions').select('id,session_date,session_time,language,capacity')
    .eq('edition_slug', slug).eq('is_open', true).gt('session_date', today).lte('session_date', addDays(today, 366))
    .order('session_date').order('session_time')
  const list = rows || []
  if (!list.length) return []
  const since = new Date(Date.now() - MC.holdMinutes * 60000).toISOString()
  const { data: bk } = await admin.from('masterclass_bookings').select('session_id,places,status,created_at')
    .in('session_id', list.map(s => s.id)).in('status', ['pending', 'paid'])
  const taken: Record<string, number> = {}
  for (const b of bk || []) {
    if (b.status === 'pending' && b.created_at < since) continue
    taken[b.session_id] = (taken[b.session_id] || 0) + b.places
  }
  return list.map(s => ({
    id: s.id, date: String(s.session_date), time: s.session_time, language: s.language,
    left: Math.max(0, s.capacity - (taken[s.id] || 0)),
  }))
}

export function money(amount: number, currency: string) {
  const fmt = new Intl.NumberFormat('en', { style: 'currency', currency: currency.toUpperCase(), currencyDisplay: 'code' })
  return fmt.format(amount / 10 ** (fmt.resolvedOptions().maximumFractionDigits ?? 2))
}

export async function markMasterclassPaid(id: string) {
  const admin = createServiceClient()
  const { data: rows } = await admin.from('masterclass_bookings')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', id).eq('status', 'pending').select('*')
  const b = rows?.[0]
  if (!b) return false
  const { data: s } = await admin.from('masterclass_sessions').select('*').eq('id', b.session_id).single()
  const { data: ed } = await admin.from('editions').select('name').eq('slug', s?.edition_slug).maybeSingle()
  const name = ed?.name || 'your masterclass'
  const details = { name, date: dateLabel(String(s?.session_date)), time: s?.session_time || '', language: LANG_NAMES[s?.language] || s?.language || '', places: b.places }
  await sendEmail(b.email, 'Your masterclass is confirmed', emails.masterclassConfirmed(b.first_name, details))
  const adminList = (process.env.ADMIN_EMAILS || '').split(',').map((e: string) => e.trim()).filter(Boolean)
  if (adminList.length) {
    await sendEmail(adminList, `New masterclass booking: ${b.first_name} ${b.last_name}, ${name}, ${details.date}`, emails.adminMasterclass({
      Masterclass: name, Date: details.date, Time: details.time, Language: details.language, Places: b.places,
      Name: `${b.first_name} ${b.last_name}`, Companion: b.companion_name || null, Email: b.email, Phone: b.phone,
      Paid: money(b.amount_cents, String(b.currency)),
    }))
  }
  return true
}
