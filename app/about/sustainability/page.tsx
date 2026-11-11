import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import { SUSTAINABILITY_HTML } from '../../site/sustainability'

export const metadata: Metadata = {
  title: 'Sustainability | Maison Sanguine',
  description: 'Sustainability at Maison Sanguine: environment, people and communities, and governance.',
}

export default function Page() {
  return <SitePage h1="Sustainability" html={SUSTAINABILITY_HTML} />
}
