import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import { ASPEN_EVENT_HTML } from '../../site/aspen-event'

export const metadata: Metadata = {
  title: 'The Winter Edition, Aspen | Maison Sanguine',
  description: 'The Winter Edition, Aspen, Season 2027. Saturday, February 20, 2027.',
}

export default function Page() {
  return <SitePage h1="The Winter Edition, Aspen" html={ASPEN_EVENT_HTML} />
}
