import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { STBARTH_EVENT_HTML } from '../../../site/night-events'

const META: Metadata = {
  title: 'Maison Sanguine | New Year\'s Eve, Saint-Barth',
  description: 'New Year\'s Eve, Saint-Barth, Season 2027. Friday, December 31, 2027.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Page() {
  return <SitePage h1="New Year's Eve, Saint-Barth" html={STBARTH_EVENT_HTML} />
}
