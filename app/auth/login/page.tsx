'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <main style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', paddingBottom: '60px' }}>
      <div style={{ marginTop: '48px', marginBottom: '56px', textAlign: 'center' }}>
        <picture>
          <source media="(max-width: 768px)" srcSet="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/7f897d71-28bf-4618-b66d-19689f551029/MAISON_SANGUINE_LOGOTYPE_MOBILE_DARK.png?format=1500w" />
          <img src="https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/d680077f-c82d-4753-9711-123fcb38ef39/MAISON_SANGUINE_LOGOTYPE_DARK.png?format=1500w" alt="Maison Sanguine" style={{ height: '50px', width: 'auto' }} />
        </picture>
      </div>
      <div style={{ width: '100%', maxWidth: '480px', padding: '0 24px', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '44px', fontWeight: '200', letterSpacing: '5px', textTransform: 'uppercase', color: '#111', margin: '0 0 24px', lineHeight: '1.2' }}>Welcome</h1>
        <p style={{ fontSize: '15px', color: '#111', lineHeight: '1.9', margin: '0 0 32px', fontWeight: '300' }}>
          Log in to access your personal MS Account or register using the link below. Your personal account allows you to view your invitations and experience reservations, and benefit from additional exclusive features.
        </p>
        <div style={{ background: '#f5f5f3', padding: '16px 20px', marginBottom: '32px' }}>
          <span style={{ fontSize: '14px', color: '#111', fontWeight: '300' }}>Don't have an account? </span>
          <Link href="/auth/signup" style={{ fontSize: '14px', color: '#111', fontWeight: '500', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Sign up</Link>
        </div>
        {error && <p style={{ color: '#c0392b', fontSize: '12px', marginBottom: '16px' }}>{error}</p>}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', marginBottom: '10px', fontWeight: '500' }}>Email *</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', border: 'none', borderBottom: '1px solid #ccc', padding: '10px 0', fontSize: '15px', color: '#111', outline: 'none', background: 'transparent', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <label style={{ display: 'block', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#111', marginBottom: '10px', fontWeight: '500' }}>Password *</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ width: '100%', border: 'none', borderBottom: '1px solid #ccc', padding: '10px 0', fontSize: '15px', color: '#111', outline: 'none', background: 'transparent', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </div>
        <button onClick={handleLogin} disabled={loading} style={{ width: '100%', background: '#111', color: '#fff', border: 'none', padding: '16px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '400' }}>
          {loading ? '...' : 'Continue'}
        </button>
      </div>
    </main>
  )
}
