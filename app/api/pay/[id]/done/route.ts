import { NextResponse } from 'next/server'
import { siteUrl } from '@/lib/supabase-server'
import { getCheckoutSession } from '@/lib/stripe'
import { markPaid } from '@/lib/payments'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sid = new URL(request.url).searchParams.get('session_id')
  if (sid) {
    try {
      const s = await getCheckoutSession(sid)
      if (s.metadata?.admission_id === id && s.payment_status === 'paid') await markPaid(id)
    } catch {}
  }
  return NextResponse.redirect(`${siteUrl()}/dashboard?tab=experiences&paid=1&a=${encodeURIComponent(id)}`, 303)
}
