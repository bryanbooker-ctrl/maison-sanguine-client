'use client'

import { useState } from 'react'
import Link from 'next/link'
import { safeNext } from '@/lib/next'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext(new URLSearchParams(window.location.search).get('next')))}`,
      }
    })
    if (error) { setError(error.message); setLoading(false) }
    else if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, email, first_name: firstName, last_name: lastName })
      setSuccess(true)
    }
  }

  if (success) return (
    <main>
      <section className="ms-sign ms-sign--dark">
        <h1 className="ms-sign__title">
          <span>Confirm</span>
          <span className="ms-it">your email</span>
        </h1>
        <div className="ms-sign__intro">
          Please check your inbox at {email} and click the confirmation link to activate your account.
        </div>
      </section>
    </main>
  )

  return (
    <main>
      <section className="ms-sign ms-sign--dark">
        <h1 className="ms-sign__title">
          <span>Create your</span>
          <span className="ms-it">MS Account</span>
        </h1>
        <div className="ms-sign__intro">
          Your personal MS account allows you to view your invitations and experience reservations, and benefit from additional exclusive features.
        </div>
        <div className="ms-sign__acc">
          <span>Already have an account?</span>
          <Link className="ms-sign__login" href="/auth/login" onClick={e => { const n = new URLSearchParams(window.location.search).get('next'); if (n) { e.preventDefault(); window.location.href = `/auth/login?next=${encodeURIComponent(safeNext(n))}` } }}>Log in</Link>
        </div>

        <form className="ms-sign__form" onSubmit={handleSignup} noValidate>
          <div className="ms-sign__row ms-sign__row--2">
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="ms-first">First name</label>
              <input className="ms-sign__input" id="ms-first" type="text" autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div className="ms-sign__field">
              <label className="ms-sign__label" htmlFor="ms-last">Last name</label>
              <input className="ms-sign__input" id="ms-last" type="text" autoComplete="family-name" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="ms-sign__field">
            <label className="ms-sign__label" htmlFor="ms-email">Email address *</label>
            <input className="ms-sign__input" id="ms-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className={`ms-sign__field${error ? ' is-err' : ''}`}>
            <label className="ms-sign__label" htmlFor="ms-password">Password *</label>
            <input className="ms-sign__input" id="ms-password" type="password" autoComplete="new-password" required value={password} onChange={e => setPassword(e.target.value)} />
            {error && <p className="ms-sign__err" role="alert">{error}</p>}
          </div>
          <button className="ms-sign__btn" type="submit" disabled={loading}>
            {loading ? 'Creating your account' : 'Continue'}
          </button>
        </form>
      </section>
    </main>
  )
}
