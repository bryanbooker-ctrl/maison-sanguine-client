import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { PRESS_REGISTER_HTML, PRESS_APP } from '../../site/press'
import '../../site/press.css'

const META: Metadata = {
  title: 'Maison Sanguine | Pressroom Registration',
  description: 'Request access to the Maison Sanguine pressroom.',
  robots: { index: false, follow: false },
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [PRESS_APP]

export default function PressRegister() {
  return <SitePage html={PRESS_REGISTER_HTML} scripts={SCRIPTS} />
}
