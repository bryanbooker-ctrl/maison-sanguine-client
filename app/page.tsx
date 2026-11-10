import type { Metadata } from 'next'
import SiteScripts from './site/SiteScripts'
import { HOME_HTML } from './site/home'
import './site/site.css'
import './site/spacing.css'

export const metadata: Metadata = {
  title: 'Maison Sanguine',
  description: 'Maison Sanguine, the art of celebration.',
}

export default function Home() {
  return (
    <>
      <main className="ms-page" dangerouslySetInnerHTML={{ __html: HOME_HTML }} />
      <SiteScripts />
    </>
  )
}
