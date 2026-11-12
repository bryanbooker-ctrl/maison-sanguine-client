import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../site/SitePage'
import { LOCATIONS_HTML, LOCATIONS_APP } from '../site/locations'

const META: Metadata = {
  title: 'Find an Experience | Maison Sanguine',
  description: 'Discover the destinations of the Maison, from the nights of the Season to our Houses and Cafés.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [LOCATIONS_APP]

export default function Locations() {
  return <SitePage html={LOCATIONS_HTML} scripts={SCRIPTS} />
}
