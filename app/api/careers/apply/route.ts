import { NextResponse } from 'next/server'
import { emails, sendEmail } from '@/lib/email'
import { createServiceClient } from '@/lib/supabase-server'
import { careersUrl, langOf } from '@/lib/careers-track'

export const runtime = 'nodejs'

const JOBS: Record<string, string> = {
  'head-of-production': 'Head of Production / Executive Producer',
  'production-coordinator': 'Production Coordinator',
  'head-of-guest-experience': 'Head of Guest Experience & Relations',
  'brand-communications-manager': 'Brand & Communications Manager',
}
const CV_EXT = ['pdf', 'doc', 'docx', 'rtf', 'odt', 'txt']
const EXTRA_EXT = ['pdf', 'doc', 'docx', 'rtf', 'odt', 'txt', 'jpg', 'jpeg', 'png']
const MAX_TOTAL = 4 * 1024 * 1024
const YN: Record<string, string> = { yes: 'Yes', no: 'No' }
const MAX_PHOTO = 600 * 1024
const clean = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const hits = new Map<string, number[]>()

function listOf(raw: unknown, keys: string[]) {
  let v: unknown = []
  try { v = JSON.parse(typeof raw === 'string' ? raw : '[]') } catch {}
  if (!Array.isArray(v)) return []
  return v.slice(0, 12).map((e: Record<string, unknown>) => {
    const o: Record<string, string | boolean> = {}
    for (const k of keys) o[k] = k === 'cur' ? !!e.cur : clean(e[k], k === 'desc' ? 1500 : 120)
    return o
  })
}

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
    civ: clean(fd.get('civ'), 20),
    notice: clean(fd.get('notice'), 80),
    auth: clean(fd.get('auth'), 80),
    years: clean(fd.get('years'), 80),
    rate: clean(fd.get('rate'), 40),
    speaks: YN[clean(fd.get('speaks'), 3)] || '',
    noncompete: YN[clean(fd.get('noncompete'), 3)] || '',
    license: YN[clean(fd.get('license'), 3)] || '',
    car: YN[clean(fd.get('car'), 3)] || '',
    docs: YN[clean(fd.get('docs'), 3)] || '',
  }
  let langs: { lang: string; level: string }[] = []
  try {
    const raw = JSON.parse(clean(fd.get('langs'), 2000) || '[]')
    if (Array.isArray(raw)) langs = raw.slice(0, 6).map((l: Record<string, unknown>) => ({ lang: clean(l.lang, 60), level: clean(l.level, 60) })).filter(l => l.lang && l.level)
  } catch {}
  const extras = fd.getAll('extra').filter((f): f is File => f instanceof File && f.size > 0).slice(0, 3)
  const cv = fd.get('cv')
  const photo = fd.get('photo')
  if (!title || !d.first || !d.last || !d.city || !d.phone || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) || fd.get('consent') !== 'true' || !(cv instanceof File)
    || !d.civ || !d.notice || !d.auth || !d.years || !d.rate || !d.speaks || !d.noncompete || !d.license || !d.car || !langs.length)
    return NextResponse.json({ error: 'fields' }, { status: 400 })
  const ext = (cv.name.split('.').pop() || '').toLowerCase()
  if (!CV_EXT.includes(ext) || cv.size === 0) return NextResponse.json({ error: 'fields' }, { status: 400 })
  const total = cv.size + extras.reduce((n, f) => n + f.size, 0)
  if (total > MAX_TOTAL || extras.some(f => !EXTRA_EXT.includes((f.name.split('.').pop() || '').toLowerCase()))) return NextResponse.json({ error: 'fields' }, { status: 400 })

  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: 'config' }, { status: 500 })
  const to = (process.env.CAREERS_EMAILS || 'careers@maisonsanguine.com').split(/[,;\s]+/).map(e => e.replace(/^["'<\s]+|["'>.\s]+$/g, '')).filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))

  const attachments = [{ filename: `CV-${d.first}-${d.last}.${ext}`.replace(/[^\w.\-]+/g, '_'), content: Buffer.from(await cv.arrayBuffer()).toString('base64') }]
  for (let i = 0; i < extras.length; i++) {
    const f = extras[i]
    const e = (f.name.split('.').pop() || '').toLowerCase()
    attachments.push({ filename: `Attachment-${i + 1}-${d.first}-${d.last}.${e}`.replace(/[^\w.\-]+/g, '_'), content: Buffer.from(await f.arrayBuffer()).toString('base64') })
  }
  if (photo instanceof File && photo.size > 0 && photo.size <= MAX_PHOTO && photo.type === 'image/jpeg')
    attachments.push({ filename: 'photo.jpg', content: Buffer.from(await photo.arrayBuffer()).toString('base64') })

  const rows: [string, string][] = [
    ['Position', title], ['First name', d.first], ['Last name', d.last], ['Email', d.email],
    ['Phone', `${d.dial} ${d.phone}`.trim()], ['City', d.city], ['LinkedIn', d.linkedin], ['Facebook', d.facebook],
    ['X', d.x], ['Website', d.site], ['Language', d.lang],
    ['Title', d.civ], ['Languages', langs.map(l => `${l.lang} (${l.level})`).join('\n')],
    ['Speaks the language of the job posting', d.speaks], ['Notice period', d.notice], ['Non-compete clause', d.noncompete],
    ['Driver\'s license', d.license], ['Car', d.car], ['Authorized to work in France', d.auth], ['Years of experience', d.years],
    ['Ideal activity rate', d.rate], ['All requested documents attached', d.docs], ['Other attachments', extras.map(f => f.name).join(', ')],
    ['Experience', entries(fd.get('exp'), 'exp')], ['Education', entries(fd.get('edu'), 'edu')], ['Message', d.message],
  ]
  let ref = ''
  try {
    const photoUrl = photo instanceof File && photo.size > 0 && photo.size <= 300 * 1024 && photo.type === 'image/jpeg'
      ? 'data:image/jpeg;base64,' + Buffer.from(await photo.arrayBuffer()).toString('base64') : null
    const { data: row } = await createServiceClient().from('job_applications').insert({
      job_slug: slug, job_title: title, email: d.email, first_name: d.first, last_name: d.last,
      phone: `${d.dial} ${d.phone}`.trim(), city: d.city, locale: langOf(d.lang), photo: photoUrl,
      answers: { civ: d.civ, langs, speaks: d.speaks, notice: d.notice, noncompete: d.noncompete, license: d.license, car: d.car, auth: d.auth, years: d.years, rate: d.rate, docs: d.docs },
      experience: listOf(fd.get('exp'), ['title', 'company', 'loc', 'desc', 'from', 'to', 'cur']),
      education: listOf(fd.get('edu'), ['school', 'spec', 'level', 'loc', 'desc', 'from', 'to', 'cur']),
      links: { linkedin: d.linkedin, facebook: d.facebook, x: d.x, site: d.site },
      message: d.message,
      files: [{ name: cv.name, size: cv.size, kind: 'cv' }, ...extras.map(f => ({ name: f.name, size: f.size, kind: 'other' }))],
    }).select('id').single()
    ref = row?.id || ''
  } catch {}

  const sent = await sendEmail(to, `Application: ${title}, ${d.first} ${d.last}`, emails.applicationNew(title, rows), d.email, attachments)
  if (!('ok' in sent) || !sent.ok) {
    if (ref) { try { await createServiceClient().from('job_applications').delete().eq('id', ref) } catch {} }
    return NextResponse.json({ error: 'send' }, { status: 502 })
  }
  const lang = langOf(d.lang)
  const link = `${careersUrl()}/applications${ref ? `?ref=${ref}` : ''}`
  await sendEmail(d.email, lang === 'fr' ? 'Votre candidature a bien été reçue' : 'Your application has been received', emails.applicationReceived(d.first, title, link, lang))
  return NextResponse.json({ ok: true, ref })
}
