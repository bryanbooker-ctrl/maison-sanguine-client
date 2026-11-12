import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { MA_ABOUT_HTML, MA_APP } from '../../site/archives'
import '../../site/archives.css'

const META: Metadata = {
  title: 'Maison Sanguine | About MS Archives',
  description: 'The living record of Maison Sanguine: stories, innovations and rituals, from the Parisian nights that inspired the Maison to the present day.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [MA_APP]

export default function ArchivesAbout() {
  return <SitePage html={MA_ABOUT_HTML} scripts={SCRIPTS} />
}
