import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../site/SitePage'
import { NEWS_HTML, NEWS_APP } from '../site/news'

const META: Metadata = {
  title: 'Latest Stories | Maison Sanguine',
  description: 'News, savoir-faire, art and music from Maison Sanguine.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [NEWS_APP]

export default function News() {
  return <SitePage html={NEWS_HTML} scripts={SCRIPTS} />
}
