import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { CAREERS_APP } from '../../../site/careers'
import { JOB_COORDINATOR_HTML } from '../../../site/careers-job'
import '../../../site/careers.css'
import '../../../site/careers-job.css'

const META: Metadata = {
  title: 'Production Coordinator',
  description: 'Join Maison Sanguine as Production Coordinator in Paris.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [CAREERS_APP]

export default function ProductionCoordinator() {
  return <SitePage html={JOB_COORDINATOR_HTML} scripts={SCRIPTS} />
}
