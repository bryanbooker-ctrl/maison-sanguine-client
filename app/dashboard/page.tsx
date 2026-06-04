'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'myms' | 'experiences' | 'wishlist'>('myms')
  const [popup, setPopup] = useState(true)
  const [megaPanel, setMegaPanel] = useState<string | null>(null)
  const [mobMenuOpen, setMobMenuOpen] = useState(false)
  const [mobSubOpen, setMobSubOpen] = useState<string | null>(null)
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

  const imsLogo = 'https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/2e0ae33b-5066-4687-be76-a473301f9389/INITIATIVE_MAISON_SANGUINE_LOGOTYPE_BLACK_RGB_RS.png'
  const msLogoDark = 'https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/d680077f-c82d-4753-9711-123fcb38ef39/MAISON_SANGUINE_LOGOTYPE_DARK.png?format=1500w'
  const msMobLogo = 'https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/798b7cdb-21d9-4ac6-8c20-eb97e0e193f6/logo+maison+sanguine+mobile_.png?format=1500w'

  const seasonLinks = [['Upcoming Events','https://maisonsanguine.com/season'],['Los Angeles','https://maisonsanguine.com/event/los-angeles-spring-edition'],['New York','https://maisonsanguine.com/event/new-york-summer-edition'],['Dubai','https://maisonsanguine.com/event/dubai-fall-edition'],['Miami','https://maisonsanguine.com/event/miami-winter-edition']]
  const worldLinks = [['MS x Art','https://maisonsanguine.com/about/maison-sanguine-contemporary'],['MS x Music','https://maisonsanguine.com/about/music'],['MS Archives','https://maisonsanguine.com/msarchives'],['MS Chronicles','https://maisonsanguine.com/msarchives']]

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#111' }}>

      {/* SECURITY POPUP */}
      {popup && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'rgba(0,0,0,0.5)' }}>
          <div style={{ background: '#f5f5f3', maxWidth: '560px', width: '100%', padding: '48px 40px', position: 'relative', boxSizing: 'border-box' }}>
            <button onClick={() => setPopup(false)} style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: '#111', lineHeight: 1, padding: 0 }}>×</button>
            <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#111', margin: '0 0 20px', fontWeight: '600' }}>Security Notice</p>
            <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.9', fontWeight: '300', margin: '0 0 32px' }}>Maison Sanguine will never request payments, passwords, or confidential information through unofficial channels. If you receive any suspicious communication claiming to represent Maison Sanguine, please contact our team directly through our official website.</p>
            <button onClick={() => setPopup(false)} style={{ width: '100%', background: '#111', color: '#fff', border: 'none', padding: '16px', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>I Understand</button>
          </div>
        </div>
      )}

      {/* ═══ HEADER DESKTOP ═══ */}
      <style>{`
        .ms-desk { display: none; }
        .ms-mob { display: none; }
        @media (min-width: 1025px) { .ms-desk { display: grid !important; } }
        @media (max-width: 1024px) { .ms-mob { display: flex !important; } }
        .ms-nav-link:hover { color: rgba(255,255,255,0.65) !important; }
        .ms-sb-link:hover { color: #fff !important; }
        .ms-mob-link:hover { color: #fff !important; }
        .ms-logout-btn:hover { opacity: 0.65; }
      `}</style>

      <header className="ms-desk" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '120px', zIndex: 9000, background: '#000', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 90px', boxSizing: 'border-box', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="https://maisonsanguine.com/initiative-maison-sanguine" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0, transition: 'opacity .25s' }}>
            <img src={imsLogo} alt="IMS" style={{ width: '80px', height: '70px', objectFit: 'contain', filter: 'brightness(0) invert(1)', display: 'block' }} />
          </a>
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }}></div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px', height: '120px' }}>
            {[['season','Season'],['world','Our World']].map(([key, label]) => (
              <div key={key} style={{ position: 'relative', height: '120px', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setMegaPanel(megaPanel === key ? null : key)}>
                <span className="ms-nav-link" style={{ fontSize: '13px', fontWeight: '400', letterSpacing: '.07em', color: megaPanel === key ? '#fff' : 'rgba(255,255,255,0.85)', transition: 'color .25s', userSelect: 'none' }}>{label}</span>
                {megaPanel === key && <div style={{ position: 'absolute', bottom: '45px', left: 0, right: 0, height: '2px', background: '#fff' }}></div>}
              </div>
            ))}
            <a href="https://maisonsanguine.com/news" className="ms-nav-link" style={{ fontSize: '13px', fontWeight: '400', letterSpacing: '.07em', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', transition: 'color .25s' }}>Stories</a>
          </nav>
        </div>
        <a href="https://maisonsanguine.com" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none', transition: 'opacity .25s' }}>
          <img src={msLogoDark} alt="Maison Sanguine" style={{ height: '50px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', display: 'block' }} />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '28px' }}>
          <a href="https://maisonsanguine.com/season" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.35"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </a>
          <button className="ms-logout-btn" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.85)', fontFamily: 'inherit', fontSize: '13px', letterSpacing: '.07em', padding: 0, transition: 'opacity .25s' }}>Log out</button>
        </div>
      </header>

      {/* ═══ MEGA MENU ═══ */}
      {megaPanel && (
        <>
          <div style={{ position: 'fixed', top: '120px', left: 0, width: '100%', background: '#000', zIndex: 8998, padding: '44px 90px 48px', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '210px 1fr', gap: '52px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '10px' }}>
              {(megaPanel === 'season' ? seasonLinks : worldLinks).map(([l, h]) => (
                <a key={l} href={h} className="ms-sb-link" style={{ display: 'block', padding: '9px 0', fontSize: '12px', fontWeight: '400', letterSpacing: '.05em', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color .2s' }}>{l}</a>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '16px' }}>
              <div style={{ fontSize: '28px', fontWeight: '100', letterSpacing: '-.025em', textTransform: 'uppercase', color: '#fff', lineHeight: '.86', display: 'flex', alignItems: 'baseline', gap: '11px' }}>
                {megaPanel === 'season' ? <>OUR <em style={{ fontStyle: 'italic', fontWeight: '200', fontSize: '32px' }}>PRODUCTIONS</em></> : <>OUR <em style={{ fontStyle: 'italic', fontWeight: '200', fontSize: '32px' }}>WORLD</em></>}
              </div>
            </div>
          </div>
          <div onClick={() => setMegaPanel(null)} style={{ position: 'fixed', inset: 0, zIndex: 8997, background: 'rgba(0,0,0,0.4)' }}></div>
        </>
      )}

      {/* ═══ HEADER MOBILE ═══ */}
      <div className="ms-mob" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '80px', zIndex: 10010, background: '#000', padding: '0 24px', boxSizing: 'border-box', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '14px' }}>
          {!mobMenuOpen && !mobSubOpen ? (
            <>
              <a href="https://maisonsanguine.com/initiative-maison-sanguine" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
                <img src={imsLogo} alt="IMS" style={{ width: '60px', height: '50px', objectFit: 'contain', filter: 'brightness(0) invert(1)', display: 'block' }} />
              </a>
              <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }}></div>
              <button onClick={() => setMobMenuOpen(true)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: '22px', height: '14px', position: 'relative', flexShrink: 0 }}>
                <span style={{ position: 'absolute', left: 0, width: '100%', height: '1px', background: 'rgba(255,255,255,0.9)', top: '3px' }}></span>
                <span style={{ position: 'absolute', left: 0, width: '100%', height: '1px', background: 'rgba(255,255,255,0.9)', top: '9px' }}></span>
              </button>
            </>
          ) : (
            <button onClick={() => { setMobMenuOpen(false); setMobSubOpen(null) }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#fff', display: 'flex' }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>
        <a href="https://maisonsanguine.com" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', textDecoration: 'none' }}>
          <img src={msMobLogo} alt="MS" style={{ height: '50px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', display: 'block' }} />
        </a>
        {!mobMenuOpen && !mobSubOpen && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
            <a href="https://maisonsanguine.com/season" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex' }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </a>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'rgba(255,255,255,0.85)', display: 'flex' }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="7.5" r="4"/><path d="M3 21c0-4.97 4.03-9 9-9s9 4.03 9 9"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* ═══ MENU MOBILE ═══ */}
      {mobMenuOpen && !mobSubOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10001, background: '#000', overflowY: 'auto', paddingTop: '80px' }}>
          <ul style={{ listStyle: 'none', padding: '36px 24px 0', margin: 0 }}>
            {[['season','Season'],['world','Our World']].map(([key, label]) => (
              <li key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.07)' }} onClick={() => setMobSubOpen(key)}>
                <span style={{ fontSize: '14px', fontWeight: '400', letterSpacing: '.05em', color: 'rgba(255,255,255,0.85)' }}>{label}</span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="1.35"><path d="M9 18l6-6-6-6"/></svg>
              </li>
            ))}
            <li style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <a href="https://maisonsanguine.com/news" style={{ fontSize: '14px', fontWeight: '400', letterSpacing: '.05em', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'block' }}>Stories</a>
            </li>
          </ul>
          <div style={{ padding: '32px 24px 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <a href="https://maisonsanguine.com/season" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', color: 'rgba(255,255,255,0.85)' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.35" style={{ opacity: .45 }}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <span style={{ fontSize: '13px' }}>Find your Experience</span>
            </a>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'rgba(255,255,255,0.85)', fontFamily: 'inherit' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.35" style={{ opacity: .45 }}><circle cx="12" cy="7.5" r="4"/><path d="M3 21c0-4.97 4.03-9 9-9s9 4.03 9 9"/></svg>
              <span style={{ fontSize: '13px' }}>Log out</span>
            </button>
          </div>
        </div>
      )}

      {/* ═══ SOUS-MENU MOBILE ═══ */}
      {mobSubOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10002, background: '#000', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '80px', padding: '0 24px', position: 'sticky', top: 0, background: '#000' }}>
            <button onClick={() => setMobSubOpen(null)} style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 0 }}>
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '13px', fontWeight: '600', letterSpacing: '.04em', color: '#fff' }}>{mobSubOpen === 'season' ? 'Season' : 'Our World'}</span>
          </div>
          <ul style={{ listStyle: 'none', padding: '20px 24px 0', margin: 0 }}>
            {(mobSubOpen === 'season' ? seasonLinks : worldLinks).map(([l, h]) => (
              <li key={l} style={{ padding: '19px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <a href={h} style={{ fontSize: '13px', fontWeight: '400', letterSpacing: '.05em', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', display: 'block' }}>{l}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ═══ TABS ═══ */}
      <div style={{ position: 'sticky', zIndex: 8000, background: '#fff', borderBottom: '1px solid #e8e8e8' }} className="ms-tabs-bar">
        <style>{`.ms-tabs-bar { top: 120px; } @media (max-width: 1024px) { .ms-tabs-bar { top: 80px; } }`}</style>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 90px' }} className="ms-tabs-inner">
          <style>{`@media (max-width: 1024px) { .ms-tabs-inner { padding: 0 24px !important; } }`}</style>
          {[['myms','My MS'],['experiences','My Experiences'],['wishlist','My Wishlist']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as any)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: tab === key ? '500' : '400', color: tab === key ? '#111' : '#999', padding: '18px 0', marginRight: '40px', letterSpacing: '.04em', borderBottom: tab === key ? '2px solid #111' : '2px solid transparent', transition: 'all .2s' }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="ms-content-top">
        <style>{`.ms-content-top { padding-top: 120px; } @media (max-width: 1024px) { .ms-content-top { padding-top: 80px; } }`}</style>

        {/* MY MS */}
        {tab === 'myms' && (
          <div style={{ background: '#f5f5f3', minHeight: '55vh', padding: '80px 90px', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '60px', alignItems: 'center', boxSizing: 'border-box' }} className="ms-myms-grid">
            <style>{`@media (max-width: 1024px) { .ms-myms-grid { grid-template-columns: 1fr !important; padding: 48px 24px !important; gap: 32px !important; } }`}</style>
            <div>
              <h1 style={{ fontSize: '56px', fontWeight: '100', letterSpacing: '3px', textTransform: 'uppercase', color: '#111', margin: '0 0 16px', lineHeight: '1', fontFamily: 'inherit' }}>WELCOME</h1>
              <p style={{ fontSize: '15px', fontWeight: '300', color: '#777', margin: 0 }}>{profile?.first_name} {profile?.last_name}</p>
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
          <div style={{ padding: '64px 90px 80px', boxSizing: 'border-box' }} className="ms-pad">
            <style>{`@media (max-width: 1024px) { .ms-pad { padding: 48px 24px 60px !important; } }`}</style>
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ margin: '0 0 16px', lineHeight: '1' }}>
                <span style={{ display: 'block', fontSize: '52px', fontWeight: '100', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', fontFamily: 'inherit' }}>MY</span>
                <span style={{ display: 'block', fontSize: '52px', fontWeight: '200', fontStyle: 'italic', color: '#111', fontFamily: 'Georgia, serif' }}>Experiences</span>
              </h2>
              <p style={{ fontSize: '13px', color: '#999', fontWeight: '300', margin: 0, lineHeight: '1.7' }}>Select an experience to explore its details and access all related services.</p>
            </div>
            {reservations.length === 0 ? (
              <div style={{ border: '1px solid #e8e8e8', padding: '100px 40px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#bbb', marginBottom: '28px', fontWeight: '300' }}>No experience reserved yet</p>
                <a href="https://maisonsanguine.com/season" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', textDecoration: 'none', borderBottom: '1px solid #111', paddingBottom: '3px' }}>Browse Experiences +</a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e8e8e8' }}>
                {reservations.map(r => (
                  <div key={r.id} style={{ background: '#fff', padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '24px' }}>
                    <div>
                      <p style={{ fontSize: '18px', fontWeight: '200', letterSpacing: '1px', margin: '0 0 8px', textTransform: 'uppercase' }}>{r.experience_name}</p>
                      <p style={{ color: '#999', fontSize: '12px', margin: 0, fontWeight: '300' }}>
                        {r.experience_date ? new Date(r.experience_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                        {r.guests > 1 && ` · ${r.guests} guests`}
                      </p>
                    </div>
                    <span style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: r.status === 'confirmed' ? '#111' : '#bbb', border: '1px solid', borderColor: r.status === 'confirmed' ? '#111' : '#e8e8e8', padding: '6px 14px' }}>
                      {r.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MY WISHLIST */}
        {tab === 'wishlist' && (
          <div style={{ padding: '64px 90px 80px', boxSizing: 'border-box' }} className="ms-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h2 style={{ margin: '0 0 16px', lineHeight: '1' }}>
                  <span style={{ display: 'block', fontSize: '52px', fontWeight: '100', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', fontFamily: 'inherit' }}>MY</span>
                  <span style={{ display: 'block', fontSize: '52px', fontWeight: '200', fontStyle: 'italic', color: '#111', fontFamily: 'Georgia, serif' }}>Wishlist</span>
                </h2>
                <p style={{ fontSize: '13px', color: '#999', fontWeight: '300', margin: 0, lineHeight: '1.7' }}>Select your favourites to learn more and register your interest for upcoming experiences.</p>
              </div>
              <a href="https://maisonsanguine.com/season" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', textDecoration: 'none', border: '1px solid #111', padding: '14px 28px', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>Register Interest</a>
            </div>
            <div style={{ border: '1px solid #e8e8e8', padding: '100px 40px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#bbb', marginBottom: '28px', fontWeight: '300' }}>No experiences saved yet</p>
              <a href="https://maisonsanguine.com/season" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', textDecoration: 'none', borderBottom: '1px solid #111', paddingBottom: '3px' }}>Browse All Experiences +</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
