'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { safeNext } from '@/lib/next'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push(safeNext(new URLSearchParams(window.location.search).get('next')))
  }

  return (
    <main>
      <section className="ms-sign ms-sign--dark">
        <h1 className="ms-sign__title">
          <span>Welcome</span>
        </h1>
        <div className="ms-sign__intro">
          Log in to access your personal MS Account or register using the link below. Your personal account allows you to view your invitations and experience reservations, and benefit from additional exclusive features.
        </div>
        <div className="ms-sign__acc">
          <span>Don&apos;t have an account?</span>
          <Link className="ms-sign__login" href="/auth/signup" onClick={e => { const n = new URLSearchParams(window.location.search).get('next'); if (n) { e.preventDefault(); router.push(`/auth/signup?next=${encodeURIComponent(safeNext(n))}`) } }}>Sign up</Link>
        </div>

        <form className="ms-sign__form" onSubmit={handleLogin} noValidate>
          <div className="ms-sign__field">
            <label className="ms-sign__label" htmlFor="ms-email">Email *</label>
            <input className="ms-sign__input" id="ms-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className={`ms-sign__field${error ? ' is-err' : ''}`}>
            <label className="ms-sign__label" htmlFor="ms-password">Password *</label>
            <input className="ms-sign__input" id="ms-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
            {error && <p className="ms-sign__err" role="alert">{error}</p>}
          </div>
          <button className="ms-sign__btn" type="submit" disabled={loading}>
            {loading ? 'Signing in' : 'Continue'}
          </button>
        </form>
      </section>
    </main>
  )
}
