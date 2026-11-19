import { NextResponse } from 'next/server'
import { siteUrl } from '@/lib/supabase-server'
import { getCheckoutSession } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase-server'
import { bookPath, markMasterclassPaid } from '@/lib/masterclass-sessions'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sid = new URL(request.url).searchParams.get('session_id')
  if (sid) {
    try {
      const s = await getCheckoutSession(sid)
      if (s.metadata?.admission_id === `mc_${id}` && s.payment_status === 'paid') await markMasterclassPaid(id)
    } catch {}
  }
  let slug = ''
  if (/^[0-9a-f-]{36}$/i.test(id)) {
    const admin = createServiceClient()
    const { data: b } = await admin.from('masterclass_bookings').select('session_id').eq('id', id).maybeSingle()
    const { data: x } = b ? await admin.from('masterclass_sessions').select('edition_slug').eq('id', b.session_id).maybeSingle() : { data: null }
    slug = x?.edition_slug || ''
  }
  return NextResponse.redirect(`${siteUrl()}${bookPath(slug)}?confirmed=${encodeURIComponent(id)}`, 303)
}
