import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../../site/SitePage'
import { FORM_COORDINATOR_HTML, FORM_APP } from '../../../../site/careers-apply'
import '../../../../site/careers-apply.css'

const META: Metadata = {
  title: 'Apply: Production Coordinator',
  description: 'Apply for the position of Production Coordinator at Maison Sanguine.',
  robots: { index: false, follow: false },
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [FORM_APP]

export default function ApplyProductionCoordinator() {
  return <SitePage h1={META.title as string} html={FORM_COORDINATOR_HTML} scripts={SCRIPTS} />
}
