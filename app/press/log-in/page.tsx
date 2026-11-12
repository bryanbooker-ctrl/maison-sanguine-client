import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { PRESS_LOGIN_HTML, PRESS_APP } from '../../site/press'
import '../../site/press.css'

const META: Metadata = {
  title: 'Pressroom | Maison Sanguine',
  description: 'Maison Sanguine pressroom. Access reserved for accredited journalists and media.',
  robots: { index: false, follow: false },
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [PRESS_APP]

export default function PressLogIn() {
  return <SitePage html={PRESS_LOGIN_HTML} scripts={SCRIPTS} />
}
