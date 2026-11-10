'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const MESSAGES: Record<string, string> = {
  not_found: 'This invitation code could not be found. Please check it and try again.',
  taken: 'This invitation is already registered to another MS Account. Please contact our Guest Relations team.',
  already: 'This invitation is already registered in your Portfolio.',
  too_many: 'Too many attempts. For your security, please wait 15 minutes before trying again.',
}

export default function AddInvitationPage() {
  const [code, setCode] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) { setError('Please enter your invitation code.'); return }
    setLoading(true)
    setError('')
    const { data, error } = await supabase.rpc('claim_invitation', { p_code: code.trim().toUpperCase(), p_consent: consent })
    setLoading(false)
    if (error) { setError('This service is temporarily unavailable. Please try again later.'); return }
    if (data === 'ok') setDone(true)
    else setError(MESSAGES[data as string] || MESSAGES.not_found)
  }

  if (done) return (
    <main>
      <section className="ms-sign ms-sign--dark">
        <h1 className="ms-sign__title">
          <span>Invitation</span>
          <span className="ms-it">registered</span>
        </h1>
        <div className="ms-sign__intro">
          Your invitation has been authenticated and added to your Portfolio.
        </div>
        <div className="ms-sign__acc">
          <Link className="ms-sign__login" href="/dashboard">Back to My MS</Link>
        </div>
      </section>
    </main>
  )

  return (
    <main>
      <section className="ms-sign ms-sign--dark">
        <h1 className="ms-sign__title">
          <span>Register</span>
          <span className="ms-it">your invitation</span>
        </h1>
        <div className="ms-sign__intro">
          Register your invitations in your Portfolio to access all our services in one place.
        </div>
        <div className="ms-sign__intro ms-sign__intro--next">
          Each invitation is issued exclusively by our selection committee and carries a unique code, which confirms its authenticity.
        </div>

        <form className="ms-sign__form" onSubmit={submit} noValidate>
          <div className={`ms-sign__field${error ? ' is-err' : ''}`}>
            <label className="ms-sign__label" htmlFor="ms-code">Invitation code</label>
            <input className="ms-sign__input" id="ms-code" type="text" autoComplete="off" autoCapitalize="characters" placeholder="Enter your invitation code" value={code} onChange={e => setCode(e.target.value)} />
            {error && <p className="ms-sign__err" role="alert">{error}</p>}
          </div>
          <label className="ms-sign__check">
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
            <span>I would like to receive information about upcoming editions, the Season and the services of the Maison.</span>
          </label>
          <button className="ms-sign__btn" type="submit" disabled={loading}>
            {loading ? 'Verifying' : 'Register my invitation'}
          </button>
        </form>
      </section>
    </main>
  )
}
