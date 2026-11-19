import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { getLocale } from '@/lib/i18n'
import { TRANSLATED } from '@/lib/locales'
import { currencyOf, htmlLang, langOf } from '@/lib/locations'
import { fixedPrice, minorUnits } from '@/lib/prices'

type Edition = { slug: string; price_cents: number | null; currency: string | null; prices?: Record<string, number> | null }

export async function editionPrices(slugs: string[]): Promise<Record<string, string>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return {}
  try {
    const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data } = await db.from('editions').select('*').in('slug', slugs)
    const locale = await getLocale()
    const jar = await cookies()
    const wanted = currencyOf(locale, jar.get('ms_region')?.value).toLowerCase()
    const lang = langOf(locale)
    const fmtLang = htmlLang(TRANSLATED.includes(lang) ? lang : 'en')
    const out: Record<string, string> = {}
    for (const ed of (data || []) as Edition[]) {
      const fixed = ed.price_cents ? fixedPrice(ed.price_cents / 100, wanted) : null
      const local = ed.prices && Number(ed.prices[wanted]) > 0 ? Number(ed.prices[wanted]) : fixed ? minorUnits(fixed, wanted) : null
      const amount = local ?? ed.price_cents
      const currency = (local ? wanted : ed.currency || 'eur').toUpperCase()
      if (!amount) continue
      const fmt = new Intl.NumberFormat(fmtLang, { style: 'currency', currency, currencyDisplay: 'code' })
      const digits = fmt.resolvedOptions().maximumFractionDigits ?? 2
      out[ed.slug] = fmt.format(amount / 10 ** digits)
    }
    return out
  } catch {
    return {}
  }
}
