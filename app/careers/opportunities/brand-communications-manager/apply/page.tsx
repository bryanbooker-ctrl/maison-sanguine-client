import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../../site/SitePage'
import { FORM_BRAND_HTML, FORM_APP } from '../../../../site/careers-apply'
import '../../../../site/careers-apply.css'

const META: Metadata = {
  title: 'Apply: Brand & Communications Manager',
  description: 'Apply for the position of Brand & Communications Manager at Maison Sanguine.',
  robots: { index: false, follow: false },
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [FORM_APP]

export default function ApplyBrandCommunicationsManager() {
  return <SitePage html={FORM_BRAND_HTML} scripts={SCRIPTS} />
}
