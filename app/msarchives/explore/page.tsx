import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { MA_EXPLORE_HTML, MA_APP } from '../../site/archives'
import '../../site/archives.css'

const META: Metadata = {
  title: 'Maison Sanguine | Explore MS Archives',
  description: 'The living record of Maison Sanguine: stories, innovations and rituals, from the Parisian nights that inspired the Maison to the present day.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [MA_APP]

export default function ArchivesExplore() {
  return <SitePage h1="Explore the MS Archives" html={MA_EXPLORE_HTML} scripts={SCRIPTS} />
}
