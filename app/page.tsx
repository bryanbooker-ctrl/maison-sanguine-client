import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from './site/SitePage'
import { HOME_HTML } from './site/home'

const META: Metadata = {
  title: 'Maison Sanguine',
  description: 'Maison Sanguine, the art of celebration.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Home() {
  return <SitePage h1="Maison Sanguine" html={HOME_HTML} />
}
