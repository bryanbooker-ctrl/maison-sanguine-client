import { createServiceClient } from '@/lib/supabase-server'
import { getIdentitySession } from '@/lib/stripe'

const norm = (s?: string | null) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '')

function sameName(a?: string | null, b?: string | null) {
  const x = norm(a), y = norm(b)
  return !!x && !!y && (x === y || x.includes(y) || y.includes(x))
}

function ageAt(dob: { day: number; month: number; year: number }, at: Date) {
  let age = at.getFullYear() - dob.year
  if (at.getMonth() + 1 < dob.month || (at.getMonth() + 1 === dob.month && at.getDate() < dob.day)) age--
  return age
}

export type IdResult = 'verified' | 'processing' | 'requires_input' | 'failed'

export async function applyIdentity(sessionId: string): Promise<IdResult> {
  const admin = createServiceClient()
  const s = await getIdentitySession(sessionId)
  const admissionId = s.metadata?.admission_id
  const userId = s.metadata?.user_id
  if (!admissionId || !userId) return 'failed'

  const { data: a } = await admin.from('admissions').select('*').eq('id', admissionId).single()
  if (!a || a.user_id !== userId) return 'failed'

  if (s.status === 'processing') {
    await admin.from('admissions').update({ id_status: 'processing', id_session: s.id }).eq('id', a.id)
    return 'processing'
  }
  if (s.status !== 'verified') {
    await admin.from('admissions').update({ id_status: 'none', id_session: s.id, id_note: s.last_error?.reason || null }).eq('id', a.id)
    return 'requires_input'
  }

  const out = s.verified_outputs || {}
  const { data: ed } = await admin.from('editions').select('edition_date').eq('slug', a.edition_slug).single()
  const at = ed?.edition_date ? new Date(ed.edition_date) : new Date()

  let note = ''
  if (!out.dob) note = 'Date of birth unavailable'
  else if (ageAt(out.dob, at) < 21) note = 'Under 21 on the night'
  else if (s.livemode && !sameName(out.last_name, a.last_name)) note = `Name on ID: ${out.first_name || ''} ${out.last_name || ''}`.trim()

  if (note) {
    await admin.from('admissions').update({ id_status: 'failed', id_session: s.id, id_note: note }).eq('id', a.id)
    return 'failed'
  }

  await admin.from('identity_checks').upsert({ user_id: userId, verified_at: new Date().toISOString(), session_id: s.id })
  await admin.from('admissions').update({ id_status: 'verified', id_session: s.id, id_note: null }).eq('id', a.id)
  return 'verified'
}
