'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Edition = { slug: string; name: string; edition_date: string | null; is_open: boolean; kind?: string | null }
type Kind = 'night' | 'masterclass'

const ERRORS: Record<string, string> = {
  missing: 'Please complete all required fields.',
  edition: 'Requests for this night are currently closed.',
  duplicate: 'You have already requested an invitation for this night. You can follow it from your MS Account.',
  mc_edition: 'Bookings for this masterclass are currently closed.',
  mc_duplicate: 'You have already booked this masterclass. You can follow your booking from your MS Account.',
  auth: 'Your session has expired. Please log in again.',
  save: 'Your request could not be sent. Please try again.',
  age: 'Admission is reserved for guests aged 21 or older.',
}

const REQUIREMENTS = [
  'Each request is reviewed personally by our selection committee. Admission is not guaranteed.',
  'Invitations are personal and non-transferable.',
]

const EVENT_PAGES = ['aspen-winter-edition', 'new-york-spring-edition', 'rite-of-summer-saint-tropez', 'msnye-2027-rio-de-janeiro']

const MC_PAGES = ['introduction-to-mixology', 'the-architecture-of-a-night', 'scenography']

function eventPage() {
  const slug = typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('edition') || ''
  if (slug.startsWith('mc-')) {
    const page = MC_PAGES.find(p => slug.startsWith(`mc-${p}`))
    return page ? `https://maisonsanguine.com/masterclasses/${page}` : 'https://maisonsanguine.com/masterclasses'
  }
  return EVENT_PAGES.includes(slug) ? `https://maisonsanguine.com/event/${slug}` : 'https://maisonsanguine.com/night-collection'
}

function AgeGate({ onPass, kind }: { onPass: (year: number) => void; kind: Kind }) {
  const [d, setD] = useState(['', '', '', ''])
  const [err, setErr] = useState('')
  const [under, setUnder] = useState(false)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => { refs.current[0]?.focus() }, [])

  const type = (i: number, v: string) => {
    const digits = v.replace(/\D/g, '')
    if (digits.length > 1) {
      const next = [...d]
      digits.slice(0, 4 - i).split('').forEach((c, k) => { next[i + k] = c })
      setD(next); setErr('')
      refs.current[Math.min(i + digits.length, 3)]?.focus()
      return
    }
    const next = [...d]; next[i] = digits; setD(next); setErr('')
    if (digits && i < 3) refs.current[i + 1]?.focus()
  }

  const key = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !d[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const enter = (e: React.FormEvent) => {
    e.preventDefault()
    const year = Number(d.join(''))
    const now = new Date().getFullYear()
    if (d.join('').length !== 4 || year < now - 110 || year > now) { setErr('Please enter your year of birth.'); return }
    if (now - year < 21) { setErr(ERRORS.age); setUnder(true); return }
    try { sessionStorage.setItem('ms_age', String(year)) } catch {}
    onPass(year)
  }

  return (
    <div className="ms-gate" role="dialog" aria-modal="true" aria-labelledby="ms-gate-t">
      <form className="ms-gate__in" onSubmit={enter} noValidate>
        <p className="ms-gate__lead" id="ms-gate-t">
          {kind === 'masterclass'
            ? 'Maison Sanguine masterclasses are reserved for participants aged 21 or older. Please enter your year of birth to continue.'
            : 'Admission to Maison Sanguine nights is reserved for guests aged 21 or older. Please enter your year of birth to continue.'}
        </p>
        <div className="ms-gate__year">
          {d.map((v, i) => (
            <input
              key={i}
              ref={el => { refs.current[i] = el }}
              className="ms-gate__digit"
              inputMode="numeric"
              autoComplete={i === 0 ? 'bday-year' : 'off'}
              aria-label={`Year of birth, digit ${i + 1}`}
              placeholder="Y"
              value={v}
              disabled={under}
              onChange={e => type(i, e.target.value)}
              onKeyDown={e => key(i, e)}
            />
          ))}
        </div>
        <p className="ms-gate__err" role="alert">{err}</p>
        {under
          ? <button className="ms-gate__btn" type="button" onClick={() => { window.location.href = eventPage() }}>Back</button>
          : <button className="ms-gate__btn" type="submit">Enter</button>}
        {!under && <a className="ms-gate__back" href={eventPage()}>Back</a>}
        <ul className="ms-gate__req">
          {REQUIREMENTS.map(r => <li key={r}>{r}</li>)}
        </ul>
      </form>
    </div>
  )
}

export default function RequestPage() {
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [editions, setEditions] = useState<Edition[]>([])
  const [kind, setKind] = useState<Kind>('night')
  const [f, setF] = useState({
    edition: '', first_name: '', last_name: '', email: '', phone: '', city: '', country: '',
    activity: '', instagram: '', website: '', places: '1', companion_name: '',
    partner_consent: false, consent: false,
  })
  const [birthYear, setBirthYear] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const [{ data: p }, { data: eds }] = await Promise.all([
        user ? supabase.from('profiles').select('*').eq('id', user.id).single() : Promise.resolve({ data: null }),
        supabase.from('editions').select('*').eq('is_open', true).order('sort', { ascending: true }),
      ])
      const wanted = new URLSearchParams(window.location.search).get('edition') || ''
      const all = (eds || []) as Edition[]
      const k: Kind = all.find(e => e.slug === wanted)?.kind === 'masterclass' || wanted.startsWith('mc-') ? 'masterclass' : 'night'
      const list = all.filter(e => (e.kind === 'masterclass' ? 'masterclass' : 'night') === k)
      setKind(k)
      setEditions(list)
      setF(s => ({
        ...s,
        edition: list.some(e => e.slug === wanted) ? wanted : '',
        first_name: p?.first_name || user?.user_metadata?.first_name || '',
        last_name: p?.last_name || user?.user_metadata?.last_name || '',
        email: user?.email || '',
        phone: p?.phone || '',
      }))
      try {
        const y = Number(sessionStorage.getItem('ms_age'))
        if (y && new Date().getFullYear() - y >= 21) setBirthYear(y)
      } catch {}
      setReady(true)
    }
    load()
  }, [])

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(s => ({ ...s, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!f.edition || !f.first_name || !f.last_name || !f.phone || !f.city || !f.country || !f.activity || (f.places === '2' && !f.companion_name)) {
      setError(ERRORS.missing); return
    }
    if (!f.consent) { setError('Please accept the processing of your information to send your request.'); return }
    setLoading(true)
    const res = await fetch('/api/admissions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, birth_year: birthYear }),
    })
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    if (res.ok) { setDone(data.edition || ''); window.scrollTo({ top: 0 }) }
    else setError((kind === 'masterclass' && ERRORS['mc_' + data.error]) || ERRORS[data.error] || ERRORS.save)
  }

  const selected = editions.find(e => e.slug === f.edition)
  const mc = kind === 'masterclass'

  if (done) return (
    <main>
      <section className="ms-sign ms-sign--dark">
        <h1 className="ms-sign__title">
          <span>Request</span>
          <span className="ms-it">received</span>
        </h1>
        <div className="ms-sign__intro">
          {mc
            ? <>Thank you for booking {done}. Our team will confirm your booking by email, and you will then be able to complete your payment from your MS Account.</>
            : <>Thank you for your interest in {done}. Our selection committee will review your request and come back to you personally by email. You can follow your request at any time from your MS Account.</>}
        </div>
        <button className="ms-sign__btn" type="button" onClick={() => { window.location.href = '/dashboard?tab=experiences' }}>My MS Account</button>
      </section>
    </main>
  )

  if (!ready) return <main className="ms-acc" aria-busy="true" />

  return (
    <main>
      {!birthYear && <AgeGate onPass={setBirthYear} kind={kind} />}
      <section className={`ms-sign ms-sign--dark${birthYear ? '' : ' is-gated'}`} aria-hidden={!birthYear}>
        {mc ? (
          <h1 className="ms-sign__title">
            <span>Book</span>
            <span className="ms-it">a masterclass</span>
          </h1>
        ) : (
          <h1 className="ms-sign__title">
            <span>Request</span>
            <span className="ms-it">an invitation</span>
          </h1>
        )}
        {mc ? (
          <div className="ms-sign__intro">
            {selected ? <>Your booking for <strong>{selected.name}</strong> will be confirmed by our team. </> : 'Each booking is confirmed by our team. '}
            You will receive our confirmation by email, then complete your payment from your MS Account.
          </div>
        ) : (
          <div className="ms-sign__intro">
            {selected ? <>Your request for <strong>{selected.name}</strong> will be reviewed personally by our selection committee. </> : 'Each request is reviewed personally by our selection committee. '}
            Admission is subject to approval and you will receive our answer by email.
          </div>
        )}

        <form className="ms-sign__form" onSubmit={submit} noValidate>
          <div className="ms-sign__field">
            <label className="ms-sign__label" htmlFor="r-ed">{mc ? 'Masterclass *' : 'Night *'}</label>
            <select className={`ms-sign__input${f.edition ? '' : ' is-empty'}`} id="r-ed" value={f.edition} onChange={set('edition')}>
              <option value="">{mc ? 'Select a masterclass' : 'Select a night'}</option>
              {editions.map(e => <option key={e.slug} value={e.slug}>{e.name}</option>)}
            </select>
          </div>

          <div className="ms-sign__row ms-sign__row--2">
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="r-fn">First name *</label>
              <input className="ms-sign__input" id="r-fn" autoComplete="given-name" value={f.first_name} onChange={set('first_name')} />
            </div>
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="r-ln">Last name *</label>
              <input className="ms-sign__input" id="r-ln" autoComplete="family-name" value={f.last_name} onChange={set('last_name')} />
            </div>
          </div>

          <div className="ms-sign__row ms-sign__row--2">
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="r-em">Email</label>
              <input className="ms-sign__input" id="r-em" type="email" value={f.email} readOnly />
            </div>
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="r-ph">Phone *</label>
              <input className="ms-sign__input" id="r-ph" type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} />
            </div>
          </div>

          <div className="ms-sign__row ms-sign__row--2">
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="r-ci">City *</label>
              <input className="ms-sign__input" id="r-ci" autoComplete="address-level2" value={f.city} onChange={set('city')} />
            </div>
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="r-co">Country *</label>
              <input className="ms-sign__input" id="r-co" autoComplete="country-name" value={f.country} onChange={set('country')} />
            </div>
          </div>

          <div className="ms-sign__field">
            <label className="ms-sign__label" htmlFor="r-ac">Field of activity *</label>
            <input className="ms-sign__input" id="r-ac" autoComplete="organization-title" value={f.activity} onChange={set('activity')} />
          </div>

          <div className="ms-sign__row ms-sign__row--2">
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="r-ig">Instagram</label>
              <input className="ms-sign__input" id="r-ig" placeholder="@" value={f.instagram} onChange={set('instagram')} />
            </div>
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="r-ws">Website or portfolio</label>
              <input className="ms-sign__input" id="r-ws" type="url" inputMode="url" autoComplete="url" value={f.website} onChange={set('website')} />
            </div>
          </div>

          <div className="ms-sign__row ms-sign__row--2">
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="r-pl">Number of places *</label>
              <select className="ms-sign__input" id="r-pl" value={f.places} onChange={set('places')}>
                <option value="1">1 place</option>
                <option value="2">2 places</option>
              </select>
            </div>
            {f.places === '2' && (
              <div className="ms-sign__field">
                <label className="ms-sign__label" htmlFor="r-cp">Companion full name *</label>
                <input className="ms-sign__input" id="r-cp" value={f.companion_name} onChange={set('companion_name')} />
              </div>
            )}
          </div>

          <label className="ms-sign__check">
            <input type="checkbox" checked={f.partner_consent} onChange={set('partner_consent')} />
            <span>{mc
              ? 'I agree that the photos and videos taken during the masterclass, in which I may appear, can be used by Maison Sanguine and its partners.'
              : 'I agree that the photos and videos taken during the night, in which I may appear, can be used by Maison Sanguine and its partners.'}</span>
          </label>

          <label className="ms-sign__check">
            <input type="checkbox" checked={f.consent} onChange={set('consent')} />
            <span>{mc
              ? 'I agree that Maison Sanguine processes my information to manage my booking and contact me about it.'
              : 'I agree that Maison Sanguine processes my information to review my request and contact me about it.'}</span>
          </label>

          {error && <p className="ms-sign__err ms-sign__err--send" role="alert">{error}</p>}
          <button className="ms-sign__btn" type="submit" disabled={loading}>
            {loading ? 'Sending' : mc ? 'Send my booking' : 'Send my request'}
          </button>
        </form>
      </section>
    </main>
  )
}
