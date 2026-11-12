import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { ACOUSTICS_HTML } from '../../../site/acoustics'

const META: Metadata = {
  title: 'Maison Sanguine | Acoustics and Mixing Techniques',
  description: 'Maison Sanguine conceives refined sonic architectures, studied and calibrated for each property.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Acoustics() {
  return <SitePage h1="Acoustics and Mixing Techniques" html={ACOUSTICS_HTML} />
}
