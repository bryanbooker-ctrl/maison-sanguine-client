import type { Metadata } from 'next'
import SitePage from '../../../site/SitePage'
import { DESIGN_HTML } from '../../../site/design'

export const metadata: Metadata = {
  title: 'Spatial Design | Maison Sanguine',
  description: 'Edition after edition, the creators and producers of Maison Sanguine continually push artistic and technical boundaries.',
}

export default function Design() {
  return <SitePage html={DESIGN_HTML} />
}
