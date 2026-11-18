import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { NEWYORK_EVENT_HTML } from '../../../site/night-events'
import { NIGHT_HERO_APP, NIGHT_HERO_NEWYORK_HTML } from '../../../site/night-hero'

const META: Metadata = {
  title: 'Maison Sanguine | The Spring Edition, New York',
  description: 'The Spring Edition, New York, Season 2027. Monday, May 3, 2027.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Page() {
  return <SitePage h1="The Spring Edition, New York" html={NIGHT_HERO_NEWYORK_HTML + NEWYORK_EVENT_HTML} scripts={[NIGHT_HERO_APP]} />
}
