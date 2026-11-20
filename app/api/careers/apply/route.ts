import { NextResponse } from 'next/server'
import { emails, sendEmail } from '@/lib/email'

export const runtime = 'nodejs'

const JOBS: Record<string, string> = {
  'head-of-production': 'Head of Production / Executive Producer',
  'production-coordinator': 'Production Coordinator',
  'head-of-guest-experience': 'Head of Guest Experience & Relations',
  'brand-communications-manager': 'Brand & Communications Manager',
}
const CV_EXT = ['pdf', 'doc', 'docx', 'rtf', 'odt', 'txt']
const MAX_CV = 4 * 1024 * 1024
const MAX_PHOTO = 600 * 1024
const clean = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const hits = new Map<string, number[]>()

function entries(raw: unknown, kind: 'exp' | 'edu') {
  let list: unknown = []
  try { list = JSON.parse(typeof raw === 'string' ? raw : '[]') } catch {}
  if (!Array.isArray(list)) return ''
  return list.slice(0, 12).map((e: Record<string, unknown>) => {
    const main = kind === 'exp' ? clean(e.title, 120) : clean(e.school, 120)
    const sub = kind === 'exp' ? clean(e.company, 120) : [clean(e.spec, 120), clean(e.level, 80)].filter(Boolean).join(', ')
    const dates = [clean(e.from, 12), e.cur ? 'Present' : clean(e.to, 12)].filter(Boolean).join(' to ')
    return [main, sub, clean(e.loc, 120), dates, clean(e.desc, 1500)].filter(Boolean).join('\n')
  }).filter(Boolean).join('\n\n')
}

export async function POST(request: Request) {
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'x'
  const now = Date.now()
  const list = (hits.get(ip) || []).filter(t => now - t < 600000)
  if (list.length >= 4) return NextResponse.json({ error: 'rate' }, { status: 429 })
  hits.set(ip, [...list, now])

  const fd = await request.formData().catch(() => null)
  if (!fd) return NextResponse.json({ error: 'fields' }, { status: 400 })
  if (clean(fd.get('website'))) return NextResponse.json({ ok: true })

  const slug = clean(fd.get('job'), 80)
  const title = JOBS[slug]
  const d = {
    first: clean(fd.get('first'), 60),
    last: clean(fd.get('last'), 60),
    email: clean(fd.get('email'), 200).toLowerCase(),
    city: clean(fd.get('city'), 100),
    dial: clean(fd.get('dial'), 8),
    phone: clean(fd.get('phone'), 30),
    linkedin: clean(fd.get('linkedin'), 300),
    facebook: clean(fd.get('facebook'), 300),
    x: clean(fd.get('x'), 300),
    site: clean(fd.get('site'), 300),
    message: clean(fd.get('message'), 4000),
    lang: clean(fd.get('lang'), 12),
  }
  const cv = fd.get('cv')
  const photo = fd.get('photo')
  if (!title || !d.first || !d.last || !d.city || !d.phone || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) || fd.get('consent') !== 'true' || !(cv instanceof File))
    return NextResponse.json({ error: 'fields' }, { status: 400 })
  const ext = (cv.name.split('.').pop() || '').toLowerCase()
  if (!CV_EXT.includes(ext) || cv.size === 0 || cv.size > MAX_CV) return NextResponse.json({ error: 'fields' }, { status: 400 })

  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: 'config' }, { status: 500 })
  const to = (process.env.CAREERS_EMAILS || 'careers@maisonsanguine.com').split(',').map(e => e.trim()).filter(Boolean)

  const attachments = [{ filename: `CV-${d.first}-${d.last}.${ext}`.replace(/[^\w.\-]+/g, '_'), content: Buffer.from(await cv.arrayBuffer()).toString('base64') }]
  if (photo instanceof File && photo.size > 0 && photo.size <= MAX_PHOTO && photo.type === 'image/jpeg')
    attachments.push({ filename: 'photo.jpg', content: Buffer.from(await photo.arrayBuffer()).toString('base64') })

  const rows: [string, string][] = [
    ['Position', title], ['First name', d.first], ['Last name', d.last], ['Email', d.email],
    ['Phone', `${d.dial} ${d.phone}`.trim()], ['City', d.city], ['LinkedIn', d.linkedin], ['Facebook', d.facebook],
    ['X', d.x], ['Website', d.site], ['Language', d.lang],
    ['Experience', entries(fd.get('exp'), 'exp')], ['Education', entries(fd.get('edu'), 'edu')], ['Message', d.message],
  ]
  const sent = await sendEmail(to, `Application: ${title}, ${d.first} ${d.last}`, emails.applicationNew(title, rows), d.email, attachments)
  if (!('ok' in sent) || !sent.ok) return NextResponse.json({ error: 'send' }, { status: 502 })
  await sendEmail(d.email, 'Your application has been received', emails.applicationReceived(d.first, title))
  return NextResponse.json({ ok: true })
}
