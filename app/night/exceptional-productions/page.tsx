import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import { PRODUCTIONS_HTML } from '../../site/productions'

export const metadata: Metadata = {
  title: 'Exceptional Productions | Maison Sanguine',
  description: 'Maison Sanguine redefines traditional entertainment with nights that combine technical innovation and creativity.',
}

export default function Productions() {
  return <SitePage h1="Exceptional Productions" html={PRODUCTIONS_HTML} />
}
