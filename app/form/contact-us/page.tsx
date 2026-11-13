import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { CONTACT_HTML, CONTACT_APP } from '../../site/contact'

const META: Metadata = {
  title: 'Maison Sanguine | Contact Us',
  description: 'Contact the Maison Sanguine Guest Relations team about our nights, admissions and experiences.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [CONTACT_APP]

export default function ContactUs() {
  return <SitePage html={CONTACT_HTML} scripts={SCRIPTS} />
}
