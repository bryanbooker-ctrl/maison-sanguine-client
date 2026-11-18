import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { PARIS_EVENT_HTML } from '../../../site/night-events'
import { NIGHT_HERO_APP, NIGHT_HERO_PARIS_HTML } from '../../../site/night-hero'

const META: Metadata = {
  title: 'Maison Sanguine | The Fall Edition, Paris',
  description: 'The Fall Edition, Paris, Season 2027. Saturday, October 2, 2027.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Page() {
  return <SitePage h1="The Fall Edition, Paris" html={NIGHT_HERO_PARIS_HTML + PARIS_EVENT_HTML} scripts={[NIGHT_HERO_APP]} />
}
