import { NextResponse } from 'next/server'
import { siteUrl } from '@/lib/supabase-server'
import { getCheckoutSession } from '@/lib/stripe'
import { markTourPaid } from '@/lib/studio-tours'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sid = new URL(request.url).searchParams.get('session_id')
  if (sid) {
    try {
      const s = await getCheckoutSession(sid)
      if (s.metadata?.admission_id === `tour_${id}` && s.payment_status === 'paid') await markTourPaid(id)
    } catch {}
  }
  return NextResponse.redirect(`${siteUrl()}/studio/book?confirmed=${encodeURIComponent(id)}`, 303)
}
