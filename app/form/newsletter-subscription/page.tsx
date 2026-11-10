import type { Metadata } from 'next'
import SitePage from '../../site/SitePage'
import LightHeader from '../../site/LightHeader'
import { SUBSCRIPTION_HTML, SUBSCRIPTION_APP } from '../../site/subscription'

export const metadata: Metadata = {
  title: 'Newsletter | Maison Sanguine',
  description: 'Be the first to receive the latest news on Maison Sanguine nights and upcoming events.',
}

const SCRIPTS = [SUBSCRIPTION_APP]

export default function NewsletterSubscription() {
  return (
    <>
      <LightHeader />
      <SitePage html={SUBSCRIPTION_HTML} scripts={SCRIPTS} />
    </>
  )
}
