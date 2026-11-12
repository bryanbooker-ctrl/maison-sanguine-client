// Collects every visible English text of the site into messages/en.json.
// Run after changing site texts:  node scripts/i18n-extract.mjs
// Then translate the new keys in messages/<lang>.json (missing keys fall back to English).
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const SITE = path.join(ROOT, 'app/site')
const OUT = path.join(ROOT, 'messages')

const norm = s => s.replace(/\s+/g, ' ').trim()
function textKey(s) {
  let h = 0x811c9dc5
  const t = norm(s)
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0 }
  return h.toString(36).padStart(7, '0')
}

const SKIP_KEYS = /^(href|url|link|src|id|key|slug|img|image|images|video|poster|lat|lng|type|date|start|end|code|icon|color|cat|category|tag|value|mode|ratio|cls|class|ext|lang|locale|country|currency|tz|time|map|zoom|style|sort|order|layout|variant|kind|status|email|phone|tel)$/i
const JS_DENY = new Set(['Escape', 'Enter', 'Tab', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'DOMContentLoaded', 'IntersectionObserver', 'Content-Type', 'MS', 'use strict'])

function isText(s) {
  const v = norm(s)
  if (!v || !/[A-Za-z]/.test(v)) return false
  if (/^(https?:|mailto:|tel:|\/|#|data:|www\.)/i.test(v)) return false
  if (/^[a-z0-9_.:-]+$/.test(v) && !/ /.test(v)) return false
  if (/^[A-Z]{1,3}$/.test(v)) return false
  if (/^#[0-9a-f]{3,8}$/i.test(v)) return false
  if (/^\d{4}-\d{2}-\d{2}|^T\d{2}:/.test(v)) return false
  if (/^[A-Za-z0-9_-]{28,}$/.test(v)) return false
  if (/="|\.(ms|ma|hj)-|^main h\d/.test(v)) return false
  return true
}

function looksLikeUiString(s) {
  const v = norm(s)
  if (JS_DENY.has(v) || !isText(v)) return false
  if (/[{}();=<>$|\\]|^[.#[]|\b(px|rgba?|var|vw|vh|calc)\b|^(ms|ma|hj|is|has)-|--/.test(v)) return false
  if (/^[a-z]+[A-Z]/.test(v)) return false
  if (/^[A-Z]+$/.test(v)) return false
  if (/^[A-Z][a-z]+[A-Z]/.test(v) && !/ /.test(v)) return false
  if (/[a-z]\.[a-z]/i.test(v) && !/ /.test(v)) return false
  return /^[A-Z]/.test(v) || / [a-z]/.test(v) || /^[a-z]+ /.test(v)
}

const store = {}
function add(ns, s, force = false) {
  const v = norm(s)
  if (!v || (!force && !isText(v))) return
  ;(store[ns] ||= {})[textKey(v)] = v
}

function walkData(ns, v, k = '') {
  if (typeof v === 'string') { if (!SKIP_KEYS.test(k)) add(ns, v); return }
  if (Array.isArray(v)) { v.forEach(x => walkData(ns, x, k)); return }
  if (v && typeof v === 'object') for (const [kk, vv] of Object.entries(v)) walkData(ns, vv, kk)
}

function fromJs(ns, code) {
  for (const m of code.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"/g)) {
    const body = m[1] ?? m[2]
    if (!body || /\\/.test(body)) continue
    if (body.includes('<')) {
      for (const a of body.matchAll(ATTRS)) add(ns, a[1])
      const lead = body.match(/^([^<>"=]+)(?=<)/)
      if (lead && looksLikeUiString(lead[1])) add(ns, lead[1])
      for (const x of body.matchAll(/>([^<>]+)(?=<|$)/g)) if (/[A-Za-z]{2}/.test(x[1])) add(ns, x[1])
      continue
    }
    if (looksLikeUiString(body)) add(ns, body)
  }
}

const ATTRS = /\s(?:alt|aria-label|placeholder|title|data-a|data-b|data-label)="([^"]*)"/g
function fromHtml(ns, html, fragment = false) {
  const parts = html.split(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[\s\S]*?-->|<[^>]+>)/g)
  for (const p of parts) {
    if (!p) continue
    if (p.startsWith('<script')) {
      const m = p.match(/^(<script\b[^>]*>)([\s\S]*?)(<\/script>)$/)
      if (/type=["']application\/(?:ld\+)?json["']/.test(m[1])) { try { walkData(ns, JSON.parse(m[2])) } catch {} }
      else fromJs(ns, m[2])
      continue
    }
    if (p.startsWith('<style') || p.startsWith('<!--')) continue
    if (p.startsWith('<')) { for (const a of p.matchAll(ATTRS)) add(ns, a[1]); continue }
    if (fragment && !/[A-Za-z]{2}/.test(p)) continue
    add(ns, p)
  }
}

async function scanModule(file) {
  const ns = path.relative(SITE, file).replace(/\.ts$/, '').replace(/[\\/]/g, '-')
  const mod = await import(pathToFileURL(file).href)
  for (const [name, val] of Object.entries(mod)) {
    if (/CSS$/.test(name)) continue
    if (Array.isArray(val) && val.every(v => typeof v === 'string')) { val.forEach(c => fromJs(ns, c)); continue }
    if (typeof val === 'string') { if (/APP|SCRIPT/.test(name)) fromJs(ns, val); else fromHtml(ns, val); continue }
    if (val && typeof val === 'object') walkData(ns, val)
  }
}

function scanPages(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) { if (e.name !== 'api') scanPages(p); continue }
    if (!/^(page|layout)\.tsx$/.test(e.name)) continue
    const src = fs.readFileSync(p, 'utf8')
    for (const m of src.matchAll(/\b(?:title|description):\s*'((?:[^'\\]|\\.)*)'/g)) add('meta', m[1].replace(/\\'/g, "'"))
    for (const m of src.matchAll(/\bh1="([^"]*)"/g)) add('meta', m[1])
  }
}

const ACCOUNT = ['app/dashboard/page.tsx', 'app/dashboard/YoureIn.tsx', 'app/dashboard/invitation/page.tsx', 'app/auth/login/page.tsx', 'app/auth/signup/page.tsx', 'app/request/page.tsx']
function scanAccount() {
  for (const rel of ACCOUNT) {
    const p = path.join(ROOT, rel)
    if (!fs.existsSync(p)) continue
    const src = fs.readFileSync(p, 'utf8')
    for (const m of src.matchAll(/>([^<>{}]+)</g)) {
      const v = m[1].replace(/&apos;/g, "'").replace(/&amp;/g, '&')
      if (/[A-Za-z]{2}/.test(v) && !/=>|&&|\|\||[()=;]/.test(v)) add('account', v)
    }
    for (const m of src.matchAll(/(?:placeholder|aria-label|title|alt)="([^"]+)"/g)) add('account', m[1])
    for (const m of src.matchAll(/'((?:[^'\\\n])*)'/g)) if (looksLikeUiString(m[1]) && !/^(use client|next\/|@\/|react)/.test(m[1]) && !/^[a-z_]+(, [a-z_]+)+$/.test(m[1]) && m[1] !== 'Backspace') add('account', m[1])
  }
}

const files = []
for (const d of [SITE, path.join(SITE, 'legal')]) for (const f of fs.readdirSync(d)) if (f.endsWith('.ts')) files.push(path.join(d, f))
for (const f of files.sort()) await scanModule(f)
scanPages(path.join(ROOT, 'app'))
scanAccount()

const extra = path.join(OUT, 'extra.en.json')
if (fs.existsSync(extra)) for (const [ns, list] of Object.entries(JSON.parse(fs.readFileSync(extra, 'utf8')))) list.forEach(s => add(ns, s, true))

const sorted = Object.fromEntries(Object.keys(store).sort().map(ns => [ns, store[ns]]))
fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, 'en.json'), JSON.stringify(sorted, null, 2) + '\n')

for (const f of fs.readdirSync(OUT)) {
  if (!/^[a-z]{2}\.json$/.test(f) || f === 'en.json') continue
  const tr = JSON.parse(fs.readFileSync(path.join(OUT, f), 'utf8'))
  let missing = 0, total = 0
  for (const ns of Object.keys(sorted)) for (const k of Object.keys(sorted[ns])) { total++; if (!tr[ns]?.[k]) missing++ }
  console.log(f + ': ' + (total - missing) + '/' + total + ' translated')
}
console.log('en.json: ' + Object.values(sorted).reduce((n, o) => n + Object.keys(o).length, 0) + ' texts')
