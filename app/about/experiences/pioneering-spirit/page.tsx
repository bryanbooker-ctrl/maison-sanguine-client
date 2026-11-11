import type { Metadata } from 'next'
import SitePage from '../../../site/SitePage'
import { INNOVATIONS_HTML } from '../../../site/innovations'

export const metadata: Metadata = {
  title: 'Our Innovations over the Seasons | Maison Sanguine',
  description: 'Maison Sanguine keeps one foot rooted in Parisian nightlife heritage and one foot stepping into the future of entertainment and culture.',
}

export default function Innovations() {
  return <SitePage h1="Our Innovations over the Seasons" html={INNOVATIONS_HTML} />
}
