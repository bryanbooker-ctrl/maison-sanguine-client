'use client'

import { useEffect, useState } from 'react'

type App = {
  id: string; created_at: string; job_title: string; email: string; first_name: string | null; last_name: string | null
  phone: string | null; city: string | null; locale: string | null; status: string
  answers: Record<string, unknown>; links: Record<string, string>; message: string | null
  files: { name: string; size: number; kind: string }[]
}

const STATUS: [string, string][] = [['new', 'New'], ['review', 'Under review'], ['interview', 'Interview'], ['offer', 'Offer submitted'], ['declined', 'Declined'], ['withdrawn', 'Withdrawn']]
const NOTIFY = ['review', 'interview', 'offer', 'declined']
const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export default function AdminApplications() {
  const [state, setState] = useState<'loading' | 'forbidden' | 'ok'>('loading')
  const [rows, setRows] = useState<App[]>([])
  const [filter, setFilter] = useState('all')
  const [pick, setPick] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState('')
  const [why, setWhy] = useState('')

  const load = async () => {
    const res = await fetch('/api/admin/applications', { cache: 'no-store' })
    if (!res.ok) {
      const e = await res.json().catch(() => ({}))
      setWhy(res.status === 403 ? (e.email ? `You are signed in as ${e.email}.` : 'You are not signed in.') : `Server error: ${e.detail || res.status}`)
      setState('forbidden'); return
    }
    setRows((await res.json()).applications)
    setState('ok')
  }
  useEffect(() => { load() }, [])

  const save = async (a: App) => {
    const status = pick[a.id] || a.status
    setBusy(a.id); setMsg('')
    const res = await fetch(`/api/admin/applications/${a.id}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notify: NOTIFY.includes(status) }),
    })
    const data = await res.json().catch(() => ({}))
    setBusy('')
    if (!res.ok) { setMsg('This application could not be updated. Please refresh and try again.'); return }
    setMsg(data.notified ? 'Status updated. The candidate has been informed by email.' : 'Status updated.')
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

  const count = (f: string) => rows.filter(r => f === 'all' || r.status === f).length
  const list = rows.filter(r => filter === 'all' || r.status === filter)

  return (
    <main className="ms-acc">
      <section className="ms-acc__dark ms-adm">
        <div className="ms-adm__top">
          <h1 className="ms-acc__title"><span>Job</span><span className="ms-it">Applications</span></h1>
        </div>
        <nav className="ms-adm__tabs" role="tablist">
          {[['all', 'All'] as [string, string], ...STATUS].map(([f, l]) => (
            <button key={f} role="tab" aria-selected={filter === f} className={`ms-adm__tab${filter === f ? ' is-on' : ''}`} onClick={() => setFilter(f)}>
              {l}<span>{count(f)}</span>
            </button>
          ))}
        </nav>
        {msg && <p className="ms-adm__msg" role="status">{msg}</p>}
        <div className="ms-adm__list">
          {list.length === 0 && <p className="ms-acc__desc ms-adm__empty">No applications here.</p>}
          {list.map(a => {
            const cur = pick[a.id] || a.status
            return (
              <article key={a.id} className="ms-adm__row">
                <div className="ms-adm__who">
                  <span className="ms-acc__kick">{a.job_title} · {fmt(a.created_at)}</span>
                  <span className="ms-adm__name">{a.first_name} {a.last_name}</span>
                  <span className="ms-acc__tag">{STATUS.find(s => s[0] === a.status)?.[1] || a.status}</span>
                </div>
                <dl className="ms-adm__info">
                  <div><dt>Email</dt><dd><a href={`mailto:${a.email}`}>{a.email}</a></dd></div>
                  <div><dt>Phone</dt><dd>{a.phone || '-'}</dd></div>
                  <div><dt>City</dt><dd>{a.city || '-'}</dd></div>
                  <div><dt>Language</dt><dd>{a.locale === 'fr' ? 'French' : 'English'}</dd></div>
                  {Object.entries(a.links || {}).filter(([, v]) => v).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                  {Object.entries(a.answers || {}).filter(([k, v]) => v && k !== 'langs').map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>)}
                  <div><dt>Files</dt><dd>{(a.files || []).map(f => f.name).join(', ') || '-'}</dd></div>
                  {a.message && <div><dt>Message</dt><dd>{a.message}</dd></div>}
                </dl>
                <div className="ms-adm__act">
                  <select className="ms-adm__sel" value={cur} onChange={e => setPick({ ...pick, [a.id]: e.target.value })} aria-label="Status">
                    {STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <button className="ms-acc__btn" disabled={busy === a.id || cur === a.status} onClick={() => save(a)}>{busy === a.id ? 'Saving' : NOTIFY.includes(cur) ? 'Save and notify' : 'Save'}</button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
