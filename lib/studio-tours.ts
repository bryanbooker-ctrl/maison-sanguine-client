import { createServiceClient } from '@/lib/supabase-server'
import { emails, sendEmail } from '@/lib/email'

export const TOUR = {
  slots: ['11:00', '14:00', '16:00'],
  capacity: 8,
  priceCents: 4500,
  currency: 'eur',
  days: [2, 3, 4, 5, 6],
  horizonDays: 120,
  holdMinutes: 33,
  languages: ['en', 'fr'],
}

export const LANG_NAMES: Record<string, string> = { en: 'English', fr: 'French' }

export type SlotState = { left: number; lang: string | null }
export type Days = Record<string, Record<string, SlotState>>

export function parisToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date())
}

export function addDays(d: string, n: number) {
  const t = new Date(d + 'T12:00:00Z')
  t.setUTCDate(t.getUTCDate() + n)
  return t.toISOString().slice(0, 10)
}

export function isDate(d: unknown): d is string {
  return typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d + 'T12:00:00Z'))
}

function open(d: string, closed: Set<string>) {
  const today = parisToday()
  return d > today && d <= addDays(today, TOUR.horizonDays) && TOUR.days.includes(new Date(d + 'T12:00:00Z').getUTCDay()) && !closed.has(d)
}

export async function availability(from: string, to: string): Promise<Days> {
  const admin = createServiceClient()
  const since = new Date(Date.now() - TOUR.holdMinutes * 60000).toISOString()
  const [{ data: rows }, { data: cl }] = await Promise.all([
    admin.from('studio_tours').select('tour_date,slot,language,places,status,created_at')
      .gte('tour_date', from).lte('tour_date', to).in('status', ['pending', 'paid']),
    admin.from('studio_closures').select('day').gte('day', from).lte('day', to),
  ])
  const closed = new Set((cl || []).map(c => String(c.day)))
  const out: Days = {}
  for (let d = from; d <= to; d = addDays(d, 1)) {
    if (!open(d, closed)) continue
    out[d] = {}
    for (const s of TOUR.slots) out[d][s] = { left: TOUR.capacity, lang: null }
  }
  for (const r of rows || []) {
    if (r.status === 'pending' && r.created_at < since) continue
    const x = out[String(r.tour_date)]?.[r.slot]
    if (!x) continue
    x.left = Math.max(0, x.left - r.places)
    x.lang = x.lang || r.language
  }
  return out
}

export function dateLabel(d: string) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(d + 'T12:00:00Z'))
}

export async function markTourPaid(id: string) {
  const admin = createServiceClient()
  const { data: rows } = await admin.from('studio_tours')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', id).eq('status', 'pending').select('*')
  const t = rows?.[0]
  if (!t) return false
  const details = { date: dateLabel(String(t.tour_date)), slot: t.slot, language: LANG_NAMES[t.language] || t.language, places: t.places }
  await sendEmail(t.email, 'Your visit is confirmed', emails.tourConfirmed(t.first_name, details))
  const adminList = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)
  if (adminList.length) {
    await sendEmail(adminList, `New Studio visit: ${t.first_name} ${t.last_name}, ${details.date} ${t.slot}`, emails.adminTour({
      Date: details.date, Time: t.slot, Language: details.language, Guests: t.places,
      Name: `${t.first_name} ${t.last_name}`, Email: t.email, Phone: t.phone,
      Paid: `${(t.amount_cents / 100).toFixed(2)} EUR`,
    }))
  }
  return true
}
