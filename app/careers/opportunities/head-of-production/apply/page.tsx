import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../../site/SitePage'
import { FORM_PRODUCTION_HTML, FORM_APP } from '../../../../site/careers-apply'
import '../../../../site/careers-apply.css'

const META: Metadata = {
  title: 'Apply: Head of Production / Executive Producer',
  description: 'Apply for the position of Head of Production / Executive Producer at Maison Sanguine.',
  robots: { index: false, follow: false },
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [FORM_APP]

export default function ApplyHeadOfProduction() {
  return <SitePage html={FORM_PRODUCTION_HTML} scripts={SCRIPTS} />
}
