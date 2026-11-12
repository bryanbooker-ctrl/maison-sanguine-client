import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { ATMOSPHERES_HTML } from '../../../site/atmospheres'

const META: Metadata = {
  title: 'Maison Sanguine | Gallery of Atmospheres',
  description: 'Throughout the Seasons, Maison Sanguine explores new territories and atmospheres to shape avant-garde nocturnal experiences.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Atmospheres() {
  return <SitePage h1="Gallery of Atmospheres" html={ATMOSPHERES_HTML} />
}
