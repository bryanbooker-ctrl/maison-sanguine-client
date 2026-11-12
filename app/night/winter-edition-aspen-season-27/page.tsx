import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { ASPEN_HTML } from '../../site/aspen'

const META: Metadata = {
  title: 'Winter Edition Aspen | Maison Sanguine',
  description: 'A winter night designed for Aspen, at the heart of the Colorado Rockies.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Page() {
  return <SitePage h1="Winter Edition Aspen" html={ASPEN_HTML} />
}
