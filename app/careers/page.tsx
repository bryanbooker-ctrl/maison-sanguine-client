import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../site/SitePage'
import { CAREERS_HTML, CAREERS_APP } from '../site/careers'
import '../site/careers.css'

const META: Metadata = {
  title: 'Maison Sanguine | Careers',
  description: 'Let your talent shape the night. Discover careers at Maison Sanguine.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [CAREERS_APP]

export default function Careers() {
  return <SitePage html={CAREERS_HTML} scripts={SCRIPTS} />
}
