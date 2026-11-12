import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { SEASON_HTML } from '../../site/season'
import { COLLECTION_APP } from '../../site/collection-app'

const META: Metadata = {
  title: 'Maison Sanguine | 2027 Season',
  description: 'A distinctive season of experiences where creative vision meets the art of celebration.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [COLLECTION_APP]

export default function Season() {
  return <SitePage html={SEASON_HTML} scripts={SCRIPTS} />
}
