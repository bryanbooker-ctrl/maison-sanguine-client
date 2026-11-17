import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../site/SitePage'
import { STUDIO_HTML, STUDIO_APP, STUDIO_CHROME_APP } from '../site/studio'
import '../site/studio.css'

const META: Metadata = {
  title: 'Maison Sanguine Studio',
  description: 'Step into the heart of the universe of Maison Sanguine and discover the Maison Sanguine Studio, a living place that pays tribute to the artists and creators of the Maison.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [STUDIO_CHROME_APP, STUDIO_APP]

export default function Studio() {
  return <SitePage html={STUDIO_HTML} scripts={SCRIPTS} h1="Maison Sanguine Studio" />
}
