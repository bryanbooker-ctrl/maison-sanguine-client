import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { MASTERY_HTML } from '../../site/mastery'
import { COLLECTION_APP } from '../../site/collection-app'

const META: Metadata = {
  title: 'Maison Sanguine | Absolute Mastery',
  description: 'Together, artists, designers and technical experts go beyond traditional entertainment to create immersive nocturnal experiences.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [COLLECTION_APP]

export default function Mastery() {
  return <SitePage html={MASTERY_HTML} scripts={SCRIPTS} />
}
