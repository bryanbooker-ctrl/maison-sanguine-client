import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { TROPEZ_EVENT_HTML } from '../../../site/night-events'
import { NIGHT_HERO_APP, NIGHT_HERO_TROPEZ_HTML } from '../../../site/night-hero'

const META: Metadata = {
  title: 'Maison Sanguine | Rite of Summer, Saint-Tropez',
  description: 'Rite of Summer, Saint-Tropez, Season 2027. Saturday, July 24, 2027.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Page() {
  return <SitePage h1="Rite of Summer, Saint-Tropez" html={NIGHT_HERO_TROPEZ_HTML + TROPEZ_EVENT_HTML} scripts={[NIGHT_HERO_APP]} />
}
