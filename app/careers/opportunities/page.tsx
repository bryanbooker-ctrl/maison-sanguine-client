import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import { OPPORTUNITIES_HTML, CAREERS_APP } from '../../site/careers'
import '../../site/careers.css'

export const metadata: Metadata = {
  title: 'Opportunities | Maison Sanguine',
  description: 'Find your place at Maison Sanguine.',
}

const SCRIPTS = [CAREERS_APP]

export default function Opportunities() {
  return <SitePage html={OPPORTUNITIES_HTML} scripts={SCRIPTS} />
}
