import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { localizeMetadata } from '@/lib/i18n'
import { editionPrices } from '@/lib/mc-prices'
import SitePage from '../../site/SitePage'
import { MC_ARCHITECTURE_HTML, MC_EXTEND_HTML, MC_MIXOLOGY_HTML, MC_PAGE_APP, MC_RIO_HTML, MC_SCENOGRAPHY_HTML } from '../../site/masterclass-pages'
import '../../site/masterclass.css'

const PAGES: Record<string, { html: string; editions: string[]; h1: string; meta: Metadata }> = {
  'introduction-to-mixology': {
    html: MC_MIXOLOGY_HTML,
    editions: ['mc-introduction-to-mixology-paris'],
    h1: 'Introduction to Mixology',
    meta: {
      title: 'Maison Sanguine | Introduction to Mixology',
      description: 'Discover the gestures of our bartenders through a practical introduction to mixology, and craft a signature serve inspired by the Maison.',
    },
  },
  'the-architecture-of-a-night': {
    html: MC_ARCHITECTURE_HTML,
    editions: ['mc-the-architecture-of-a-night-paris', 'mc-the-architecture-of-a-night-new-york'],
    h1: 'The Architecture of a Night',
    meta: {
      title: 'Maison Sanguine | The Architecture of a Night',
      description: 'Guided by the Creative Division, a practical masterclass revealing how sound, scenography and production come together to shape a night.',
    },
  },
  scenography: {
    html: MC_SCENOGRAPHY_HTML,
    editions: ['mc-scenography-paris'],
    h1: 'Scenography: Shaping the Space',
    meta: {
      title: 'Maison Sanguine | Scenography: Shaping the Space',
      description: 'Explore the art of scenography through a hands-on masterclass revealing how light, volumes and atmosphere turn a space into an unforgettable night.',
    },
  },
  'extend-sound-architecture': {
    html: MC_EXTEND_HTML,
    editions: [],
    h1: 'EXTEND™: Sound Architecture',
    meta: {
      title: 'Maison Sanguine | EXTEND™: Sound Architecture',
      description: 'Discover EXTEND™, the Maison’s sonic architecture, and how music inhabits and moves through each space.',
    },
  },
  'behind-an-edition-rio': {
    html: MC_RIO_HTML,
    editions: [],
    h1: 'Behind an Edition: Rio de Janeiro',
    meta: {
      title: 'Maison Sanguine | Behind an Edition: Rio de Janeiro',
      description: 'Step behind the scenes of MSNYE 2027 and follow the creation of an edition, from the first idea to the night itself.',
    },
  },
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const p = PAGES[slug]
  return localizeMetadata(p ? p.meta : {})
}

export default async function Page({ params }: Params) {
  const { slug } = await params
  const p = PAGES[slug]
  if (!p) notFound()
  const price = p.editions.length ? await editionPrices(p.editions) : {}
  const html = p.html + `<script type="application/json" id="mc-prices">${JSON.stringify(price).replace(/</g, '\\u003c')}</script>`
  return <SitePage h1={p.h1} html={html} scripts={[MC_PAGE_APP]} />
}
