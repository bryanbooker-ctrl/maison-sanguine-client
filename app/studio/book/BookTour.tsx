'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type SlotState = { left: number; lang: string | null }
type Days = Record<string, Record<string, SlotState>>
type Booking = { date: string; slot: string; language: string; places: number; status: string; first_name: string }

const CAPACITY = 8
const PRICE = 45
const SLOTS = ['11:00', '14:00', '16:00']
const HORIZON = 120
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const LANGS = [{ v: 'en', l: 'English' }, { v: 'fr', l: 'French' }]
const ERRORS: Record<string, string> = {
  missing: 'Please complete all required fields.',
  consent: 'Please accept the processing of your information to book your visit.',
  full: 'This time slot is no longer available. Please choose another one.',
  save: 'Your booking could not be completed. Please try again.',
  load: 'Availability could not be loaded. Please try again.',
}

function parisToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date())
}

function shiftMonth(m: string, n: number) {
  const d = new Date(m + '-01T12:00:00Z')
  d.setUTCMonth(d.getUTCMonth() + n)
  return d.toISOString().slice(0, 7)
}

function longDate(d: string) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(d + 'T12:00:00Z'))
}

function eur(n: number) {
  return `€${n}`
}

export default function BookTour() {
  const today = useMemo(parisToday, [])
  const first = today.slice(0, 7)
  const last = useMemo(() => {
    const d = new Date(today + 'T12:00:00Z')
    d.setUTCDate(d.getUTCDate() + HORIZON)
    return d.toISOString().slice(0, 7)
  }, [today])

  const [month, setMonth] = useState(first)
  const [days, setDays] = useState<Days>({})
  const [loadingDays, setLoadingDays] = useState(true)
  const [lang, setLang] = useState('en')
  const [places, setPlaces] = useState(1)
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('')
  const [f, setF] = useState({ first_name: '', last_name: '', email: '', phone: '' })
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('cancelled')) setCancelled(true)
    const id = q.get('confirmed')
    if (!id) return
    let tries = 0
    const load = async () => {
      const r = await fetch(`/api/studio/booking/${encodeURIComponent(id)}`).catch(() => null)
      const b = r && r.ok ? await r.json() as Booking : null
      if (b) setBooking(b)
      if (b && b.status !== 'paid' && ++tries < 6) setTimeout(load, 2000)
    }
    load()
  }, [])

  const loadMonth = useCallback(async (m: string) => {
    setLoadingDays(true)
    const r = await fetch(`/api/studio/availability?month=${m}`, { cache: 'no-store' }).catch(() => null)
    const data = r && r.ok ? await r.json() : null
    setDays(data?.days || {})
    if (!data) setError(ERRORS.load)
    setLoadingDays(false)
  }, [])

  useEffect(() => { loadMonth(month) }, [month, loadMonth])

  const fits = useCallback((s?: SlotState) => !!s && s.left >= places && (!s.lang || s.lang === lang), [places, lang])
  const dayOpen = useCallback((d: string) => SLOTS.some(s => fits(days[d]?.[s])), [days, fits])

  useEffect(() => {
    if (date && !dayOpen(date)) { setDate(''); setSlot('') }
    else if (date && slot && !fits(days[date]?.[slot])) setSlot('')
  }, [date, slot, days, dayOpen, fits])

  const cells = useMemo(() => {
    const start = new Date(month + '-01T12:00:00Z')
    const lead = (start.getUTCDay() + 6) % 7
    const count = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate()
    const out: (string | null)[] = Array(lead).fill(null)
    for (let i = 1; i <= count; i++) out.push(`${month}-${String(i).padStart(2, '0')}`)
    return out
  }, [month])

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF(s => ({ ...s, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!date || !slot || !f.first_name || !f.last_name || !f.email || !f.phone) { setError(ERRORS.missing); return }
    if (!consent) { setError(ERRORS.consent); return }
    setSending(true)
    const r = await fetch('/api/studio/book', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, slot, language: lang, places, ...f, consent }),
    }).catch(() => null)
    const data = r ? await r.json().catch(() => ({})) : {}
    if (r && r.ok && data.url) { window.location.href = data.url; return }
    setSending(false)
    setError(ERRORS[data.error] || ERRORS.save)
    if (data.error === 'full') { setSlot(''); loadMonth(month) }
  }

  if (booking) {
    const paid = booking.status === 'paid'
    return (
      <main>
        <section className="ms-sign ms-sign--dark st-bk">
          <h1 className="ms-sign__title">
            <span>{paid ? 'Your visit' : 'Payment'}</span>
            <span className="ms-it">{paid ? 'is confirmed' : 'in progress'}</span>
          </h1>
          <div className="ms-sign__intro">
            {paid
              ? 'Your guided tour of the Maison Sanguine Studio is confirmed. A confirmation has been sent to you by email. We recommend arriving ten minutes before the start of your tour.'
              : 'Your payment is being confirmed. This page will update in a few moments.'}
          </div>
          <dl className="st-bk__dl">
            <dt>Date</dt><dd>{longDate(booking.date)}</dd>
            <dt>Time</dt><dd>{booking.slot}</dd>
            <dt>Language</dt><dd>{booking.language}</dd>
            <dt>Guests</dt><dd>{booking.places}</dd>
          </dl>
        </section>
      </main>
    )
  }

  const monthIdx = Number(month.slice(5, 7)) - 1
  const slots = date ? days[date] || {} : {}

  return (
    <main>
      <section className="ms-sign ms-sign--dark st-bk">
        <h1 className="ms-sign__title">
          <span>Book</span>
          <span className="ms-it">a guided tour</span>
        </h1>
        <div className="ms-sign__intro">
          Guided tours of the Maison Sanguine Studio take place from Tuesday to Saturday and last approximately 120 minutes, in groups of up to eight guests.
        </div>
        {cancelled && <p className="st-bk__note">Your payment was not completed and your time slot has been released.</p>}

        <form className="ms-sign__form" onSubmit={submit} noValidate>
          <div className="ms-sign__row ms-sign__row--2">
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="t-lg">Language of the tour *</label>
              <select className="ms-sign__input" id="t-lg" value={lang} onChange={e => setLang(e.target.value)}>
                {LANGS.map(l => <option key={l.v} value={l.v}>{l.l}</option>)}
              </select>
            </div>
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="t-pl">Number of guests *</label>
              <select className="ms-sign__input" id="t-pl" value={places} onChange={e => setPlaces(Number(e.target.value))}>
                {Array.from({ length: CAPACITY }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="ms-sign__field">
            <label className="ms-sign__label">Date *</label>
            <div className="st-bk__cal" aria-busy={loadingDays}>
              <div className="st-bk__head">
                <button type="button" className="st-bk__nav" aria-label="Previous month" disabled={month <= first} onClick={() => setMonth(shiftMonth(month, -1))}>
                  <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M9 1.5 3.5 7 9 12.5" /></svg>
                </button>
                <span className="st-bk__month"><span>{MONTHS[monthIdx]}</span> {month.slice(0, 4)}</span>
                <button type="button" className="st-bk__nav" aria-label="Next month" disabled={month >= last} onClick={() => setMonth(shiftMonth(month, 1))}>
                  <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 1.5 10.5 7 5 12.5" /></svg>
                </button>
              </div>
              <div className="st-bk__grid">
                {WEEK.map(w => <span key={w} className="st-bk__wd">{w}</span>)}
                {cells.map((d, i) => d ? (
                  <button
                    key={d}
                    type="button"
                    className="st-bk__day"
                    aria-pressed={date === d}
                    disabled={loadingDays || !dayOpen(d)}
                    onClick={() => { setDate(d); setSlot(''); setError('') }}
                  >{Number(d.slice(8))}</button>
                ) : <span key={`e${i}`} />)}
              </div>
            </div>
          </div>

          {date && (
            <div className="ms-sign__field">
              <label className="ms-sign__label">Time *</label>
              <div className="st-bk__slots">
                {SLOTS.map(s => {
                  const st = slots[s]
                  const ok = fits(st)
                  return (
                    <button key={s} type="button" className="st-bk__slot" aria-pressed={slot === s} disabled={!ok} onClick={() => { setSlot(s); setError('') }}>
                      <span>{s}</span>
                      <small>{!ok ? 'Unavailable' : st.left <= 3 ? 'Few places left' : 'Available'}</small>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="ms-sign__row ms-sign__row--2">
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="t-fn">First name *</label>
              <input className="ms-sign__input" id="t-fn" autoComplete="given-name" value={f.first_name} onChange={set('first_name')} />
            </div>
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="t-ln">Last name *</label>
              <input className="ms-sign__input" id="t-ln" autoComplete="family-name" value={f.last_name} onChange={set('last_name')} />
            </div>
          </div>

          <div className="ms-sign__row ms-sign__row--2">
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="t-em">Email *</label>
              <input className="ms-sign__input" id="t-em" type="email" autoComplete="email" value={f.email} onChange={set('email')} />
            </div>
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="t-ph">Phone *</label>
              <input className="ms-sign__input" id="t-ph" type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} />
            </div>
          </div>

          <label className="ms-sign__check">
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
            <span>I agree that Maison Sanguine processes my information to manage my booking and contact me about it.</span>
          </label>

          <div className="st-bk__sum">
            <span>{date && slot ? <>{longDate(date)}, {slot}</> : 'Guided tour'}</span>
            <strong>{eur(PRICE * places)}</strong>
          </div>

          {error && <p className="ms-sign__err ms-sign__err--send" role="alert">{error}</p>}
          <button className="ms-sign__btn" type="submit" disabled={sending}>
            {sending ? 'Redirecting' : 'Continue to payment'}
          </button>
        </form>
      </section>
    </main>
  )
}
