import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SitePage from '../../site/SitePage'
import { SUBSCRIPTION_HTML, SUBSCRIPTION_APP } from '../../site/subscription'

const META: Metadata = {
  title: 'Maison Sanguine | Get the Latest News',
  description: 'Be the first to receive the latest news on Maison Sanguine nights and upcoming events.',
}

export const generateMetadata = () => localizeMetadata(META)

const SCRIPTS = [SUBSCRIPTION_APP]

export default function NewsletterSubscription() {
  return <SitePage html={SUBSCRIPTION_HTML} scripts={SCRIPTS} />
}
