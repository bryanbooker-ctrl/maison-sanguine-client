import { Fragment, type ReactNode } from 'react'
import './legal.css'
import { getLocale, localizeHref, trData, type Locale } from '@/lib/i18n'

export type LegalBlock = string | { list: string[] } | { sub: string }
export type LegalDoc = { title: string; sections: { title?: string; blocks: LegalBlock[] }[] }

function inline(text: string, locale: Locale): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    return m ? <a key={i} href={localizeHref(m[2], locale)}>{m[1]}</a> : <Fragment key={i}>{part}</Fragment>
  })
}

export default async function LegalPage({ doc: source }: { doc: LegalDoc }) {
  const locale = await getLocale()
  const doc = trData(source, locale)
  return (
    <>
      <main className="ms-legal">
        <article className="ms-legal__in">
          <h1 className="ms-legal__title">{doc.title}</h1>
          {doc.sections.map((s, k) => (
            <section className="ms-legal__sec" key={k}>
              {s.title && <h2 className="ms-legal__h">{s.title}</h2>}
              {s.blocks.map((b, i) => typeof b === 'string'
                ? <p className="ms-legal__p" key={i}>{inline(b, locale)}</p>
                : 'sub' in b
                  ? <h3 className="ms-legal__sub" key={i}>{b.sub}</h3>
                  : <ul className="ms-legal__list" key={i}>{b.list.map((li, j) => <li key={j}>{inline(li, locale)}</li>)}</ul>
              )}
            </section>
          ))}
        </article>
      </main>
    </>
  )
}
