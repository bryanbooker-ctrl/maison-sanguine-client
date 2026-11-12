import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import LegalPage from '../../site/legal/LegalPage'
import { COOKIE_POLICY } from '../../site/legal/cookie-policy'

const META: Metadata = {
  title: 'Maison Sanguine | Cookie Policy',
  description: 'How Maison Sanguine uses cookies and similar technologies.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function CookiePolicy() {
  return <LegalPage doc={COOKIE_POLICY} />
}
