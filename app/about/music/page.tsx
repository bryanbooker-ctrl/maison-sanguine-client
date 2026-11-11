import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import { MUSIC_HTML } from '../../site/music'

export const metadata: Metadata = {
  title: 'Maison Sanguine x Music | Maison Sanguine',
  description: 'Maison Sanguine shares its passion for music and excellence through a common language of emotion.',
}

export default function Page() {
  return <SitePage h1="Maison Sanguine x Music" html={MUSIC_HTML} />
}
