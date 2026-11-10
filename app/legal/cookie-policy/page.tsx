import type { Metadata } from 'next'
import LegalPage from '../../site/legal/LegalPage'
import { COOKIE_POLICY } from '../../site/legal/cookie-policy'

export const metadata: Metadata = {
  title: 'Cookie Policy | Maison Sanguine',
  description: 'How Maison Sanguine uses cookies and similar technologies.',
}

export default function CookiePolicy() {
  return <LegalPage doc={COOKIE_POLICY} />
}
