import { Fragment, type ReactNode } from 'react'
import LightHeader from '../LightHeader'
import './legal.css'

export type LegalBlock = string | { list: string[] }
export type LegalDoc = { title: string; sections: { title: string; blocks: LegalBlock[] }[] }

function inline(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    return m ? <a key={i} href={m[2]}>{m[1]}</a> : <Fragment key={i}>{part}</Fragment>
  })
}

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <LightHeader />
      <main className="ms-legal">
        <article className="ms-legal__in">
          <h1 className="ms-legal__title">{doc.title}</h1>
          {doc.sections.map(s => (
            <section className="ms-legal__sec" key={s.title}>
              <h2 className="ms-legal__h">{s.title}</h2>
              {s.blocks.map((b, i) => typeof b === 'string'
                ? <p className="ms-legal__p" key={i}>{inline(b)}</p>
                : <ul className="ms-legal__list" key={i}>{b.list.map((li, j) => <li key={j}>{inline(li)}</li>)}</ul>
              )}
            </section>
          ))}
        </article>
      </main>
    </>
  )
}
