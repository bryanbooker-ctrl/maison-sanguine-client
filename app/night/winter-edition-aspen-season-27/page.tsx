import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import { ASPEN_HTML } from '../../site/aspen'

export const metadata: Metadata = {
  title: 'Winter Edition Aspen | Maison Sanguine',
  description: 'A winter night designed for Aspen, at the heart of the Colorado Rockies.',
}

export default function Page() {
  return <SitePage html={ASPEN_HTML} />
}
