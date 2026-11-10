import type { Metadata } from 'next'
import LegalPage from '../../site/legal/LegalPage'
import { PRIVACY_NOTICE } from '../../site/legal/privacy-notice'

export const metadata: Metadata = {
  title: 'Privacy Notice | Maison Sanguine',
  description: 'How Maison Sanguine collects, uses, stores and protects your personal data.',
}

export default function PrivacyNotice() {
  return <LegalPage doc={PRIVACY_NOTICE} />
}
