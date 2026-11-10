import SiteScripts from './SiteScripts'
import './site.css'
import './spacing.css'

export default function SitePage({ html }: { html: string }) {
  return (
    <>
      <main className="ms-page" dangerouslySetInnerHTML={{ __html: html }} />
      <SiteScripts />
    </>
  )
}
