import { NextResponse } from 'next/server'
import { createUserClient, createServiceClient, siteUrl } from '@/lib/supabase-server'
import { createCheckout, createIdentitySession } from '@/lib/stripe'
import { applyIdentity } from '@/lib/identity'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const base = siteUrl()
  const back = (q = '') => NextResponse.redirect(`${base}/dashboard?tab=experiences${q}`, 303)

  const supabase = await createUserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${base}/auth/login?next=${encodeURIComponent(`/api/pay/${id}`)}`, 303)

  const admin = createServiceClient()
  const { data: a } = await admin.from('admissions').select('*').eq('id', id).eq('user_id', user.id).single()
  if (!a) return back()
  if (a.status === 'paid') return back('&paid=1')
  if (a.status !== 'accepted') return back()

  const { data: ed } = await admin.from('editions').select('*').eq('slug', a.edition_slug).single()
  if (!ed || !ed.price_cents) return back()

  try {
    const { data: checked } = await admin.from('identity_checks').select('user_id').eq('user_id', user.id).maybeSingle()
    let verified = !!checked
    if (verified && a.id_status !== 'verified') {
      await admin.from('admissions').update({ id_status: 'verified', id_note: null }).eq('id', a.id)
    }

    if (!verified) {
      if (a.id_status === 'failed') return back('&verify=failed')
      if (a.id_session) {
        const r = await applyIdentity(a.id_session)
        if (r === 'failed') return back('&verify=failed')
        if (r === 'processing') return back('&verify=processing')
        verified = r === 'verified'
      }
      if (!verified) {
        const session = await createIdentitySession({
          email: a.email, admissionId: a.id, userId: user.id, returnUrl: `${base}/api/pay/${a.id}`,
        })
        await admin.from('admissions').update({ id_session: session.id }).eq('id', a.id)
        return NextResponse.redirect(session.url!, 303)
      }
    }

    const checkout = await createCheckout({
      name: ed.name, amount: ed.price_cents, currency: ed.currency || 'eur', quantity: a.places,
      email: a.email, admissionId: a.id,
      successUrl: `${base}/api/pay/${a.id}/done?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${base}/dashboard?tab=experiences`,
    })
    return NextResponse.redirect(checkout.url, 303)
  } catch (e) {
    console.error('MS pay error:', e instanceof Error ? e.message : e)
    return back('&payment=error')
  }
}
