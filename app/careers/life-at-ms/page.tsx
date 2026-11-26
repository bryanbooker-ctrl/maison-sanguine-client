import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { LIFEATMS_HTML, CAREERS_APP } from '../../site/careers'
import '../../site/careers.css'

const META: Metadata = {
  title: 'We are MS',
  description: 'Discover the people, the heritage and the values that make Maison Sanguine.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [CAREERS_APP]

export default function LifeAtMs() {
  return <SitePage h1={META.title as string} html={LIFEATMS_HTML} scripts={SCRIPTS} />
}
