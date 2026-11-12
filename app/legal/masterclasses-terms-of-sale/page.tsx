import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import LegalPage from '../../site/legal/LegalPage'
import { MASTERCLASSES_TERMS } from '../../site/legal/masterclasses-terms'

const META: Metadata = {
  title: 'Maison Sanguine | Masterclasses Terms of Sale',
  description: 'Terms of sale for Maison Sanguine in-person masterclasses.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function MasterclassesTermsOfSale() {
  return <LegalPage doc={MASTERCLASSES_TERMS} />
}
