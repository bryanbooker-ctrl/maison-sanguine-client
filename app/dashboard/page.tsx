'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'myms' | 'experiences' | 'wishlist'>('myms')
  const [popup, setPopup] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      const { data: reservations } = await supabase.from('reservations').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setProfile(profile)
      setReservations(reservations || [])
      setLoading(false)
    }
    load()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999' }}>Loading</p>
    </main>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#111' }}>

      {/* SECURITY POPUP */}
      {popup && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'rgba(0,0,0,0.5)' }}>
          <div style={{ background: '#f5f5f3', maxWidth: '560px', width: '100%', padding: '48px 40px', position: 'relative', boxSizing: 'border-box' }}>
            <button onClick={() => setPopup(false)} style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: '#111', lineHeight: 1, padding: 0 }}>×</button>
            <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#111', margin: '0 0 20px', fontWeight: '600' }}>Security Notice</p>
            <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.9', fontWeight: '300', margin: '0 0 32px' }}>
              Maison Sanguine will never request payments, passwords, or confidential information through unofficial channels. If you receive any suspicious communication claiming to represent Maison Sanguine, please contact our team directly through our official website.
            </p>
            <button onClick={() => setPopup(false)} style={{ width: '100%', background: '#111', color: '#fff', border: 'none', padding: '16px', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* HEADER — noir fixe permanent */}
      <header style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9000, background: '#000', height: '80px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 90px', boxSizing: 'border-box', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="https://maisonsanguine.com/initiative-maison-sanguine" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/2e0ae33b-5066-4687-be76-a473301f9389/INITIATIVE_MAISON_SANGUINE_LOGOTYPE_BLACK_RGB_RS.png" alt="Initiative Maison Sanguine" style={{ height: '44px', width: 'auto', filter: 'brightness(0) invert(1)', objectFit: 'contain', display: 'block' }} />
          </a>
          <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.25)', flexShrink: 0 }}></div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {([['Season', 'https://maisonsanguine.com/season'], ['Our World', 'https://maisonsanguine.com/about'], ['Stories', 'https://maisonsanguine.com/news']] as [string,string][]).map(([label, href]) => (
              <a key={label} href={href} style={{ fontSize: '12px', fontWeight: '400', letterSpacing: '.07em', color: '#fff', textDecoration: 'none', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>{label}</a>
            ))}
          </nav>
        </div>
        <a href="https://maisonsanguine.com" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
          <img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/d680077f-c82d-4753-9711-123fcb38ef39/MAISON_SANGUINE_LOGOTYPE_DARK.png?format=1500w" alt="Maison Sanguine" style={{ height: '44px', width: 'auto', filter: 'brightness(0) invert(1)', objectFit: 'contain', display: 'block' }} />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
          <a href="https://maisonsanguine.com/season" style={{ color: '#fff', textDecoration: 'none', display: 'flex' }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </a>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontFamily: 'inherit', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', padding: 0 }}>
            Log out
          </button>
        </div>
      </header>

      {/* TABS */}
      <div style={{ position: 'sticky', top: '80px', zIndex: 8000, background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 90px' }}>
          {([['myms','My MS'],['experiences','My Experiences'],['wishlist','My Wishlist']] as [string,string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as any)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: tab === key ? '500' : '400', color: tab === key ? '#111' : '#999', padding: '18px 0', marginRight: '40px', letterSpacing: '.04em', borderBottom: tab === key ? '2px solid #111' : '2px solid transparent', transition: 'all .2s' }}>{label}</button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ paddingTop: '80px' }}>

        {/* MY MS */}
        {tab === 'myms' && (
          <div style={{ background: '#f5f5f3', minHeight: '55vh', padding: '80px 90px', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '60px', alignItems: 'center', boxSizing: 'border-box' }}>
            <div>
              <h1 style={{ fontSize: '56px', fontWeight: '100', letterSpacing: '3px', textTransform: 'uppercase', color: '#111', margin: '0 0 16px', lineHeight: '1', fontFamily: 'inherit' }}>WELCOME</h1>
              <p style={{ fontSize: '15px', fontWeight: '300', color: '#777', margin: 0, letterSpacing: '.02em' }}>{profile?.first_name} {profile?.last_name}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.9', fontWeight: '300', margin: '0 0 18px' }}>Access your invitations and reservations in your Portfolio and enjoy all Maison Sanguine services from a single point of access.</p>
              <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.9', fontWeight: '300', margin: 0 }}>In just a few clicks, you can view your upcoming experiences, manage your reservations, confirm your attendance at our nocturnal productions, access practical information and experience details, or contact our team for any assistance request.</p>
            </div>
            <button onClick={() => setTab('experiences')} style={{ background: '#111', color: '#fff', border: 'none', padding: '16px 32px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', alignSelf: 'center' }}>My Experiences</button>
          </div>
        )}

        {/* MY EXPERIENCES */}
        {tab === 'experiences' && (
          <div style={{ padding: '64px 90px 80px', boxSizing: 'border-box' }}>
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '52px', fontWeight: '100', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', margin: '0 0 16px', lineHeight: '1', fontFamily: 'inherit' }}>MY EXPERIENCES</h2>
              <p style={{ fontSize: '13px', color: '#999', fontWeight: '300', margin: 0, lineHeight: '1.7' }}>Select an experience to explore its details and access all related services.</p>
            </div>
            {reservations.length === 0 ? (
              <div style={{ border: '1px solid #e8e8e8', padding: '100px 40px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#bbb', letterSpacing: '1px', fontWeight: '300', marginBottom: '28px' }}>No experience reserved yet</p>
                <a href="https://maisonsanguine.com/season" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', textDecoration: 'none', borderBottom: '1px solid #111', paddingBottom: '3px' }}>Browse Experiences +</a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e8e8e8' }}>
                {reservations.map(r => (
                  <div key={r.id} style={{ background: '#fff', padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '24px' }}>
                    <div>
                      <p style={{ fontSize: '18px', fontWeight: '200', letterSpacing: '1px', margin: '0 0 8px', textTransform: 'uppercase' }}>{r.experience_name}</p>
                      <p style={{ color: '#999', fontSize: '12px', margin: 0, fontWeight: '300', letterSpacing: '.04em' }}>
                        {r.experience_date ? new Date(r.experience_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                        {r.guests > 1 && ` · ${r.guests} guests`}
                      </p>
                    </div>
                    <span style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: r.status === 'confirmed' ? '#111' : '#bbb', border: '1px solid', borderColor: r.status === 'confirmed' ? '#111' : '#e8e8e8', padding: '6px 14px' }}>
                      {r.status === 'confirmed' ? 'Confirmed' : r.status === 'pending' ? 'Pending' : r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MY WISHLIST */}
        {tab === 'wishlist' && (
          <div style={{ padding: '64px 90px 80px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '52px', fontWeight: '100', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', margin: '0 0 16px', lineHeight: '1', fontFamily: 'inherit' }}>MY WISHLIST</h2>
                <p style={{ fontSize: '13px', color: '#999', fontWeight: '300', margin: 0, lineHeight: '1.7' }}>Select your favourites to learn more and register your interest for upcoming experiences.</p>
              </div>
              <a href="https://maisonsanguine.com/season" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', textDecoration: 'none', border: '1px solid #111', padding: '14px 28px', whiteSpace: 'nowrap', marginTop: '8px' }}>Register Interest</a>
            </div>
            <div style={{ border: '1px solid #e8e8e8', padding: '100px 40px', textAlign: 'center', marginTop: '48px' }}>
              <p style={{ fontSize: '13px', color: '#bbb', letterSpacing: '1px', fontWeight: '300', marginBottom: '28px' }}>No experiences saved yet</p>
              <a href="https://maisonsanguine.com/season" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', textDecoration: 'none', borderBottom: '1px solid #111', paddingBottom: '3px' }}>Browse All Experiences +</a>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer style={{ background: '#000', padding: '60px 90px', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
          <div>
            <img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/d680077f-c82d-4753-9711-123fcb38ef39/MAISON_SANGUINE_LOGOTYPE_DARK.png?format=1500w" alt="Maison Sanguine" style={{ height: '32px', width: 'auto', filter: 'brightness(0) invert(1)', objectFit: 'contain', display: 'block', marginBottom: '20px' }} />
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: '300', lineHeight: '1.8', margin: 0 }}>© {new Date().getFullYear()} Maison Sanguine</p>
          </div>
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 20px' }}>Season</p>
            {([['Upcoming Events', 'https://maisonsanguine.com/season'], ['Los Angeles', 'https://maisonsanguine.com/event/los-angeles-spring-edition'], ['New York', 'https://maisonsanguine.com/event/new-york-summer-edition'], ['Dubai', 'https://maisonsanguine.com/event/dubai-fall-edition'], ['Miami', 'https://maisonsanguine.com/event/miami-winter-edition']] as [string,string][]).map(([label, href]) => (
              <a key={label} href={href} style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: '10px', fontWeight: '300' }}>{label}</a>
            ))}
          </div>
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 20px' }}>Our World</p>
            {([['MS x Art', 'https://maisonsanguine.com/about/maison-sanguine-contemporary'], ['MS x Music', 'https://maisonsanguine.com/about/music'], ['MS Archives', 'https://maisonsanguine.com/msarchives'], ['Stories', 'https://maisonsanguine.com/news'], ['Initiative MS', 'https://maisonsanguine.com/initiative-maison-sanguine']] as [string,string][]).map(([label, href]) => (
              <a key={label} href={href} style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: '10px', fontWeight: '300' }}>{label}</a>
            ))}
          </div>
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 20px' }}>Legal</p>
            {([['Privacy Notice', 'https://maisonsanguine.com/privacy-notice'], ['Terms of Use', 'https://maisonsanguine.com/terms-of-use'], ['Cookie Policy', 'https://maisonsanguine.com/cookie-policy'], ['Accessibility', 'https://maisonsanguine.com/accessibility'], ['Contact', 'https://maisonsanguine.com/contact']] as [string,string][]).map(([label, href]) => (
              <a key={label} href={href} style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: '10px', fontWeight: '300' }}>{label}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            {([['Spotify', 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 14.5c-2.485 0-4.5-2.015-4.5-4.5S9.515 7.5 12 7.5s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5z'], ['Instagram', 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'], ['LinkedIn', 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'], ['YouTube', 'M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z'], ['X', 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z']] as [string,string,string][]).map(([name, path, href]) => (
              <a key={name} href={name === 'Spotify' ? 'https://open.spotify.com' : name === 'Instagram' ? 'https://instagram.com/maisonsanguine' : name === 'LinkedIn' ? 'https://linkedin.com/company/maisonsanguine' : name === 'YouTube' ? 'https://youtube.com/@maisonsanguine' : 'https://x.com/maisonsanguine'} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', transition: 'color .2s' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d={path}/></svg>
              </a>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: 0, letterSpacing: '.05em' }}>© {new Date().getFullYear()} MAISON SANGUINE</p>
        </div>
      </footer>

    </div>
  )
}
