import { NextResponse } from 'next/server'
import { createUserClient, createServiceClient, isAdmin } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: 'forbidden', email: user?.email || null }, { status: 403 })

  const admin = createServiceClient()
  const [{ data: admissions, error }, { data: editions }] = await Promise.all([
    admin.from('admissions').select('*').order('created_at', { ascending: false }).limit(500),
    admin.from('editions').select('*').order('sort', { ascending: true }),
  ])
  if (error) return NextResponse.json({ error: 'server', detail: error.message }, { status: 500 })
  return NextResponse.json({ admissions: admissions || [], editions: editions || [] })
}
