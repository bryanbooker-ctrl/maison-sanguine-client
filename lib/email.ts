import { siteUrl } from './supabase-server'

const FROM = process.env.EMAIL_FROM || 'Maison Sanguine <guestrelations@maisonsanguine.com>'

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function layout(title: string[], paragraphs: string[], cta?: { label: string; href: string }, extra = '') {
  const t = title.map((l, i) => `<div style="${i ? 'font-style:italic;font-weight:300;' : ''}">${esc(l)}</div>`).join('')
  const p = paragraphs.map(x => `<p style="margin:0 0 18px;font-size:15px;line-height:1.5;font-weight:300;color:#ffffff;">${x}</p>`).join('')
  const b = cta ? `<a href="${cta.href}" style="display:inline-block;margin-top:18px;padding:18px 36px;background:#ffffff;color:#000000;text-decoration:none;font-size:15px;font-weight:500;">${esc(cta.label)}</a>` : ''
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#000000;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#000000;"><tr><td align="center" style="padding:56px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ffffff;">
<tr><td style="padding-bottom:56px;font-size:13px;letter-spacing:.3em;text-transform:uppercase;">Maison Sanguine</td></tr>
<tr><td style="padding-bottom:36px;font-size:34px;line-height:1.05;font-weight:200;letter-spacing:-0.03em;text-transform:uppercase;">${t}</td></tr>
<tr><td>${p}${extra}${b}</td></tr>
<tr><td style="padding-top:64px;font-size:12px;line-height:1.5;color:rgba(255,255,255,.5);">Maison Sanguine will never request payments, passwords, or confidential information through unofficial channels.</td></tr>
</table></td></tr></table></body></html>`
}

export async function sendEmail(to: string | string[], subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) return { skipped: true }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to, subject, html }),
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
}
