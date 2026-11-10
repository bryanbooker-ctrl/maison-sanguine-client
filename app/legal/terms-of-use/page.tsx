import type { Metadata } from 'next'
import LegalPage from '../../site/legal/LegalPage'
import { TERMS_OF_USE } from '../../site/legal/terms-of-use'

export const metadata: Metadata = {
  title: 'Terms of Use | Maison Sanguine',
  description: 'Terms and conditions of use of the Maison Sanguine website.',
}

export default function TermsOfUse() {
  return <LegalPage doc={TERMS_OF_USE} />
}
