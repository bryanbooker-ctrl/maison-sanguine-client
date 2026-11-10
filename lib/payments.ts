import { createServiceClient } from '@/lib/supabase-server'
import { emails, sendEmail } from '@/lib/email'

export async function markPaid(admissionId: string) {
  const admin = createServiceClient()
  const { data: rows } = await admin.from('admissions')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', admissionId).eq('status', 'accepted').select('*')
  const a = rows?.[0]
  if (!a) return false

  await admin.from('reservations').update({ status: 'confirmed' }).eq('admission_id', admissionId)
  const { data: ed } = await admin.from('editions').select('name').eq('slug', a.edition_slug).single()
  await sendEmail(a.email, 'Your night is confirmed', emails.confirmed(ed?.name || 'your night', a.first_name || ''))
  return true
}
