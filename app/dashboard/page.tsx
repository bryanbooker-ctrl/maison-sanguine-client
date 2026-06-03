'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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

  const logo = (
    <picture>
      <source media="(max-width: 768px)" srcSet="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/7f897d71-28bf-4618-b66d-19689f551029/MAISON_SANGUINE_LOGOTYPE_MOBILE_DARK.png?format=1500w" />
      <img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/d680077f-c82d-4753-9711-123fcb38ef39/MAISON_SANGUINE_LOGOTYPE_DARK.png?format=1500w" alt="Maison Sanguine" style={{ height: '28px', width: 'auto' }} />
    </picture>
  )

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999' }}>Loading</p>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#fff', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#111' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #e8e8e8', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {logo}
        <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#999', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
          Log out
        </button>
      </header>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '64px 48px' }}>
        {/* Welcome */}
        <div style={{ marginBottom: '64px', borderBottom: '1px solid #e8e8e8', paddingBottom: '48px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', margin: '0 0 12px' }}>My Account</p>
          <h1 style={{ fontSize: '36px', fontWeight: '200', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 8px' }}>
            {profile?.first_name} {profile?.last_name}
          </h1>
          <p style={{ fontSize: '13px', color: '#999', margin: 0, fontWeight: '300' }}>{profile?.email}</p>
        </div>

        {/* Reservations */}
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', margin: '0 0 32px' }}>My Experiences</p>

          {reservations.length === 0 ? (
            <div style={{ border: '1px solid #e8e8e8', padding: '48px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#bbb', letterSpacing: '1px', fontWeight: '300' }}>No experience reserved yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e8e8e8' }}>
              {reservations.map(r => (
                <div key={r.id} style={{ background: '#fff', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '1px', margin: '0 0 6px' }}>{r.experience_name}</p>
                    <p style={{ color: '#999', fontSize: '12px', margin: 0, fontWeight: '300' }}>
                      {r.experience_date ? new Date(r.experience_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                      {r.guests > 1 && ` · ${r.guests} guests`}
                    </p>
                  </div>
                  <span style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: r.status === 'confirmed' ? '#111' : '#bbb' }}>
                    {r.status === 'confirmed' ? 'Confirmed' : r.status === 'pending' ? 'Pending' : r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
