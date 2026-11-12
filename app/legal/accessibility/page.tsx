import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import LegalPage from '../../site/legal/LegalPage'
import { ACCESSIBILITY } from '../../site/legal/accessibility'

const META: Metadata = {
  title: 'Maison Sanguine | Accessibility',
  description: 'Maison Sanguine accessibility commitment.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function Accessibility() {
  return <LegalPage doc={ACCESSIBILITY} />
}
