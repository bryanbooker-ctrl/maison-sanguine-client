import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { CAREERS_APP } from '../../../site/careers'
import { JOB_GUEST_HTML } from '../../../site/careers-job'
import '../../../site/careers.css'
import '../../../site/careers-job.css'

const META: Metadata = {
  title: 'Head of Guest Experience & Relations',
  description: 'Join Maison Sanguine as Head of Guest Experience & Relations in Paris.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [CAREERS_APP]

export default function HeadOfGuestExperience() {
  return <SitePage html={JOB_GUEST_HTML} scripts={SCRIPTS} />
}
