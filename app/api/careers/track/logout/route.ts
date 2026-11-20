import { NextResponse } from 'next/server'
import { TRACK_COOKIE, cookieOptions } from '@/lib/careers-track'

export const runtime = 'nodejs'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(TRACK_COOKIE, '', { ...cookieOptions(), maxAge: 0 })
  return res
}
