import { NextResponse, type NextRequest } from 'next/server'
import { ACCESS_COOKIE, accessToken, codeIsValid } from '@/lib/maintenance'

const hits = new Map<string, number[]>()

export async function POST(request: NextRequest) {
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter(t => now - t < 10 * 60 * 1000)
  if (recent.length >= 8) return new NextResponse('Too many attempts', { status: 429 })
  hits.set(ip, [...recent, now])

  const form = await request.formData().catch(() => null)
  const code = String(form?.get('code') || '')
  const back = (path: string) => NextResponse.redirect(new URL(path, request.url), 303)
  if (!codeIsValid(code)) return back('/?e=1')

  const res = back('/')
  const host = (request.headers.get('host') || '').toLowerCase()
  res.cookies.set(ACCESS_COOKIE, await accessToken(), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
    ...(host.endsWith('maisonsanguine.com') ? { domain: '.maisonsanguine.com' } : {}),
  })
  return res
}
