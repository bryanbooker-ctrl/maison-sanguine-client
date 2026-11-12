import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { DESIGN_HTML } from '../../../site/design'

const META: Metadata = {
  title: 'Spatial Design | Maison Sanguine',
  description: 'Edition after edition, the creators and producers of Maison Sanguine continually push artistic and technical boundaries.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Design() {
  return <SitePage h1="Spatial Design" html={DESIGN_HTML} />
}
