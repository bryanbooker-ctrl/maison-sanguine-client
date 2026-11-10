import type { Metadata } from 'next'
import SitePage from '../../../site/SitePage'
import { ACOUSTICS_HTML } from '../../../site/acoustics'

export const metadata: Metadata = {
  title: 'Acoustics and Mixing Techniques | Maison Sanguine',
  description: 'Maison Sanguine conceives refined sonic architectures, studied and calibrated for each property.',
}

export default function Acoustics() {
  return <SitePage html={ACOUSTICS_HTML} />
}
