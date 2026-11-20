import { createHmac, randomInt, timingSafeEqual } from 'node:crypto'

export const TRACK_COOKIE = 'ms_track'
export const CODE_TTL_MS = 5 * 60 * 1000
export const SESSION_DAYS = 14
export const STATUSES = ['new', 'review', 'interview', 'offer', 'declined', 'withdrawn'] as const
export type AppStatus = (typeof STATUSES)[number]

const secret = () => process.env.TRACK_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const normEmail = (v: unknown) => (typeof v === 'string' ? v.trim().toLowerCase().slice(0, 200) : '')
export const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
export const isUuid = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)

export function newCode() {
  return String(randomInt(0, 1000000)).padStart(6, '0')
}

export function hashCode(email: string, code: string) {
  return createHmac('sha256', secret()).update(`${normEmail(email)}:${code}`).digest('hex')
}

export function sameHash(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export function signSession(email: string, now = Date.now()) {
  const p = Buffer.from(JSON.stringify({ e: normEmail(email), x: now + SESSION_DAYS * 86400000 })).toString('base64url')
  return p + '.' + createHmac('sha256', secret()).update(p).digest('base64url')
}

export function readSession(token?: string | null, now = Date.now()) {
  if (!token || !secret()) return null
  const [p, s] = token.split('.')
  if (!p || !s) return null
  const good = createHmac('sha256', secret()).update(p).digest('base64url')
  if (!sameHash(s, good)) return null
  try {
    const v = JSON.parse(Buffer.from(p, 'base64url').toString())
    return typeof v.e === 'string' && typeof v.x === 'number' && v.x > now ? (v.e as string) : null
  } catch { return null }
}

export function maskEmail(email: string) {
  const [u, d] = email.split('@')
  if (!d) return ''
  return (u.length <= 2 ? u[0] + '*' : u.slice(0, 2) + '*'.repeat(Math.min(5, u.length - 2))) + '@' + d
}

export const careersUrl = () => (process.env.CAREERS_URL || 'https://careers.maisonsanguine.com').replace(/\/+$/, '')
export const langOf = (v: unknown) => (typeof v === 'string' && /^fr/i.test(v) ? 'fr' : 'en')

export function cookieOptions() {
  return { httpOnly: true, secure: true, sameSite: 'lax' as const, path: '/', maxAge: SESSION_DAYS * 86400 }
}
