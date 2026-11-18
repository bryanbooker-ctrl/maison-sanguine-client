import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { STUDIO_CHROME_APP } from '../../../site/studio'
import { STUDIO_DESIGN_HTML } from '../../../site/studio-design'
import '../../../site/studio.css'
import '../../../site/studiopages.css'

const META: Metadata = {
  title: 'Maison Sanguine Studio | At the Forefront of Design',
  description: 'At the forefront of design, the Maison Sanguine Studio imagines avant-garde spatial designs inspired by art, architecture and the cultural movements of every era.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [STUDIO_CHROME_APP]

export default function DesigningNight() {
  return <SitePage html={STUDIO_DESIGN_HTML} scripts={SCRIPTS} h1="At the Forefront of Design, Maison Sanguine Studio" />
}
