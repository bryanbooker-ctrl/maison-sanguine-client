import { NextResponse } from 'next/server'
import { createServiceClient, siteUrl } from '@/lib/supabase-server'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let slug = ''
  if (/^[0-9a-f-]{36}$/i.test(id)) {
    const admin = createServiceClient()
    const { data: b } = await admin.from('masterclass_bookings').update({ status: 'cancelled' }).eq('id', id).eq('status', 'pending').select('session_id')
    if (b?.[0]) {
      const { data: s } = await admin.from('masterclass_sessions').select('edition_slug').eq('id', b[0].session_id).maybeSingle()
      slug = s?.edition_slug || ''
    }
  }
  return NextResponse.redirect(`${siteUrl()}/masterclasses/book?cancelled=1${slug ? `&edition=${encodeURIComponent(slug)}` : ''}`, 303)
}
