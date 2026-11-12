import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { GTS_HTML } from '../../site/legal/general-terms'
import '../../site/legal/gts.css'

const META: Metadata = {
  title: 'General Terms and Conditions of Sale | Maison Sanguine',
  description: 'General Terms and Conditions of Sale for Maison Sanguine nights, masterclasses and MS Houses.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function GeneralTermsOfSale() {
  return <SitePage h1="General Terms and Conditions of Sale" html={GTS_HTML} />
}
