import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import { PRESS_LOGIN_HTML, PRESS_APP } from '../../site/press'
import '../../site/press.css'

export const metadata: Metadata = {
  title: 'Pressroom | Maison Sanguine',
  description: 'Maison Sanguine pressroom. Access reserved for accredited journalists and media.',
  robots: { index: false, follow: false },
}

const SCRIPTS = [PRESS_APP]

export default function PressLogIn() {
  return <SitePage html={PRESS_LOGIN_HTML} scripts={SCRIPTS} />
}
