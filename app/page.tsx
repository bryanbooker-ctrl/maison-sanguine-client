import type { Metadata } from 'next'
import SitePage from './site/SitePage'
import { HOME_HTML } from './site/home'

export const metadata: Metadata = {
  title: 'Maison Sanguine',
  description: 'Maison Sanguine, the art of celebration.',
}

export default function Home() {
  return <SitePage html={HOME_HTML} />
}
