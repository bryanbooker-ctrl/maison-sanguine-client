import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../site/SitePage'
import { NIGHT_COLLECTION_HTML } from '../site/night-collection'
import { COLLECTION_APP } from '../site/collection-app'

const META: Metadata = {
  title: 'Maison Sanguine | Night Collection',
  description: 'A distinctive season of experiences where creative vision meets the art of celebration.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [COLLECTION_APP]

export default function NightCollection() {
  return <SitePage html={NIGHT_COLLECTION_HTML} scripts={SCRIPTS} />
}
