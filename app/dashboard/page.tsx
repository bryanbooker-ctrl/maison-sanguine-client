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
            <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#111', marginBottom: '20px', fontWeight: '600', margin: '0 0 20px' }}>Security Notice</p>
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
      <header style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9000,
        background: '#000',
        height: '80px',
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        padding: '0 90px', boxSizing: 'border-box',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="https://maisonsanguine.com/initiative-maison-sanguine" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/2e0ae33b-5066-4687-be76-a473301f9389/INITIATIVE_MAISON_SANGUINE_LOGOTYPE_BLACK_RGB_RS.png" alt="Initiative Maison Sanguine" style={{ height: '44px', width: 'auto', filter: 'brightness(0) invert(1)', objectFit: 'contain', display: 'block' }} />
          </a>
          <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.25)', flexShrink: 0 }}></div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {[['Season', 'https://maisonsanguine.com/season'], ['Our World', 'https://maisonsanguine.com/about'], ['Stories', 'https://maisonsanguine.com/news']].map(([label, href]) => (
              <a key={label} href={href} style={{ fontSize: '12px', fontWeight: '400', letterSpacing: '.07em', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>{label}</a>
            ))}
          </nav>
        </div>
        {/* Center */}
        <a href="https://maisonsanguine.com" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
          <img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/d680077f-c82d-4753-9711-123fcb38ef39/MAISON_SANGUINE_LOGOTYPE_DARK.png?format=1500w" alt="Maison Sanguine" style={{ height: '44px', width: 'auto', filter: 'brightness(0) invert(1)', objectFit: 'contain', display: 'block' }} />
        </a>
        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
          <a href="https://maisonsanguine.com/season" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'flex' }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </a>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontFamily: 'inherit', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', padding: 0 }}>
            Log out
          </button>
        </div>
      </header>

      {/* TABS — sticky sous le header */}
      <div style={{ position: 'sticky', top: '80px', zIndex: 8000, background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 90px' }}>
          {[
            { key: 'myms', label: 'My MS' },
            { key: 'experiences', label: 'My Experiences' },
            { key: 'wishlist', label: 'My Wishlist' },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as any)} style={{
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '13px', fontWeight: tab === t.key ? '500' : '400',
              color: tab === t.key ? '#111' : '#999',
              padding: '18px 0', marginRight: '40px', letterSpacing: '.04em',
              borderBottom: tab === t.key ? '2px solid #111' : '2px solid transparent',
              transition: 'all .2s'
            }}>{t.label}</button>
          ))}
          <button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', color: '#999', letterSpacing: '.04em', padding: '18px 0' }}>Logout</button>
        </div>
      </div>

      {/* PAGE CONTENT — padding top = header height */}
      <div style={{ paddingTop: '80px' }}>

        {/* MY MS */}
        {tab === 'myms' && (
          <div style={{ background: '#f5f5f3', minHeight: '60vh', padding: '80px 90px', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '60px', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '56px', fontWeight: '100', letterSpacing: '3px', textTransform: 'uppercase', color: '#111', margin: '0 0 16px', lineHeight: '1', fontFamily: 'inherit' }}>WELCOME</h1>
              <p style={{ fontSize: '16px', fontWeight: '300', color: '#666', margin: 0, letterSpacing: '.02em' }}>{profile?.first_name} {profile?.last_name}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.9', fontWeight: '300', margin: '0 0 20px' }}>
                Access your invitations and reservations in your Portfolio and enjoy all Maison Sanguine services from a single point of access.
              </p>
              <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.9', fontWeight: '300', margin: 0 }}>
                In just a few clicks, you can view your upcoming experiences, manage your reservations, confirm your attendance at our nocturnal productions, access practical information and experience details, or contact our team for any assistance request.
              </p>
            </div>
            <button onClick={() => setTab('experiences')} style={{ background: '#111', color: '#fff', border: 'none', padding: '16px 32px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              My Experiences
            </button>
          </div>
        )}

        {/* MY EXPERIENCES */}
        {tab === 'experiences' && (
          <div style={{ padding: '64px 90px 80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
              <div>
                <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', margin: '0 0 6px' }}>My</p>
                <h2 style={{ fontSize: '52px', fontWeight: '100', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', margin: 0, lineHeight: '1' }}>EXPERIENCES</h2>
              </div>
              <p style={{ fontSize: '13px', color: '#999', fontWeight: '300', maxWidth: '360px', textAlign: 'right', lineHeight: '1.7', marginTop: '8px' }}>Select an experience to explore its details and access all related services.</p>
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
          <div style={{ padding: '64px 90px 80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', margin: '0 0 6px' }}>My</p>
                <h2 style={{ fontSize: '52px', fontWeight: '100', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', margin: 0, lineHeight: '1' }}>WISHLIST</h2>
              </div>
              <a href="https://maisonsanguine.com/season" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', textDecoration: 'none', border: '1px solid #111', padding: '14px 28px', marginTop: '8px', display: 'inline-block' }}>
                Register Interest
              </a>
            </div>
            <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.9', fontWeight: '300', marginBottom: '48px', maxWidth: '600px' }}>
              Select your favourites to learn more and register your interest for upcoming experiences.
            </p>
            <div style={{ border: '1px solid #e8e8e8', padding: '100px 40px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#bbb', letterSpacing: '1px', fontWeight: '300', marginBottom: '28px' }}>No experiences saved yet</p>
              <a href="https://maisonsanguine.com/season" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', textDecoration: 'none', borderBottom: '1px solid #111', paddingBottom: '3px' }}>Browse All Experiences +</a>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer style={{ background: '#000', padding: '64px 90px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '48px', boxSizing: 'border-box' }}>
        <div>
          <img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/d680077f-c82d-4753-9711-123fcb38ef39/MAISON_SANGUINE_LOGOTYPE_DARK.png?format=1500w" alt="Maison Sanguine" style={{ height: '36px', width: 'auto', filter: 'brightness(0) invert(1)', objectFit: 'contain', display: 'block', marginBottom: '24px' }} />
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: '300', lineHeight: '1.8', margin: 0 }}>© {new Date().getFullYear()} Maison Sanguine.<br />All rights reserved.</p>
        </div>
        <div>
          <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '20px', margin: '0 0 20px' }}>Navigation</p>
          {[['Season', 'https://maisonsanguine.com/season'], ['Our World', 'https://maisonsanguine.com/about'], ['Stories', 'https://maisonsanguine.com/news'], ['MS Archives', 'https://maisonsanguine.com/msarchives'], ['Initiative MS', 'https://maisonsanguine.com/initiative-maison-sanguine']].map(([label, href]) => (
            <a key={label} href={href} style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: '12px', fontWeight: '300', letterSpacing: '.04em' }}>{label}</a>
          ))}
        </div>
        <div>
          <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '20px', margin: '0 0 20px' }}>Legal</p>
          {[['Privacy Policy', 'https://maisonsanguine.com/privacy'], ['Terms of Use', 'https://maisonsanguine.com/terms'], ['Cookie Policy', 'https://maisonsanguine.com/cookie'], ['Contact', 'https://maisonsanguine.com/contact']].map(([label, href]) => (
            <a key={label} href={href} style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: '12px', fontWeight: '300', letterSpacing: '.04em' }}>{label}</a>
          ))}
        </div>
      </footer>

    </div>
  )
}
