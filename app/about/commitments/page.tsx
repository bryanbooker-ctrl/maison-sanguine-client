import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { SUSTAINABILITY_HTML } from '../../site/sustainability'

const META: Metadata = {
  title: 'Maison Sanguine | Sustainability at MS',
  description: 'Sustainability at Maison Sanguine: environment, people and communities, and governance.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Page() {
  return <SitePage h1="Sustainability" html={SUSTAINABILITY_HTML} />
}
