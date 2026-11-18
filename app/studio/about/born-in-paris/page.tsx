import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { STUDIO_CHROME_APP } from '../../../site/studio'
import { STUDIO_BORN_HTML } from '../../../site/studio-born'
import '../../../site/studio.css'
import '../../../site/studiopages.css'

const META: Metadata = {
  title: 'Maison Sanguine Studio | Born in Paris',
  description: 'Born in Paris, the Maison Sanguine Studio draws on the artistic and nocturnal heritage of the capital to imagine every night of the Maison.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [STUDIO_CHROME_APP]

export default function BornInParis() {
  return <SitePage html={STUDIO_BORN_HTML} scripts={SCRIPTS} h1="Born in Paris, Maison Sanguine Studio" />
}
