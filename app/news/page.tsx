import type { Metadata } from 'next'
import SitePage from '../site/SitePage'
import LightHeader from '../site/LightHeader'
import { NEWS_HTML, NEWS_APP } from '../site/news'

export const metadata: Metadata = {
  title: 'Latest Stories | Maison Sanguine',
  description: 'News, savoir-faire, art and music from Maison Sanguine.',
}

const SCRIPTS = [NEWS_APP]

export default function News() {
  return (
    <>
      <LightHeader />
      <SitePage html={NEWS_HTML} scripts={SCRIPTS} />
    </>
  )
}
