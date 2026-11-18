import type { Metadata } from 'next'
import { getLocale, localizeMetadata, trJs } from '@/lib/i18n'
import SiteScripts from '../../site/SiteScripts'
import { STUDIO_CHROME_APP } from '../../site/studio'
import BookTour from './BookTour'
import '../../site/site.css'
import '../../site/studio.css'
import '../../site/studiobook.css'

const META: Metadata = {
  title: 'Maison Sanguine Studio | Book a Guided Tour',
  description: 'Book your guided tour of the Maison Sanguine Studio in Paris, from Tuesday to Saturday.',
}

export const generateMetadata = () => localizeMetadata(META)

export default async function BookPage() {
  const locale = await getLocale()
  return (
    <>
      <BookTour />
      <SiteScripts extra={[trJs(STUDIO_CHROME_APP, locale)]} />
    </>
  )
}
