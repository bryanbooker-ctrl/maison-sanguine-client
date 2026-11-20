import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { TRACK_HTML, TRACK_APP } from '../../site/careers-track'
import '../../site/careers-track.css'

const META: Metadata = {
  title: 'Track your application',
  description: 'Follow the progress of your application at Maison Sanguine.',
  robots: { index: false, follow: false },
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [TRACK_APP]

export default function TrackApplication() {
  return <SitePage html={TRACK_HTML} scripts={SCRIPTS} />
}
