import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { TROPEZ_EVENT_HTML } from '../../../site/night-events'

const META: Metadata = {
  title: 'Maison Sanguine | Rite of Summer, Saint-Tropez',
  description: 'Rite of Summer, Saint-Tropez, Season 2027. Saturday, July 24, 2027.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Page() {
  return <SitePage h1="Rite of Summer, Saint-Tropez" html={TROPEZ_EVENT_HTML} />
}
