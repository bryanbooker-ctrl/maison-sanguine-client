import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { ASPEN_EVENT_HTML } from '../../site/aspen-event'

const META: Metadata = {
  title: 'Maison Sanguine | The Winter Edition, Aspen',
  description: 'The Winter Edition, Aspen, Season 2027. Saturday, February 20, 2027.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Page() {
  return <SitePage h1="The Winter Edition, Aspen" html={ASPEN_EVENT_HTML} />
}
