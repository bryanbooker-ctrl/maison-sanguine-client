import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { STUDIO_CHROME_APP, STUDIO_TOUR_HTML } from '../../site/studio'
import { MC_PAGE_APP } from '../../site/masterclass-pages'
import '../../site/masterclass.css'
import '../../site/studio.css'

const META: Metadata = {
  title: 'Maison Sanguine Studio | Guided Tour',
  description: 'Discover the Maison Sanguine Studio on a guided visit in small groups, and step into the places where every night of the Maison takes shape.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [STUDIO_CHROME_APP, MC_PAGE_APP]

const PRICES = '<script type="application/json" id="mc-prices">{"studio-guided-tour-paris":"€45"}</script>'

export default function GuidedTour() {
  return <SitePage html={STUDIO_TOUR_HTML + PRICES} scripts={SCRIPTS} h1="Guided Tour, Maison Sanguine Studio" />
}
