import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import { MA_ABOUT_HTML, MA_APP } from '../../site/archives'
import '../../site/archives.css'

export const metadata: Metadata = {
  title: 'About | MS Archives | Maison Sanguine',
  description: 'The living record of Maison Sanguine: stories, innovations and rituals, from the Parisian nights that inspired the Maison to the present day.',
}

const SCRIPTS = [MA_APP]

export default function ArchivesAbout() {
  return <SitePage html={MA_ABOUT_HTML} scripts={SCRIPTS} />
}
