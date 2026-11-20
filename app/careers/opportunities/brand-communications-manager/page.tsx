import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../../site/SitePage'
import { CAREERS_APP } from '../../../site/careers'
import { JOB_BRAND_HTML } from '../../../site/careers-job'
import '../../../site/careers.css'
import '../../../site/careers-job.css'

const META: Metadata = {
  title: 'Brand & Communications Manager',
  description: 'Join Maison Sanguine as Brand & Communications Manager in Paris.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [CAREERS_APP]

export default function BrandCommunicationsManager() {
  return <SitePage html={JOB_BRAND_HTML} scripts={SCRIPTS} />
}
