import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import { SEASON_HTML } from '../../site/season'
import { COLLECTION_APP } from '../../site/collection-app'

export const metadata: Metadata = {
  title: '2027 Season | Maison Sanguine',
  description: 'A distinctive season of experiences where creative vision meets the art of celebration.',
}

const SCRIPTS = [COLLECTION_APP]

export default function Season() {
  return <SitePage html={SEASON_HTML} scripts={SCRIPTS} />
}
