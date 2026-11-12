import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../site/SitePage'
import { MASTERCLASSES_HTML, MC_APP } from '../site/masterclasses'
import '../site/masterclasses.css'

const META: Metadata = {
  title: 'Maison Sanguine | Haute Nuit Experiences',
  description: 'Immerse yourself in the world of Maison Sanguine with a series of masterclasses.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [MC_APP]

export default function Page() {
  return <SitePage h1="Haute Nuit Experiences" html={MASTERCLASSES_HTML} scripts={SCRIPTS} />
}
