'use client'

import { useEffect, useState } from 'react'

type Session = { id: string; date: string; time: string; language: string; languageName: string; left: number }
type Info = { name: string; sessions: Session[]; maxPlaces: number; price: { amount: number; currency: string; label: string } | null }
type Booking = { name: string; date: string; time: string; language: string; places: number; status: string; first_name: string }

const ERRORS: Record<string, string> = {
  missing: 'Please complete all required fields.',
  adult: 'Masterclasses are reserved for participants aged 21 or older.',
  consent: 'Please accept the processing of your information to book your masterclass.',
  full: 'This session no longer has enough places. Please choose another one.',
  price: 'Booking is not yet open for this masterclass.',
  save: 'Your booking could not be completed. Please try again.',
  load: 'Sessions could not be loaded. Please try again.',
}

function longDate(d: string) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(d + 'T12:00:00Z'))
}

function money(amount: number, currency: string) {
  const fmt = new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: currency.toUpperCase(), currencyDisplay: 'code' })
  return fmt.format(amount / 10 ** (fmt.resolvedOptions().maximumFractionDigits ?? 2))
}

const TITLES = ['Introduction to Mixology', 'The Architecture of a Night', 'Scenography: Shaping the Space']
const HOUSES = ['MS House Paris', 'MS House New York']

function split(name: string) {
  return {
    title: TITLES.find(t => name.startsWith(t)) || name.split(', MS House')[0],
    house: HOUSES.find(h => name.endsWith(h)) || '',
  }
}

export default function BookMasterclass() {
  const [edition, setEdition] = useState('')
  const [info, setInfo] = useState<Info | null>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState('')
  const [places, setPlaces] = useState(1)
  const [f, setF] = useState({ first_name: '', last_name: '', email: '', phone: '', companion_name: '' })
  const [adult, setAdult] = useState(false)
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [cancelled, setCancelled] = useState(false)

  const load = async (slug: string) => {
    setLoading(true)
    const r = await fetch(`/api/masterclasses/sessions?edition=${encodeURIComponent(slug)}`, { cache: 'no-store' }).catch(() => null)
    const data = r && r.ok ? await r.json() as Info : null
    setInfo(data)
    if (!data) setError(ERRORS.load)
    setLoading(false)
  }

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('cancelled')) setCancelled(true)
    const id = q.get('confirmed')
    if (id) {
      let tries = 0
      const poll = async () => {
        const r = await fetch(`/api/masterclasses/booking/${encodeURIComponent(id)}`).catch(() => null)
        const b = r && r.ok ? await r.json() as Booking : null
        if (b) { setBooking(b); setLoading(false) }
        if (b && b.status !== 'paid' && ++tries < 6) setTimeout(poll, 2000)
        if (!b) setLoading(false)
      }
      poll()
      return
    }
    const slug = q.get('edition') || ''
    setEdition(slug)
    if (slug) load(slug)
    else setLoading(false)
  }, [])

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF(s => ({ ...s, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!session || !f.first_name || !f.last_name || !f.email || !f.phone || (places === 2 && !f.companion_name.trim())) { setError(ERRORS.missing); return }
    if (!adult) { setError(ERRORS.adult); return }
    if (!consent) { setError(ERRORS.consent); return }
    setSending(true)
    const r = await fetch('/api/masterclasses/book', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ edition, session, places, ...f, companion_name: places === 2 ? f.companion_name : '', adult, consent }),
    }).catch(() => null)
    const data = r ? await r.json().catch(() => ({})) : {}
    if (r && r.ok && data.url) { window.location.href = data.url; return }
    setSending(false)
    setError(ERRORS[data.error] || ERRORS.save)
    if (data.error === 'full') { setSession(''); load(edition) }
  }

  if (booking) {
    const paid = booking.status === 'paid'
    const { title, house } = split(booking.name)
    return (
      <main>
        <section className="ms-sign ms-sign--dark st-bk">
          <h1 className="ms-sign__title">
            <span>{paid ? 'Your masterclass' : 'Payment'}</span>
            <span className="ms-it">{paid ? 'is confirmed' : 'in progress'}</span>
          </h1>
          <div className="ms-sign__intro">
            {paid
              ? 'Your booking is confirmed. A confirmation has been sent to you by email. We recommend arriving ten minutes before the start of your masterclass.'
              : 'Your payment is being confirmed. This page will update in a few moments.'}
          </div>
          <dl className="st-bk__dl">
            <dt>Masterclass</dt><dd>{title}</dd>
            {house && <><dt>MS House</dt><dd>{house.replace('MS House ', '')}</dd></>}
            <dt>Date</dt><dd>{longDate(booking.date)}</dd>
            <dt>Time</dt><dd>{booking.time}</dd>
            <dt>Language</dt><dd>{booking.language}</dd>
            <dt>Places</dt><dd>{booking.places}</dd>
          </dl>
        </section>
      </main>
    )
  }

  const sessions = info?.sessions || []
  const chosen = sessions.find(s => s.id === session)
  const { title, house } = split(info?.name || '')
  const maxPlaces = info?.maxPlaces || 2
  const unit = info?.price
  const total = unit && typeof window !== 'undefined' ? money(unit.amount * places, unit.currency) : ''

  return (
    <main>
      <section className="ms-sign ms-sign--dark st-bk">
        <h1 className="ms-sign__title">
          <span>Book</span>
          <span className="ms-it">{title || 'a masterclass'}</span>
        </h1>
        {house && <div className="st-bk__house">{house}</div>}
        <div className="ms-sign__intro">
          Choose your session, then pay online to confirm your place immediately.
        </div>
        {cancelled && <p className="st-bk__note">Your payment was not completed and your places have been released.</p>}

        {!loading && !info ? (
          <p className="st-bk__empty">{error || ERRORS.load} <a href="/masterclasses">All masterclasses</a></p>
        ) : (
          <form className="ms-sign__form" onSubmit={submit} noValidate>
            <div className="ms-sign__field">
              <label className="ms-sign__label">Session *</label>
              {loading ? (
                <p className="st-bk__empty">Loading</p>
              ) : sessions.length === 0 ? (
                <p className="st-bk__empty">
                  No session is scheduled at the moment. New sessions are announced shortly before each edition. <a href="https://maisonsanguine.com/form/newsletter-subscription">Get the latest news</a>
                </p>
              ) : (
                <div className="mc-bk__list">
                  {sessions.map(s => {
                    const ok = s.left >= places
                    return (
                      <button key={s.id} type="button" className="mc-bk__opt" aria-pressed={session === s.id} disabled={!ok} onClick={() => { setSession(s.id); setError('') }}>
                        <span>
                          <strong>{longDate(s.date)}</strong>
                          <span>{s.time}, {s.languageName}</span>
                        </span>
                        <small>{!ok ? 'Unavailable' : s.left <= 3 ? 'Few places left' : 'Available'}</small>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="m-pl">Number of places *</label>
              <select className="ms-sign__input" id="m-pl" value={places} onChange={e => { setPlaces(Number(e.target.value)); setSession(s => (sessions.find(x => x.id === s && x.left >= Number(e.target.value)) ? s : '')) }}>
                {Array.from({ length: maxPlaces }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="ms-sign__row ms-sign__row--2">
              <div className="ms-sign__field">
                <label className="ms-sign__label" htmlFor="m-fn">First name *</label>
                <input className="ms-sign__input" id="m-fn" autoComplete="given-name" value={f.first_name} onChange={set('first_name')} />
              </div>
              <div className="ms-sign__field">
                <label className="ms-sign__label" htmlFor="m-ln">Last name *</label>
                <input className="ms-sign__input" id="m-ln" autoComplete="family-name" value={f.last_name} onChange={set('last_name')} />
              </div>
            </div>

            <div className="ms-sign__row ms-sign__row--2">
              <div className="ms-sign__field">
                <label className="ms-sign__label" htmlFor="m-em">Email *</label>
                <input className="ms-sign__input" id="m-em" type="email" autoComplete="email" value={f.email} onChange={set('email')} />
              </div>
              <div className="ms-sign__field">
                <label className="ms-sign__label" htmlFor="m-ph">Phone *</label>
                <input className="ms-sign__input" id="m-ph" type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} />
              </div>
            </div>

            {places === 2 && (
              <div className="ms-sign__field">
                <label className="ms-sign__label" htmlFor="m-cn">Full name of the second participant *</label>
                <input className="ms-sign__input" id="m-cn" value={f.companion_name} onChange={set('companion_name')} />
              </div>
            )}

            <label className="ms-sign__check">
              <input type="checkbox" checked={adult} onChange={e => setAdult(e.target.checked)} />
              <span>I confirm that I am 21 years of age or older.</span>
            </label>
            <label className="ms-sign__check">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
              <span>I agree that Maison Sanguine processes my information to manage my booking and contact me about it.</span>
            </label>

            <div className="st-bk__sum">
              <span>{chosen ? <>{longDate(chosen.date)}, {chosen.time}</> : 'Masterclass'}</span>
              <strong>{total}</strong>
            </div>

            {error && <p className="ms-sign__err ms-sign__err--send" role="alert">{error}</p>}
            <button className="ms-sign__btn" type="submit" disabled={sending || loading || !unit}>
              {sending ? 'Redirecting' : 'Continue to payment'}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
