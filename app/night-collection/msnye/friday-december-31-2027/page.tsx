import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { STBARTH_EVENT_HTML } from '../../../site/night-events'
import { NIGHT_HERO_APP, NIGHT_HERO_STBARTH_HTML } from '../../../site/night-hero'

const META: Metadata = {
  title: 'Maison Sanguine | New Year\'s Eve, Saint-Barth',
  description: 'New Year\'s Eve, Saint-Barth, Season 2027. Friday, December 31, 2027.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Page() {
  return <SitePage h1="New Year's Eve, Saint-Barth" html={NIGHT_HERO_STBARTH_HTML + STBARTH_EVENT_HTML} scripts={[NIGHT_HERO_APP]} />
}
