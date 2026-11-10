import type { Metadata } from 'next'
import SitePage from '../../../site/SitePage'
import { ATMOSPHERES_HTML } from '../../../site/atmospheres'

export const metadata: Metadata = {
  title: 'Gallery of Atmospheres | Maison Sanguine',
  description: 'Throughout the Seasons, Maison Sanguine explores new territories and atmospheres to shape avant-garde nocturnal experiences.',
}

export default function Atmospheres() {
  return <SitePage html={ATMOSPHERES_HTML} />
}
