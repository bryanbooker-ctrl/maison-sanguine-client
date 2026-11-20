import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase-server'
import { TRACK_COOKIE, readSession } from '@/lib/careers-track'

export const runtime = 'nodejs'

export async function GET() {
  const email = readSession((await cookies()).get(TRACK_COOKIE)?.value)
  if (!email) return NextResponse.json({ error: 'auth' }, { status: 401, headers: { 'cache-control': 'no-store' } })
  const { data } = await createServiceClient().from('job_applications')
    .select('id, created_at, job_slug, job_title, first_name, last_name, email, phone, city, photo, status, answers')
    .eq('email', email).order('created_at', { ascending: false })
  return NextResponse.json({ email, applications: data || [] }, { headers: { 'cache-control': 'no-store' } })
}
