import { cookies } from 'next/headers'
import SiteScripts from './SiteScripts'
import { currencyOf } from '@/lib/locations'
import { fixedPrice, formatPrice } from '@/lib/prices'
import { getLocale, t, trHtml, trJs } from '@/lib/i18n'
import './site.css'
import './spacing.css'
import './dark.css'

const SR = { position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, border: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const

function eur(html: string, currency: string) {
  return html.replace(/€(\d{1,3}(?:,\d{3})*)(?!\d)/g, (_, n: string) => {
    const v = +n.replace(/,/g, '')
    const local = fixedPrice(v, currency)
    return local ? formatPrice(local, currency) : formatPrice(v, 'EUR')
  })
}

export default async function SitePage({ html, scripts, h1 }: { html: string; scripts?: string[]; h1?: string }) {
  const locale = await getLocale()
  const currency = currencyOf(locale, (await cookies()).get('ms_region')?.value)
  return (
    <>
      {h1 && <h1 style={SR}>{t(h1, locale)}</h1>}
      <main className="ms-page" dangerouslySetInnerHTML={{ __html: eur(trHtml(html, locale), currency) }} />
      <SiteScripts extra={scripts?.map(code => trJs(code, locale))} />
    </>
  )
}
