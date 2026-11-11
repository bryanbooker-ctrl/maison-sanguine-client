import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import { ORIGINS_HTML } from '../../site/origins'

export const metadata: Metadata = {
  title: 'Born in Paris | Maison Sanguine',
  description: 'Our story begins in Paris, where nightlife entertainment has been written for more than 140 years.',
}

export default function Origins() {
  return <SitePage h1="Born in Paris" html={ORIGINS_HTML} />
}
