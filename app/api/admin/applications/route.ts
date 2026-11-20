import { NextResponse } from 'next/server'
import { createUserClient, createServiceClient, isAdmin } from '@/lib/supabase-server'

export const runtime = 'nodejs'

export async function GET() {
  const supabase = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: 'forbidden', email: user?.email || null }, { status: 403 })
  const { data, error } = await createServiceClient().from('job_applications')
    .select('id, created_at, updated_at, job_slug, job_title, email, first_name, last_name, phone, city, locale, status, answers, experience, education, links, message, files')
    .order('created_at', { ascending: false }).limit(500)
  if (error) return NextResponse.json({ error: 'server', detail: error.message }, { status: 500 })
  return NextResponse.json({ applications: data || [] })
}
