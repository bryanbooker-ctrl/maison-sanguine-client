'use client'

import { useEffect, useRef, useState } from 'react'

export type Confirmed = {
  name: string
  headline: string | null
  date: string | null
  time: string | null
  places: number
  video: string | null
  poster: string | null
  logo: string | null
}

const MS_LOGO = 'https://images.squarespace-cdn.com/content/v1/690a2434f370707dc2fccae4/bb8c302b-7144-4246-9a16-b2db546ec9de/MS-LOGO.png?format=1500w'

export default function YoureIn({ data, onClose }: { data: Confirmed; onClose: () => void }) {
  const [stage, setStage] = useState<'wait' | 'title' | 'content'>('wait')
  const [playing, setPlaying] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let t: ReturnType<typeof setTimeout> | undefined
    let tries = 0
    const start = () => {
      if (document.getElementById('ms-loader') && tries++ < 60) { t = setTimeout(start, 100); return }
      setStage('title')
      t = setTimeout(() => setStage('content'), reduce ? 400 : 2800)
    }
    start()
    document.documentElement.style.overflow = 'hidden'
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => {
      if (t) clearTimeout(t)
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', esc)
    }
  }, [onClose])

  const play = () => {
    setPlaying(true)
    requestAnimationFrame(() => video.current?.play().catch(() => {}))
  }

  const headline = data.headline || data.name
  const nightName = `Maison Sanguine ${headline.replace(/ at /, ', ')}`

  return (
    <div ref={box} className={`ms-in is-${stage}`} role="dialog" aria-modal="true" aria-labelledby="ms-in-t">
      <h2 className="ms-in__big" id="ms-in-t" aria-label="You're in">
        <span className="ms-in__line"><span>You&apos;re</span></span>
        <span className="ms-in__line ms-it"><span>in</span></span>
      </h2>


      <div className="ms-in__body" aria-hidden={stage !== 'content'}>
        <div className="ms-in__logo ms-in__rise" style={{ ['--d' as string]: '0s' }}>
          <img src={data.logo || MS_LOGO} alt="Maison Sanguine" />
        </div>

        <p className="ms-in__text ms-in__rise" style={{ ['--d' as string]: '.15s' }}>
          Thank you for your reservation for {nightName}. We are delighted to welcome you very soon.
          All the details of your night have been sent to you by email, and our teams remain at your
          disposal for any special request. In the meantime, we invite you to discover the inspirations
          that brought this night to life.
        </p>

        <div className={`ms-in__player ms-in__rise${playing ? ' is-playing' : ''}`} style={{ ['--d' as string]: '.3s' }}>
          {data.video ? (
            <video ref={video} src={data.video} poster={data.poster || undefined} playsInline controls={playing} preload="metadata" />
          ) : (
            data.poster ? <img src={data.poster} alt="" /> : null
          )}
          {!playing && (
            <button className="ms-in__play" type="button" aria-label="Play the film" onClick={play} disabled={!data.video}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 7.5v9l7-4.5z" /></svg>
            </button>
          )}
        </div>

        <button className="ms-gate__btn ms-in__btn ms-in__rise" type="button" style={{ ['--d' as string]: '.45s' }} onClick={onClose}>Continue</button>
      </div>
    </div>
  )
}
