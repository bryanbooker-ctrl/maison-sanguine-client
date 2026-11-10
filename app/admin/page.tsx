'use client'

import { useEffect, useState } from 'react'

type Admission = {
  id: string; created_at: string; edition_slug: string; email: string; first_name: string | null; last_name: string | null
  phone: string | null; city: string | null; country: string | null; instagram: string | null; places: number
  companion_name: string | null; activity: string | null; website: string | null; birth_year: number | null
  partner_consent: boolean | null; id_status: string | null; id_note: string | null; status: 'pending' | 'accepted' | 'declined' | 'paid'; invitation_code: string | null
}
type Edition = { slug: string; name: string; edition_date: string | null; price_cents: number | null; currency: string | null; is_open: boolean }
type Filter = 'pending' | 'accepted' | 'paid' | 'declined' | 'all'

const LABEL: Record<Admission['status'], string> = { pending: 'Pending', accepted: 'Awaiting payment', paid: 'Confirmed', declined: 'Declined' }
const FILTERS: [Filter, string][] = [['pending', 'Pending'], ['accepted', 'Awaiting payment'], ['paid', 'Confirmed'], ['declined', 'Declined'], ['all', 'All']]

const ID_LABEL: Record<string, string> = { none: 'Not started', processing: 'In review', verified: 'Verified', failed: 'Not verified' }

const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export default function AdminPage() {
  const [state, setState] = useState<'loading' | 'forbidden' | 'ok'>('loading')
  const [rows, setRows] = useState<Admission[]>([])
  const [eds, setEds] = useState<Record<string, Edition>>({})
  const [filter, setFilter] = useState<Filter>('pending')
  const [edition, setEdition] = useState('')
  const [confirm, setConfirm] = useState<{ id: string; action: 'accept' | 'decline' } | null>(null)
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState('')
  const [why, setWhy] = useState('')

  const load = async () => {
    const res = await fetch('/api/admin/admissions', { cache: 'no-store' })
    if (!res.ok) {
      const e = await res.json().catch(() => ({}))
      setWhy(res.status === 403
        ? (e.email ? `You are signed in as ${e.email}.` : 'You are not signed in.')
        : `Server error: ${e.detail || res.status}`)
      setState('forbidden'); return
    }
    const data = await res.json()
    setRows(data.admissions)
    setEds(Object.fromEntries((data.editions as Edition[]).map(e => [e.slug, e])))
    setState('ok')
  }
  useEffect(() => { load() }, [])

  const act = async (id: string, action: 'accept' | 'decline') => {
    setBusy(id); setMsg('')
    const res = await fetch(`/api/admin/admissions/${id}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(''); setConfirm(null)
    if (!res.ok) { setMsg('This request could not be updated. Please refresh and try again.'); return }
    setMsg(action === 'accept' ? `Accepted. Invitation code ${data.code} sent by email.` : 'Declined. The guest has been informed by email.')
    load()
  }

  if (state === 'loading') return <main className="ms-acc" aria-busy="true" />
  if (state === 'forbidden') return (
    <main className="ms-acc">
      <section className="ms-acc__dark ms-adm">
        <h1 className="ms-acc__title"><span>Access</span><span className="ms-it">restricted</span></h1>
        <p className="ms-acc__desc">This area is reserved for the Maison Sanguine team.</p>
        {why && <p className="ms-acc__desc ms-adm__empty">{why}</p>}
      </section>
    </main>
  )

  const count = (f: Filter) => rows.filter(r => (f === 'all' || r.status === f) && (!edition || r.edition_slug === edition)).length
  const list = rows.filter(r => (filter === 'all' || r.status === filter) && (!edition || r.edition_slug === edition))

  return (
    <main className="ms-acc">
      <section className="ms-acc__dark ms-adm">
        <div className="ms-adm__top">
          <h1 className="ms-acc__title"><span>Guest</span><span className="ms-it">Relations</span></h1>
          <select className="ms-adm__sel" value={edition} onChange={e => setEdition(e.target.value)} aria-label="Night">
            <option value="">All nights</option>
            {Object.values(eds).map(e => <option key={e.slug} value={e.slug}>{e.name}</option>)}
          </select>
        </div>

        <nav className="ms-adm__tabs" role="tablist">
          {FILTERS.map(([f, l]) => (
            <button key={f} role="tab" aria-selected={filter === f} className={`ms-adm__tab${filter === f ? ' is-on' : ''}`} onClick={() => setFilter(f)}>
              {l}<span>{count(f)}</span>
            </button>
          ))}
        </nav>

        {msg && <p className="ms-adm__msg" role="status">{msg}</p>}

        <div className="ms-adm__list">
          {list.length === 0 && <p className="ms-acc__desc ms-adm__empty">No requests here.</p>}
          {list.map(r => {
            const ed = eds[r.edition_slug]
            const asking = confirm?.id === r.id
            return (
              <article key={r.id} className="ms-adm__row">
                <div className="ms-adm__who">
                  <span className="ms-acc__kick">{ed?.name || r.edition_slug} · {fmt(r.created_at)}</span>
                  <span className="ms-adm__name">{r.first_name} {r.last_name}</span>
                  <span className={`ms-acc__tag${r.status === 'paid' ? ' is-on' : ''}`}>{LABEL[r.status]}</span>
                </div>
                <dl className="ms-adm__info">
                  <div><dt>Email</dt><dd><a href={`mailto:${r.email}`}>{r.email}</a></dd></div>
                  <div><dt>Phone</dt><dd>{r.phone || '-'}</dd></div>
                  <div><dt>City</dt><dd>{[r.city, r.country].filter(Boolean).join(', ') || '-'}</dd></div>
                  <div><dt>Activity</dt><dd>{r.activity || '-'}</dd></div>
                  <div><dt>Instagram</dt><dd>{r.instagram ? <a href={`https://instagram.com/${r.instagram}`} target="_blank" rel="noreferrer">@{r.instagram}</a> : '-'}</dd></div>
                  <div><dt>Website</dt><dd>{r.website ? <a href={r.website} target="_blank" rel="noreferrer">{r.website.replace(/^https?:\/\/(www\.)?/, '')}</a> : '-'}</dd></div>
                  <div><dt>Places</dt><dd>{r.places}{r.companion_name ? ` · with ${r.companion_name}` : ''}</dd></div>
                  <div><dt>Born</dt><dd>{r.birth_year || '-'}</dd></div>
                  <div><dt>Partner content</dt><dd>{r.partner_consent ? 'Accepted' : 'Declined'}</dd></div>
                  {r.status !== 'pending' && r.status !== 'declined' && (
                    <div><dt>Identity</dt><dd>{ID_LABEL[r.id_status || 'none'] || 'Not started'}{r.id_note ? ` · ${r.id_note}` : ''}</dd></div>
                  )}
                  {r.invitation_code && <div><dt>Code</dt><dd className="ms-adm__code">{r.invitation_code}</dd></div>}
                </dl>
                {r.status === 'pending' && (
                  <div className="ms-adm__act">
                    {asking ? (
                      <>
                        <span className="ms-adm__ask">{confirm.action === 'accept' ? 'Accept and send the invitation?' : 'Decline and inform the guest?'}</span>
                        <button className="ms-acc__btn" disabled={busy === r.id} onClick={() => act(r.id, confirm.action)}>{busy === r.id ? 'Sending' : 'Confirm'}</button>
                        <button className="ms-acc__btn ms-acc__btn--line" onClick={() => setConfirm(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="ms-acc__btn" onClick={() => setConfirm({ id: r.id, action: 'accept' })}>Accept</button>
                        <button className="ms-acc__btn ms-acc__btn--line" onClick={() => setConfirm({ id: r.id, action: 'decline' })}>Decline</button>
                      </>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
