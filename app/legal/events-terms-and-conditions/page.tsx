import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { EVENTS_TERMS_HTML } from '../../site/legal/events-terms'
import '../../site/legal/gts.css'

const META: Metadata = {
  title: 'Events Terms & Conditions | Maison Sanguine',
  description: 'Maison Sanguine Nights General Terms & Conditions.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function EventsTerms() {
  return <SitePage h1="Events Terms & Conditions" html={EVENTS_TERMS_HTML} />
}
