import { siteUrl } from './supabase-server'

const FROM = process.env.EMAIL_FROM || 'Maison Sanguine <guestrelations@maisonsanguine.com>'

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const FOOT_EN = 'Maison Sanguine will never request payments, passwords, or confidential information through unofficial channels.'
const FOOT_FR = 'Maison Sanguine ne demandera jamais de paiement, de mot de passe ou d\'informations confidentielles par des canaux non officiels.'

function layout(title: string[], paragraphs: string[], cta?: { label: string; href: string }, extra = '', after = '', foot = FOOT_EN) {
  const t = title.map((l, i) => `<div style="${i ? 'font-style:italic;font-weight:300;' : ''}">${esc(l)}</div>`).join('')
  const p = paragraphs.map(x => `<p style="margin:0 0 18px;font-size:15px;line-height:1.5;font-weight:300;color:#ffffff;">${x}</p>`).join('')
  const b = cta ? `<a href="${cta.href}" style="display:inline-block;margin-top:18px;padding:18px 36px;background:#ffffff;color:#000000;text-decoration:none;font-size:15px;font-weight:500;">${esc(cta.label)}</a>` : ''
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#000000;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#000000;"><tr><td align="center" style="padding:56px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ffffff;">
<tr><td style="padding-bottom:56px;font-size:13px;letter-spacing:.3em;text-transform:uppercase;">Maison Sanguine</td></tr>
<tr><td style="padding-bottom:36px;font-size:34px;line-height:1.05;font-weight:200;letter-spacing:-0.03em;text-transform:uppercase;">${t}</td></tr>
<tr><td>${p}${extra}${b}${after}</td></tr>
<tr><td style="padding-top:64px;font-size:12px;line-height:1.5;color:rgba(255,255,255,.5);">${foot}</td></tr>
</table></td></tr></table></body></html>`
}

export async function sendEmail(to: string | string[], subject: string, html: string, replyTo?: string, attachments?: { filename: string; content: string }[]) {
  if (!process.env.RESEND_API_KEY) return { skipped: true }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}), ...(attachments && attachments.length ? { attachments } : {}) }),
  })
  return { ok: res.ok }
}

export const emails = {
  received(edition: string, firstName: string) {
    return layout(
      ['Request', 'received'],
      [
        firstName ? `Dear ${esc(firstName)},` : 'Hello,',
        `Thank you for your interest in ${esc(edition)}. Our selection committee will review your request and come back to you personally by email.`,
        'You can follow your request at any time from your MS Account.',
      ],
      { label: 'My MS Account', href: `${siteUrl()}/dashboard?tab=experiences` }
    )
  },
  bookingReceived(masterclass: string, firstName: string) {
    return layout(
      ['Booking', 'received'],
      [
        firstName ? `Dear ${esc(firstName)},` : 'Hello,',
        `Thank you for booking ${esc(masterclass)}. Our team will confirm your booking by email, and you will then be able to complete your payment from your MS Account.`,
        'You can follow your booking at any time from your MS Account.',
      ],
      { label: 'My MS Account', href: `${siteUrl()}/dashboard?tab=experiences` }
    )
  },
  contactNew(a: Record<string, string>) {
    const rows = Object.entries(a).filter(([, v]) => v).map(([k, v]) => `<div style="font-size:14px;line-height:1.6;color:#ffffff;white-space:pre-wrap;"><span style="color:rgba(255,255,255,.5);">${esc(k)}</span> ${esc(v)}</div>`).join('')
    return layout(['New contact', 'message'], [], undefined, rows)
  },
  applicationNew(job: string, rows: [string, string][]) {
    const html = rows.filter(([, v]) => v).map(([k, v]) => `<div style="font-size:14px;line-height:1.6;color:#ffffff;white-space:pre-wrap;"><span style="color:rgba(255,255,255,.5);">${esc(k)}</span> ${esc(v)}</div>`).join('')
    return layout(['New', 'application'], [esc(job)], undefined, html)
  },
  applicationReceived(firstName: string, job: string, link: string, lang = 'en') {
    const fr = lang === 'fr'
    const note = (t: string) => `<p style="margin:28px 0 0;font-size:13px;line-height:1.5;font-weight:300;color:rgba(255,255,255,.55);">${t}</p>`
    const sign = fr ? 'Cordialement,' : 'Kind regards,'
    const team = fr ? 'L\'Équipe Recrutement, Maison Sanguine' : 'The Recruitment Team, Maison Sanguine'
    return layout(
      fr ? ['Candidature', 'reçue'] : ['Application', 'received'],
      fr ? [
        firstName ? `Bonjour ${esc(firstName)},` : 'Bonjour,',
        `Nous vous remercions pour votre candidature au poste de ${esc(job)} et de l'intérêt que vous portez à Maison Sanguine.`,
        'Nous examinons votre demande avec le plus grand soin et vous remercions pour votre patience. Nous reviendrons vers vous dans les meilleurs délais.',
        'Vous pouvez suivre l\'avancement de votre candidature à tout moment depuis votre espace de suivi.',
        sign,
        `<strong style="font-weight:500;">${team}</strong>`,
      ] : [
        firstName ? `Hello ${esc(firstName)},` : 'Hello,',
        `Thank you for your application for the position of ${esc(job)} and for your interest in Maison Sanguine.`,
        'We are reviewing your application with the greatest care and thank you for your patience. We will come back to you as soon as possible.',
        'You can follow the progress of your application at any time from your tracking space.',
        sign,
        `<strong style="font-weight:500;">${team}</strong>`,
      ],
      link ? { label: fr ? 'Accéder à ma candidature' : 'Access my application', href: link } : undefined,
      '',
      note(fr ? 'Si vous n\'êtes pas à l\'origine de cette candidature, vous pouvez ignorer ce message.' : 'If you did not submit this application, you can ignore this message.') +
        note(fr ? 'Merci de ne pas partager ni transférer ce message, il concerne spécifiquement votre candidature.' : 'Please do not share or forward this message, it concerns your application specifically.'),
      fr ? FOOT_FR : FOOT_EN
    )
  },
  trackCode(code: string, lang = 'en') {
    const fr = lang === 'fr'
    const box = `<div style="margin:8px 0 26px;font-size:38px;line-height:1;font-weight:200;letter-spacing:.32em;color:#ffffff;">${esc(code)}</div>`
    return layout(
      fr ? ['Votre', 'code'] : ['Your', 'code'],
      fr ? ['Bonjour,', 'Voici votre code à usage unique pour accéder au suivi de votre candidature :'] : ['Hello,', 'Here is your one-time code to access the tracking of your application:'],
      undefined,
      box + `<p style="margin:0 0 18px;font-size:15px;line-height:1.5;font-weight:300;color:#ffffff;">${fr ? 'Ce code expire 5 minutes après son envoi.' : 'This code expires 5 minutes after it was sent.'}</p><p style="margin:0;font-size:13px;line-height:1.5;font-weight:300;color:rgba(255,255,255,.55);">${fr ? 'Si vous n\'êtes pas à l\'origine de cette demande, vous pouvez ignorer ce message. Merci de ne partager ce code avec personne.' : 'If you did not request this code, you can ignore this message. Please do not share this code with anyone.'}</p>`,
      '',
      fr ? FOOT_FR : FOOT_EN
    )
  },
  applicationStatus(firstName: string, job: string, status: string, link: string, lang = 'en') {
    const fr = lang === 'fr'
    const T: Record<string, [string, string]> = {
      review: [
        `Votre candidature au poste de ${esc(job)} est désormais en cours d'évaluation par notre équipe.`,
        `Your application for the position of ${esc(job)} is now being reviewed by our team.`,
      ],
      interview: [
        `Votre candidature au poste de ${esc(job)} a retenu notre attention. Nous vous contacterons très prochainement afin d'organiser un entretien.`,
        `Your application for the position of ${esc(job)} has caught our attention. We will contact you shortly to arrange an interview.`,
      ],
      offer: [
        `Bonne nouvelle : une offre vous a été soumise pour le poste de ${esc(job)}. Retrouvez-en le suivi dans votre espace.`,
        `Good news: an offer has been submitted to you for the position of ${esc(job)}. You can follow it from your tracking space.`,
      ],
      declined: [
        `Après un examen attentif, nous ne donnerons pas suite à votre candidature au poste de ${esc(job)}. Nous vous remercions sincèrement de l'intérêt que vous portez à Maison Sanguine et vous souhaitons le meilleur pour la suite.`,
        `After careful consideration, we will not be moving forward with your application for the position of ${esc(job)}. We sincerely thank you for your interest in Maison Sanguine and wish you every success.`,
      ],
    }
    const t = T[status] || T.review
    return layout(
      fr ? ['Mise à jour', 'de votre candidature'] : ['Application', 'update'],
      [firstName ? (fr ? `Bonjour ${esc(firstName)},` : `Hello ${esc(firstName)},`) : (fr ? 'Bonjour,' : 'Hello,'), fr ? t[0] : t[1],
        fr ? 'Cordialement,' : 'Kind regards,', `<strong style="font-weight:500;">${fr ? 'L\'Équipe Recrutement, Maison Sanguine' : 'The Recruitment Team, Maison Sanguine'}</strong>`],
      link ? { label: fr ? 'Accéder à ma candidature' : 'Access my application', href: link } : undefined,
      '',
      '',
      fr ? FOOT_FR : FOOT_EN
    )
  },
  contactReceived(firstName: string) {
    return layout(
      ['Message', 'received'],
      [
        firstName ? `Dear ${esc(firstName)},` : 'Hello,',
        'Thank you for contacting Maison Sanguine. Our Guest Relations team has received your message and will come back to you personally.',
      ]
    )
  },
  adminNew(a: Record<string, string | number | null>) {
    const rows = Object.entries(a).filter(([, v]) => v !== null && v !== '').map(([k, v]) => `<div style="font-size:14px;line-height:1.6;color:#ffffff;"><span style="color:rgba(255,255,255,.5);">${esc(k)}</span> ${esc(String(v))}</div>`).join('')
    return layout(['New admission', 'request'], [], { label: 'Review requests', href: `${siteUrl()}/admin` }, rows)
  },
  accepted(edition: string, firstName: string, code: string, payHref: string | null) {
    return layout(
      ["You're", 'in'],
      [
        firstName ? `Dear ${esc(firstName)},` : 'Hello,',
        `Our selection committee is delighted to confirm your admission to ${esc(edition)}.`,
        payHref
          ? 'To secure your place, please complete your reservation. You will first be asked to verify your identity with an official ID, then to proceed to payment.'
          : 'Your reservation is confirmed. All the details of your night are now available in your MS Account.',
        `Your invitation code: <strong style="font-weight:500;letter-spacing:.08em;">${esc(code)}</strong><br><span style="color:rgba(255,255,255,.5);">This unique code certifies the authenticity of your invitation.</span>`,
      ],
      { label: payHref ? 'Complete my reservation' : 'My MS Account', href: payHref || `${siteUrl()}/dashboard?tab=experiences` }
    )
  },
  declined(edition: string, firstName: string) {
    return layout(
      ['Your', 'request'],
      [
        firstName ? `Dear ${esc(firstName)},` : 'Hello,',
        `Thank you for your interest in ${esc(edition)}. After careful consideration, our selection committee is unable to extend an invitation for this edition.`,
        'We would be delighted to consider your request for a future night of the Season.',
      ],
      { label: 'Discover the Season', href: 'https://maisonsanguine.com/night-collection' }
    )
  },
  tourConfirmed(firstName: string, t: { date: string; slot: string; language: string; places: number }) {
    const rows = [['Date', t.date], ['Time', t.slot], ['Language', t.language], ['Guests', String(t.places)]]
      .map(([k, v]) => `<div style="font-size:15px;line-height:1.7;color:#ffffff;"><span style="color:rgba(255,255,255,.5);">${esc(k)}</span>&nbsp;&nbsp;${esc(v)}</div>`).join('')
    return layout(
      ['Your visit', 'is confirmed'],
      [
        firstName ? `Dear ${esc(firstName)},` : 'Hello,',
        'Your guided tour of the Maison Sanguine Studio is confirmed. We recommend arriving ten minutes before the start of your tour, and our team will send you the access details before your visit.',
      ],
      undefined,
      `<div style="margin:8px 0 18px;">${rows}</div>`
    )
  },
  adminTour(a: Record<string, string | number | null>) {
    const rows = Object.entries(a).filter(([, v]) => v !== null && v !== '').map(([k, v]) => `<div style="font-size:14px;line-height:1.6;color:#ffffff;"><span style="color:rgba(255,255,255,.5);">${esc(k)}</span> ${esc(String(v))}</div>`).join('')
    return layout(['New Studio', 'visit'], [], undefined, rows)
  },
  masterclassConfirmed(firstName: string, t: { name: string; date: string; time: string; language: string; places: number }) {
    const rows = [['Masterclass', t.name], ['Date', t.date], ['Time', t.time], ['Language', t.language], ['Places', String(t.places)]]
      .map(([k, v]) => `<div style="font-size:15px;line-height:1.7;color:#ffffff;"><span style="color:rgba(255,255,255,.5);">${esc(k)}</span>&nbsp;&nbsp;${esc(v)}</div>`).join('')
    return layout(
      ['Your masterclass', 'is confirmed'],
      [
        firstName ? `Dear ${esc(firstName)},` : 'Hello,',
        'Your booking is confirmed and your payment has been received. We recommend arriving ten minutes before the start of your masterclass, and our team will send you the access details before the day.',
      ],
      undefined,
      `<div style="margin:8px 0 18px;">${rows}</div>`
    )
  },
  adminMasterclass(a: Record<string, string | number | null>) {
    const rows = Object.entries(a).filter(([, v]) => v !== null && v !== '').map(([k, v]) => `<div style="font-size:14px;line-height:1.6;color:#ffffff;"><span style="color:rgba(255,255,255,.5);">${esc(k)}</span> ${esc(String(v))}</div>`).join('')
    return layout(['New masterclass', 'booking'], [], undefined, rows)
  },
  confirmed(edition: string, firstName: string) {
    return layout(
      ['Your night', 'is confirmed'],
      [
        firstName ? `Dear ${esc(firstName)},` : 'Hello,',
        `Your reservation for ${esc(edition)} is confirmed. All the details of your night are now available in your MS Account.`,
      ],
      { label: 'My MS Account', href: `${siteUrl()}/dashboard?tab=experiences` }
    )
  },
  newsletter(firstName: string) {
    return layout(
      ['Thank you', 'for subscribing'],
      [
        firstName ? `Dear ${esc(firstName)},` : 'Hello,',
        'You will soon receive the latest news from Maison Sanguine: the nights of the Season, our experiences and upcoming events.',
      ],
      { label: 'Discover the Season', href: 'https://maisonsanguine.com/night-collection' }
    )
  },
  pressReceived(firstName: string) {
    return layout(
      ['Request', 'received'],
      [
        firstName ? `Dear ${esc(firstName)},` : 'Hello,',
        'Thank you for your interest in Maison Sanguine. Your pressroom access request has been sent to our Media Relations team.',
        'You will receive an answer by email once your request has been reviewed.',
      ]
    )
  },
  pressNew(a: Record<string, string>) {
    const rows = Object.entries(a).filter(([, v]) => v).map(([k, v]) => `<div style="font-size:14px;line-height:1.6;color:#ffffff;"><span style="color:rgba(255,255,255,.5);">${esc(k)}</span> ${esc(v)}</div>`).join('')
    return layout(['New pressroom', 'request'], [], undefined, rows)
  },
}
