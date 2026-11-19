import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { STUDIO_CHROME_APP } from '../../../site/studio'
import { STUDIO_THE_HTML } from '../../../site/studio-the'
import '../../../site/studio.css'
import '../../../site/studiopages.css'

const META: Metadata = {
  title: 'Maison Sanguine Studio | The Studio',
  description: 'The Maison Sanguine Studio brings together the House’s creators and producers, where the artistic, spatial and technical creations of each production take shape.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [STUDIO_CHROME_APP]

export default function TheStudio() {
  return <SitePage html={STUDIO_THE_HTML} scripts={SCRIPTS} h1="The Studio, Maison Sanguine Studio" />
}
