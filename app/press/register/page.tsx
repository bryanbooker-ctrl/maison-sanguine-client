import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import { PRESS_REGISTER_HTML, PRESS_APP } from '../../site/press'
import '../../site/press.css'

export const metadata: Metadata = {
  title: 'Register | Pressroom | Maison Sanguine',
  description: 'Request access to the Maison Sanguine pressroom.',
  robots: { index: false, follow: false },
}

const SCRIPTS = [PRESS_APP]

export default function PressRegister() {
  return <SitePage html={PRESS_REGISTER_HTML} scripts={SCRIPTS} />
}
