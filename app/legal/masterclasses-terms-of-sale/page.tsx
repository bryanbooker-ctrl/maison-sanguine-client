import type { Metadata } from 'next'
import LegalPage from '../../site/legal/LegalPage'
import { MASTERCLASSES_TERMS } from '../../site/legal/masterclasses-terms'

export const metadata: Metadata = {
  title: 'Masterclasses Terms of Sale | Maison Sanguine',
  description: 'Terms of sale for Maison Sanguine in-person masterclasses.',
}

export default function MasterclassesTermsOfSale() {
  return <LegalPage doc={MASTERCLASSES_TERMS} />
}
