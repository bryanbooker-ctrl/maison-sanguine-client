import type { Metadata } from 'next'
import LegalPage from '../../site/legal/LegalPage'
import { ACCESSIBILITY } from '../../site/legal/accessibility'

export const metadata: Metadata = {
  title: 'Accessibility Statement | Maison Sanguine',
  description: 'Maison Sanguine accessibility commitment.',
}

export default function Accessibility() {
  return <LegalPage doc={ACCESSIBILITY} />
}
