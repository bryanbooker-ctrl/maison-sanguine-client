import { NextResponse } from 'next/server'
import { createServiceClient, siteUrl } from '@/lib/supabase-server'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (/^[0-9a-f-]{36}$/i.test(id)) {
    await createServiceClient().from('studio_tours').update({ status: 'cancelled' }).eq('id', id).eq('status', 'pending')
  }
  return NextResponse.redirect(`${siteUrl()}/studio/book?cancelled=1`, 303)
}
