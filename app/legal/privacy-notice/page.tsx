import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import LegalPage from '../../site/legal/LegalPage'
import { PRIVACY_NOTICE } from '../../site/legal/privacy-notice'

const META: Metadata = {
  title: 'Maison Sanguine | Privacy Notice',
  description: 'How Maison Sanguine collects, uses, stores and protects your personal data.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function PrivacyNotice() {
  return <LegalPage doc={PRIVACY_NOTICE} />
}
