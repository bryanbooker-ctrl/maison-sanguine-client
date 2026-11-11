import SiteScripts from './SiteScripts'
import './site.css'
import './spacing.css'
import './dark.css'

const SR = { position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, border: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const

export default function SitePage({ html, scripts, h1 }: { html: string; scripts?: string[]; h1?: string }) {
  return (
    <>
      {h1 && <h1 style={SR}>{h1}</h1>}
      <main className="ms-page" dangerouslySetInnerHTML={{ __html: html }} />
      <SiteScripts extra={scripts} />
    </>
  )
}
