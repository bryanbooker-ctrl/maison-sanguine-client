import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { STUDIO_CHROME_APP } from '../../../site/studio'
import { STUDIO_MASTERY_HTML } from '../../../site/studio-mastery'
import '../../../site/studio.css'
import '../../../site/studiopages.css'

const META: Metadata = {
  title: 'Maison Sanguine Studio | At the Heart of Mastery',
  description: 'At the heart of mastery, the Maison Sanguine Studio brings together scenography, sound architecture and technical engineering to make every night a fully immersive experience.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [STUDIO_CHROME_APP]

export default function AtTheHeartOfMastery() {
  return <SitePage html={STUDIO_MASTERY_HTML} scripts={SCRIPTS} h1="At the Heart of Mastery, Maison Sanguine Studio" />
}
