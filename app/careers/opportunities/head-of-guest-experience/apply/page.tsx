import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../../site/SitePage'
import { FORM_GUEST_HTML, FORM_APP } from '../../../../site/careers-apply'
import '../../../../site/careers-apply.css'

const META: Metadata = {
  title: 'Apply: Head of Guest Experience & Relations',
  description: 'Apply for the position of Head of Guest Experience & Relations at Maison Sanguine.',
  robots: { index: false, follow: false },
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [FORM_APP]

export default function ApplyHeadOfGuestExperience() {
  return <SitePage h1={META.title as string} html={FORM_GUEST_HTML} scripts={SCRIPTS} />
}
