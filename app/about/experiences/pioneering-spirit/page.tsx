import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { INNOVATIONS_HTML } from '../../../site/innovations'

const META: Metadata = {
  title: 'Maison Sanguine | Our Innovations over the Seasons',
  description: 'Maison Sanguine keeps one foot rooted in Parisian nightlife heritage and one foot stepping into the future of entertainment and culture.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Innovations() {
  return <SitePage h1="Our Innovations over the Seasons" html={INNOVATIONS_HTML} />
}
