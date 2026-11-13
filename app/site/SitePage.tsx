import SiteScripts from './SiteScripts'
import { getLocale, t, trHtml, trJs } from '@/lib/i18n'
import { TRANSLATED } from '@/lib/locales'
import { htmlLang, langOf } from '@/lib/locations'
import './site.css'
import './spacing.css'
import './dark.css'

const SR = { position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, border: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const

function eur(html: string, locale: string) {
  const lang = langOf(locale)
  const nf = new Intl.NumberFormat(htmlLang(TRANSLATED.includes(lang) ? lang : 'en'), { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
  return html.replace(/€(\d{1,3}(?:,\d{3})*)(?!\d)/g, (_, n: string) => nf.format(+n.replace(/,/g, '')))
}

export default async function SitePage({ html, scripts, h1 }: { html: string; scripts?: string[]; h1?: string }) {
  const locale = await getLocale()
  return (
    <>
      {h1 && <h1 style={SR}>{t(h1, locale)}</h1>}
      <main className="ms-page" dangerouslySetInnerHTML={{ __html: eur(trHtml(html, locale), locale) }} />
      <SiteScripts extra={scripts?.map(code => trJs(code, locale))} />
    </>
  )
}
