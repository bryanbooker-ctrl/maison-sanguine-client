import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { INITIATIVE_HTML } from '../../site/initiative'
import '../../site/initiative.css'

const META: Metadata = {
  title: 'Maison Sanguine | Initiative',
  description: 'Initiative Maison Sanguine brings the philosophy of the Maison into concrete action, in support of artistic and cultural initiatives.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Page() {
  return <SitePage html={INITIATIVE_HTML} />
}
