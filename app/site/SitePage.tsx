import SiteScripts from './SiteScripts'
import { getLocale, t, trHtml, trJs } from '@/lib/i18n'
import './site.css'
import './spacing.css'
import './dark.css'

const SR = { position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, border: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const

export default async function SitePage({ html, scripts, h1 }: { html: string; scripts?: string[]; h1?: string }) {
  const locale = await getLocale()
  return (
    <>
      {h1 && <h1 style={SR}>{t(h1, locale)}</h1>}
      <main className="ms-page" dangerouslySetInnerHTML={{ __html: trHtml(html, locale) }} />
      <SiteScripts extra={scripts?.map(code => trJs(code, locale))} />
    </>
  )
}
