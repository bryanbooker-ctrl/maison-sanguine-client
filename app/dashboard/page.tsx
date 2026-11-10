'use client'

import { useCallback, useEffect, useState } from 'react'
import YoureIn, { type Confirmed } from './YoureIn'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const SITE = 'https://maisonsanguine.com'
const LINKS = {
  season: `${SITE}/night-collection`,
  contact: `${SITE}/contact`,
  locations: `${SITE}/locations`,
  addInvitation: '/dashboard/invitation',
  masterclasses: `${SITE}/masterclasses`,
}

const IMG = {
  request: '',
  masterclasses: '',
  keepers: '',
  locations: '',
}

type Tab = 'myms' | 'experiences' | 'wishlist'

type Profile = { first_name?: string | null; last_name?: string | null }
type Reservation = { id: string; experience_name: string; experience_date: string | null; guests: number | null; status: string | null; admission_id?: string | null }
type Request = { id: string; edition_slug: string; status: string; name: string; date: string | null }

const TABS: { key: Tab; label: string }[] = [
  { key: 'myms', label: 'My MS' },
  { key: 'experiences', label: 'My Experiences' },
  { key: 'wishlist', label: 'My Wishlist' },
]

const SERVICES = [
  {
    title: ['Special', 'Request'],
    text: 'Our Guest Relations team tailors your experience to your preferences, with personal attention and absolute discretion.',
    cta: 'Make a request',
    href: LINKS.contact,
    img: IMG.request,
  },
  {
    title: ['Haute Nuit', 'Experiences'],
    text: 'Discover the savoir-faire of the Maison through masterclasses led by its Creative Division, and experience the art of the night from the inside.',
    cta: 'Book a Masterclass',
    href: LINKS.masterclasses,
    img: IMG.masterclasses,
  },
  {
    title: ['The Night', 'Keepers'],
    text: 'A forthcoming service dedicated to authenticated Maison Sanguine nights, giving access to available spots and club reservations.',
    cta: 'Coming soon',
    href: '',
    img: IMG.keepers,
  },
]

function Media({ src }: { src: string }) {
  return (
    <div className="ms-acc__media">
      {src ? <img src={src} alt="" loading="lazy" /> : null}
    </div>
  )
}

function Line({ href, children }: { href: string; children: React.ReactNode }) {
  if (!href) return <span className="ms-acc__link is-off"><i />{children}</span>
  return <a className="ms-acc__link" href={href}><i />{children}</a>
}

function formatDate(d: string | null) {
  if (!d) return 'Date to be announced'
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [flash, setFlash] = useState('')
  const [welcome, setWelcome] = useState<Confirmed | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('myms')
  const [notice, setNotice] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      const { data: r } = await supabase.from('reservations').select('*').eq('user_id', user.id).order('experience_date', { ascending: true })
      const { data: a } = await supabase.from('admissions').select('id, edition_slug, status').eq('user_id', user.id).eq('status', 'pending')
      let reqs: Request[] = []
      if (a && a.length) {
        const { data: eds } = await supabase.from('editions').select('slug, name, edition_date').in('slug', a.map(x => x.edition_slug))
        reqs = a.map(x => {
          const ed = (eds || []).find(e => e.slug === x.edition_slug)
          return { id: x.id, edition_slug: x.edition_slug, status: x.status, name: ed?.name || x.edition_slug, date: ed?.edition_date || null }
        })
      }
      setProfile(p); setReservations(r || []); setRequests(reqs); setLoading(false)
      const q = new URLSearchParams(window.location.search)
      const paidId = q.get('a')
      if (q.get('paid') === '1' && paidId) {
        const { data: ad } = await supabase.from('admissions').select('places, edition_slug').eq('id', paidId).eq('user_id', user.id).maybeSingle()
        if (ad) {
          const { data: ed } = await supabase.from('editions').select('*').eq('slug', ad.edition_slug).maybeSingle()
          if (ed) setWelcome({
            name: ed.name, headline: ed.headline, date: ed.edition_date, time: ed.start_time,
            places: ad.places, video: ed.video_url, poster: ed.poster_url, logo: ed.logo_url,
          })
        }
        window.history.replaceState(null, '', '/dashboard?tab=experiences')
      }
      if (q.get('verify') === 'processing') setFlash('Your identity is being verified. This usually takes a few minutes. You can then complete your reservation from this page.')
      if (q.get('verify') === 'failed') setFlash('Your identity could not be confirmed for this invitation. Our Guest Relations team will contact you personally.')
      if (q.get('payment') === 'error') setFlash('The payment page could not be opened. Please try again or contact our Guest Relations team.')
      const t = q.get('tab')
      if (t === 'experiences' || t === 'wishlist') setTab(t)
      try {
        if (!sessionStorage.getItem('ms_notice')) setNotice(true)
      } catch { setNotice(true) }
    }
    load()
  }, [])

  const closeWelcome = useCallback(() => setWelcome(null), [])

  const goTab = (t: Tab) => {
    setTab(t)
    window.scrollTo({ top: 0 })
  }

  const closeNotice = () => {
    setNotice(false)
    try { sessionStorage.setItem('ms_notice', '1') } catch {}
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return <main className="ms-acc" aria-busy="true" />

  const today = new Date(new Date().toDateString()).getTime()
  const upcoming = reservations.filter(r => !r.experience_date || new Date(r.experience_date).getTime() >= today)
  const past = reservations.filter(r => r.experience_date && new Date(r.experience_date).getTime() < today).reverse()

  const NightCard = ({ r }: { r: Reservation }) => (
    <div className="ms-acc__card">
      <span className="ms-acc__kick">
        {formatDate(r.experience_date)}
      </span>
      <span className="ms-acc__cname">{r.experience_name}</span>
      <span className={`ms-acc__tag${r.status === 'confirmed' ? ' is-on' : ''}`}>
        {r.status === 'confirmed' ? 'Confirmed' : r.admission_id ? 'Awaiting payment' : 'Pending'}
      </span>
      {r.status !== 'confirmed' && r.admission_id && (
        <a className="ms-acc__plus" href={`/api/pay/${r.admission_id}`}>Complete my reservation<b aria-hidden="true">+</b></a>
      )}
    </div>
  )

  const RequestCard = ({ q }: { q: Request }) => (
    <div className="ms-acc__card">
      <span className="ms-acc__kick">{formatDate(q.date)}</span>
      <span className="ms-acc__cname">{q.name}</span>
      <span className="ms-acc__tag">Under review</span>
    </div>
  )

  return (
    <main className={`ms-acc${welcome ? ' has-in' : ''}`}>
      {welcome && <YoureIn data={welcome} onClose={closeWelcome} />}
      {notice && (
        <div className="ms-acc__notice" role="dialog" aria-modal="true" aria-labelledby="ms-notice-title">
          <div className="ms-acc__panel">
            <button className="ms-acc__close" type="button" onClick={closeNotice} aria-label="Close">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.34 6.34L17.66 17.66M17.66 6.34L6.34 17.66" /></svg>
            </button>
            <span className="ms-acc__kick" id="ms-notice-title">Security Notice</span>
            <p className="ms-acc__desc">Maison Sanguine will never request payments, passwords, or confidential information through unofficial channels.</p>
            <button className="ms-acc__btn" type="button" onClick={closeNotice}>I Understand</button>
          </div>
        </div>
      )}

      <nav className="ms-acc__nav" aria-label="My MS">
        <div className="ms-acc__tabs">
          {TABS.map(t => (
            <button key={t.key} type="button" className="ms-acc__tab" aria-current={tab === t.key ? 'true' : 'false'} onClick={() => goTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
        <button type="button" className="ms-acc__out" onClick={logout}>Log out</button>
      </nav>

      {tab === 'myms' && (
        <>
          <section className="ms-acc__hero">
            <h1 className="ms-acc__title">
              <span>Welcome</span>
              {profile?.first_name && <span className="ms-it">{profile.first_name}</span>}
            </h1>
            <div>
              <p className="ms-acc__desc">Register your invitations in your Portfolio to access all our services in one place.</p>
              <p className="ms-acc__desc">In a few clicks, you can authenticate your invitation, explore the details of each night, confirm your attendance, or make a special request to our Guest Relations team.</p>
            </div>
            <a className="ms-acc__btn" href={LINKS.addInvitation}>Add an invitation</a>
          </section>

          <section className="ms-acc__sec">
            <h2 className="ms-acc__title">
              <span>Exclusive</span>
              <span className="ms-it">Services</span>
            </h2>
            <div className="ms-acc__grid">
              {SERVICES.map(s => (
                <article key={s.title.join(' ')} className="ms-acc__svc">
                  <Media src={s.img} />
                  <h3 className="ms-acc__stitle"><span>{s.title[0]}</span><span>{s.title[1]}</span></h3>
                  <p className="ms-acc__desc">{s.text}</p>
                  <Line href={s.href}>{s.cta}</Line>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {tab === 'experiences' && (
        <>
          <section className="ms-acc__dark">
            {flash && <p className="ms-acc__flash" role="status">{flash}</p>}
            <div className="ms-acc__head">
              <h2 className="ms-acc__title">
                <span>My</span>
                <span className="ms-it">Invitations</span>
              </h2>
              <p className="ms-acc__desc ms-acc__lead">Select an invitation to discover its details and access our services.</p>
              <a className="ms-acc__btn ms-acc__btn--line" href={LINKS.addInvitation}>Add an invitation</a>
            </div>
            <div className="ms-acc__cards">
              {requests.map(q => <RequestCard key={q.id} q={q} />)}
              {upcoming.map(r => <NightCard key={r.id} r={r} />)}
              {upcoming.length === 0 && requests.length === 0 && (
                <div className="ms-acc__card ms-acc__card--empty">
                  <p className="ms-acc__desc">Register your invitations to access our services and follow every detail of your nights, subject to authentication.</p>
                  <a className="ms-acc__plus" href={LINKS.addInvitation}>Add an invitation<b aria-hidden="true">+</b></a>
                </div>
              )}
            </div>

            <div className="ms-acc__head ms-acc__head--next">
              <h2 className="ms-acc__title">
                <span>Past</span>
                <span className="ms-it">Nights</span>
              </h2>
            </div>
            <div className="ms-acc__cards">
              {past.map(r => <NightCard key={r.id} r={r} />)}
              {past.length === 0 && (
                <div className="ms-acc__card ms-acc__card--empty">
                  <p className="ms-acc__desc">The nights you have lived with the Maison will be kept here.</p>
                </div>
              )}
            </div>
          </section>

          <section className="ms-acc__split">
            <div className="ms-acc__split-text">
              <h2 className="ms-acc__title">
                <span>Online</span>
                <span className="ms-it">Special Request</span>
              </h2>
              <p className="ms-acc__desc">Fill in the following form to make a special request about your night. Our Guest Relations team tailors your experience to your preferences, with personal attention and absolute discretion.</p>
              <Line href={LINKS.contact}>Make a special request</Line>
            </div>
            <Media src={IMG.request} />
          </section>
        </>
      )}

      {tab === 'wishlist' && (
        <>
          <section className="ms-acc__sec ms-acc__sec--top">
            <div className="ms-acc__head">
              <h2 className="ms-acc__title">
                <span>My</span>
                <span className="ms-it">Selection</span>
              </h2>
              <p className="ms-acc__desc ms-acc__lead">Explore the nights of your selection in detail, compare their features and contact us for any reservation or admission request.</p>
              <a className="ms-acc__btn ms-acc__btn--line" href={LINKS.contact}>Contact us</a>
            </div>
            <div className="ms-acc__cards">
              <div className="ms-acc__card ms-acc__card--empty">
                <svg className="ms-acc__star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.85 5.77 6.37.93-4.61 4.49 1.09 6.34L12 17.34l-5.7 2.99 1.09-6.34-4.61-4.49 6.37-.93z" /></svg>
                <span className="ms-acc__cname ms-acc__cname--sm">Save your selection</span>
                <p className="ms-acc__desc">Tap the star icon to add nights from the Night Collection to your selection.</p>
                <a className="ms-acc__plus" href={LINKS.season}>Browse all nights<b aria-hidden="true">+</b></a>
              </div>
            </div>
          </section>

          <section className="ms-acc__split">
            <div className="ms-acc__split-text">
              <h2 className="ms-acc__title">
                <span>Discover</span>
                <span className="ms-it">your favourites</span>
                <span>at the Maison.</span>
              </h2>
              <p className="ms-acc__desc">Explore the destinations of the Season and the Houses of the Maison to find the experience closest to you, wherever you are in the world.</p>
              <Line href={LINKS.locations}>Find an Experience</Line>
            </div>
            <Media src={IMG.locations} />
          </section>
        </>
      )}

      <div className="ms-acc__foot">
        <button type="button" className="ms-acc__out" onClick={logout}>Log out</button>
      </div>
    </main>
  )
}
