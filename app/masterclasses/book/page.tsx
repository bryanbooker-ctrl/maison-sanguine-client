import type { Metadata } from 'next'
import { localizeMetadata } from '@/lib/i18n'
import SiteScripts from '../../site/SiteScripts'
import BookMasterclass from './BookMasterclass'
import '../../site/site.css'
import '../../site/studiobook.css'
import '../../site/mcbook.css'

const META: Metadata = {
  title: 'Maison Sanguine | Book a Masterclass',
  description: 'Book your place at a Maison Sanguine masterclass and pay online to confirm it immediately.',
}

export const generateMetadata = () => localizeMetadata(META)

export default function BookPage() {
  return (
    <>
      <BookMasterclass />
      <SiteScripts />
    </>
  )
}
