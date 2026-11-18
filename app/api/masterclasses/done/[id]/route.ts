import { NextResponse } from 'next/server'
import { siteUrl } from '@/lib/supabase-server'
import { getCheckoutSession } from '@/lib/stripe'
import { markMasterclassPaid } from '@/lib/masterclass-sessions'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sid = new URL(request.url).searchParams.get('session_id')
  if (sid) {
    try {
      const s = await getCheckoutSession(sid)
      if (s.metadata?.admission_id === `mc_${id}` && s.payment_status === 'paid') await markMasterclassPaid(id)
    } catch {}
  }
  return NextResponse.redirect(`${siteUrl()}/masterclasses/book?confirmed=${encodeURIComponent(id)}`, 303)
}
