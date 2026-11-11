import type { Metadata } from 'next'
import SitePage from '../site/SitePage'
import { MASTERCLASSES_HTML, MC_APP } from '../site/masterclasses'
import '../site/masterclasses.css'

export const metadata: Metadata = {
  title: 'Haute Nuit Experiences | Maison Sanguine',
  description: 'Immerse yourself in the world of Maison Sanguine with a series of masterclasses.',
}

const SCRIPTS = [MC_APP]

export default function Page() {
  return <SitePage h1="Haute Nuit Experiences" html={MASTERCLASSES_HTML} scripts={SCRIPTS} />
}
