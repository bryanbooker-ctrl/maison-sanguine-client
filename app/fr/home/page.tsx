import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import { CAREERS_HTML, CAREERS_APP } from '../../site/careers'
import '../../site/careers.css'

export const metadata: Metadata = {
  title: 'Join Maison Sanguine | Maison Sanguine',
  description: 'Let your talent shape the night. Discover careers at Maison Sanguine.',
}

const SCRIPTS = [CAREERS_APP]

export default function Careers() {
  return <SitePage html={CAREERS_HTML} scripts={SCRIPTS} />
}
