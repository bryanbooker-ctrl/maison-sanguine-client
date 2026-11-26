import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from './site/SitePage'
import { HOME_HTML } from './site/home'

const META: Metadata = {
  title: 'Maison Sanguine | Luxury Entertainment Experiences',
  description: 'Maison Sanguine’s luxury experiences, between Parisian nightlife heritage and an avant-garde vision of international entertainment. Boundless creativity, driven by exceptional creative and technical mastery.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Home() {
  return <SitePage h1="Maison Sanguine" html={HOME_HTML} />
}
