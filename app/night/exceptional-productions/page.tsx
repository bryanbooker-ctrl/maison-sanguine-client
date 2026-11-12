import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { PRODUCTIONS_HTML } from '../../site/productions'

const META: Metadata = {
  title: 'Exceptional Productions | Maison Sanguine',
  description: 'Maison Sanguine redefines traditional entertainment with nights that combine technical innovation and creativity.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Productions() {
  return <SitePage h1="Exceptional Productions" html={PRODUCTIONS_HTML} />
}
