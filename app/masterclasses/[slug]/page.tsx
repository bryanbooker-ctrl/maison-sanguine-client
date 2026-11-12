import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { getLocale, localizeMetadata } from '@/lib/i18n'
import { TRANSLATED } from '@/lib/locales'
import { currencyOf, htmlLang, langOf } from '@/lib/locations'
import SitePage from '../../site/SitePage'
import { MC_ARCHITECTURE_HTML, MC_EXTEND_HTML, MC_MIXOLOGY_HTML, MC_PAGE_APP, MC_RIO_HTML, MC_SCENOGRAPHY_HTML } from '../../site/masterclass-pages'
import '../../site/masterclass.css'

const PAGES: Record<string, { html: string; editions: string[]; h1: string; meta: Metadata }> = {
  'introduction-to-mixology': {
    html: MC_MIXOLOGY_HTML,
    editions: ['mc-introduction-to-mixology-paris'],
    h1: 'Introduction to Mixology',
    meta: {
      title: 'Introduction to Mixology | Maison Sanguine',
      description: 'Discover the gestures of our bartenders through a practical introduction to mixology, and craft a signature serve inspired by the Maison.',
    },
  },
  'the-architecture-of-a-night': {
    html: MC_ARCHITECTURE_HTML,
    editions: ['mc-the-architecture-of-a-night-paris', 'mc-the-architecture-of-a-night-new-york'],
    h1: 'The Architecture of a Night',
    meta: {
      title: 'The Architecture of a Night | Maison Sanguine',
      description: 'Guided by the Creative Division, a practical masterclass revealing how sound, scenography and production come together to shape a night.',
    },
  },
  scenography: {
    html: MC_SCENOGRAPHY_HTML,
    editions: ['mc-scenography-paris'],
    h1: 'Scenography: Shaping the Space',
    meta: {
      title: 'Scenography: Shaping the Space | Maison Sanguine',
      description: 'Explore the art of scenography through a hands-on masterclass revealing how light, volumes and atmosphere turn a space into an unforgettable night.',
    },
  },
  'extend-sound-architecture': {
    html: MC_EXTEND_HTML,
    editions: [],
    h1: 'EXTEND™: Sound Architecture',
    meta: {
      title: 'EXTEND™: Sound Architecture | Maison Sanguine',
      description: 'Discover EXTEND™, the Maison’s sonic architecture, and how music inhabits and moves through each space.',
    },
  },
  'behind-an-edition-rio': {
    html: MC_RIO_HTML,
    editions: [],
    h1: 'Behind an Edition: Rio de Janeiro',
    meta: {
      title: 'Behind an Edition: Rio de Janeiro | Maison Sanguine',
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

type Edition = { slug: string; price_cents: number | null; currency: string | null; prices?: Record<string, number> | null }

async function prices(slugs: string[]): Promise<Record<string, string>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return {}
  try {
    const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data } = await db.from('editions').select('*').in('slug', slugs)
    const locale = await getLocale()
    const jar = await cookies()
    const wanted = currencyOf(locale, jar.get('ms_region')?.value).toLowerCase()
    const lang = langOf(locale)
    const fmtLang = htmlLang(TRANSLATED.includes(lang) ? lang : 'en')
    const out: Record<string, string> = {}
    for (const ed of (data || []) as Edition[]) {
      const local = ed.prices && Number(ed.prices[wanted]) > 0 ? Number(ed.prices[wanted]) : null
      const amount = local ?? ed.price_cents
      const currency = (local ? wanted : ed.currency || 'eur').toUpperCase()
      if (!amount) continue
      const fmt = new Intl.NumberFormat(fmtLang, { style: 'currency', currency, currencyDisplay: 'code' })
      const digits = fmt.resolvedOptions().maximumFractionDigits ?? 2
      out[ed.slug] = fmt.format(amount / 10 ** digits)
    }
    return out
  } catch {
    return {}
  }
}

export default async function Page({ params }: Params) {
  const { slug } = await params
  const p = PAGES[slug]
  if (!p) notFound()
  const price = p.editions.length ? await prices(p.editions) : {}
  const html = p.html + `<script type="application/json" id="mc-prices">${JSON.stringify(price).replace(/</g, '\\u003c')}</script>`
  return <SitePage h1={p.h1} html={html} scripts={[MC_PAGE_APP]} />
}
