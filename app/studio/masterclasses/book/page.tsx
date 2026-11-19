import type { Metadata } from 'next'
import { getLocale, localizeMetadata, trJs } from '@/lib/i18n'
import SiteScripts from '../../../site/SiteScripts'
import { STUDIO_CHROME_APP } from '../../../site/studio'
import BookMasterclass from '../../../masterclasses/book/BookMasterclass'
import '../../../site/site.css'
import '../../../site/studio.css'
import '../../../site/studiobook.css'
import '../../../site/mcbook.css'

const META: Metadata = {
  title: 'Maison Sanguine Studio | Book the Masterclass',
  description: 'Book your place at the Maison Sanguine Studio masterclass and pay online to confirm it immediately.',
  robots: { index: false },
}

export const generateMetadata = () => localizeMetadata(META)

export default async function BookPage() {
  const locale = await getLocale()
  return (
    <>
      <BookMasterclass />
      <SiteScripts extra={[trJs(STUDIO_CHROME_APP, locale)]} />
    </>
  )
}
