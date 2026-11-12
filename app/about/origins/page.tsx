import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { ORIGINS_HTML } from '../../site/origins'

const META: Metadata = {
  title: 'Born in Paris | Maison Sanguine',
  description: 'Our story begins in Paris, where nightlife entertainment has been written for more than 140 years.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Origins() {
  return <SitePage h1="Born in Paris" html={ORIGINS_HTML} />
}
