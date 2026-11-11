import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import { EVENTS_TERMS_HTML } from '../../site/legal/events-terms'
import '../../site/legal/gts.css'

export const metadata: Metadata = {
  title: 'Events Terms & Conditions | Maison Sanguine',
  description: 'Maison Sanguine Nights General Terms & Conditions.',
}

export default function EventsTerms() {
  return <SitePage html={EVENTS_TERMS_HTML} />
}
