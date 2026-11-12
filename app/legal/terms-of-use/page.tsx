import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import LegalPage from '../../site/legal/LegalPage'
import { TERMS_OF_USE } from '../../site/legal/terms-of-use'

const META: Metadata = {
  title: 'Terms of Use | Maison Sanguine',
  description: 'Terms and conditions of use of the Maison Sanguine website.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function TermsOfUse() {
  return <LegalPage doc={TERMS_OF_USE} />
}
