import { ASPEN_EVENT_HTML } from '../app/site/aspen-event'
import { NEWYORK_EVENT_HTML, TROPEZ_EVENT_HTML, PARIS_EVENT_HTML, STBARTH_EVENT_HTML } from '../app/site/night-events'

type Row = [string, string | string[]]
type Sec = { rows?: Row[]; groups?: { h: string; rows: Row[] }[] }

const PAGES: Record<string, string> = {
  aspen: ASPEN_EVENT_HTML,
  newyork: NEWYORK_EVENT_HTML,
  tropez: TROPEZ_EVENT_HTML,
  paris: PARIS_EVENT_HTML,
  stbarth: STBARTH_EVENT_HTML,
}

const SKIP = /^(Arrival|Application)$/
const clean = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
const take = (h: string, re: RegExp) => [...h.matchAll(re)].map(m => m[1])

function value(h: string): string | string[] {
  const m = h.match(/^([^<]*)<small[^>]*>([^<]*)<\/small>/)
  if (!m) return clean(h)
  const a = clean(m[1])
  const b = clean(m[2])
  return /^m²$/.test(b) ? a + ' ' + b : [a, b]
}

function section(html: string, i: number): Sec {
  const parts = html.split('<section class="ms-dt')
  const blk = parts[i + 1]
  if (!blk) return { rows: [] }
  const rows: Row[] = []
  const d = blk.match(/<div class="ms-dt__desc">([\s\S]*?)<\/div>/)
  if (d) rows.push(['', clean(d[1])])
  for (const m of blk.matchAll(/<div class="ms-dt__k">([\s\S]*?)<\/div><div class="ms-dt__v">([\s\S]*?)<\/div><\/div>/g)) rows.push([clean(m[1]), value(m[2])])
  return { rows }
}

function specs(html: string): Sec {
  const sp = html.slice(html.indexOf('<section class="ms-sp">'))
  const end = sp.indexOf('</section>')
  const body = sp.slice(0, end)
  const groups: { h: string; rows: Row[] }[] = []
  for (const g of body.split('<div class="ms-sp__group').slice(1)) {
    const h = g.match(/<div class="ms-sp__h">([\s\S]*?)<\/div>/)
    if (!h) continue
    const rows: Row[] = []
    for (const m of g.matchAll(/<div><div class="ms-sp__k">([\s\S]*?)<\/div>((?:<div class="ms-sp__v[^"]*">[\s\S]*?<\/div>)+)<\/div>/g)) {
      const vs = take(m[2], /<div class="ms-sp__v[^"]*">([\s\S]*?)<\/div>/g).map(clean)
      rows.push([clean(m[1]), vs.length > 1 ? vs : vs[0]])
    }
    const d = g.match(/<div class="ms-sp__desc">([\s\S]*?)<\/div>/)
    if (d) rows.push(['', clean(d[1])])
    if (!SKIP.test(clean(h[1]))) groups.push({ h: clean(h[1]), rows })
  }
  return { groups }
}

export function withNightPages(html: string): string {
  return html.replace(/(<script type="application\/json" id="ms-collection-data">)([\s\S]*?)(<\/script>)/, (_, a: string, json: string, z: string) => {
    const d = JSON.parse(json)
    for (const n of d.nights) {
      const p = PAGES[n.id]
      if (p) n.sec = [section(p, 0), section(p, 1), section(p, 2), specs(p)]
    }
    return a + JSON.stringify(d) + z
  })
}
