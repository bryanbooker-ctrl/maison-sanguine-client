import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { OPPORTUNITIES_HTML, CAREERS_APP } from '../../site/careers'
import '../../site/careers.css'

const META: Metadata = {
  title: 'Maison Sanguine | Opportunities',
  description: 'Find your place at Maison Sanguine.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [CAREERS_APP]

export default function Opportunities() {
  return <SitePage html={OPPORTUNITIES_HTML} scripts={SCRIPTS} />
}
