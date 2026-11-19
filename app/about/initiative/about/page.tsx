import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { INITIATIVE_ABOUT_HTML, INITIATIVE_APP } from '../../../site/initiative'
import '../../../site/initiative.css'

const META: Metadata = {
  title: 'Maison Sanguine | Initiative, About',
  description: 'Discover the vision, commitments and values of the Maison Sanguine Initiative.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Page() {
  return <SitePage html={INITIATIVE_ABOUT_HTML} scripts={[INITIATIVE_APP]} />
}
