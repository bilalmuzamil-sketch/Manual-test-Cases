// s4_pastdue.mjs — 12 Nov 2026, staging (browser Asia/Karachi): pictures of a shown Due Date and the Past Due counted beside it, as of 11/12/2026:
// A/R Collection "Tucson Truck Center" (S3-17147, shown due Sep 12 -> 61 days by the shown date), A/P Detail "ZZSOFTHIP Traders" bucket 1-30
// (ZZSH-O_TYPO, shown due Nov 1 -> 11 days), A/P Unpaid Invoices "ZZSOFTHIP Traders". Output s4/out.json + pictures.
import { stgStart } from './stglib.mjs'; import { mkFilt } from '../exec/filt.mjs'; import { mkSort } from '../exec/sortlib.mjs'; import fs from 'fs';
const OUT = new URL('./s4/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const F = mkFilt(p); const S = mkSort(p); const o = {};
const rows = () => p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((tr) => tr.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean));
const box = (src) => p.evaluate((src) => { const tr = [...document.querySelectorAll('main tbody tr')].find((t) => t.innerText.includes(src)); if (!tr) return null; tr.scrollIntoView({ block: 'center' }); const r = tr.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }, src);
const heads = () => p.evaluate(() => [...document.querySelectorAll('main thead th')].map((t) => t.innerText.replace(/\s+/g, ' ').trim()));
async function ev(tag, slug, kind, name, group, doc) { const q = (o[tag] = {}); try { await s.go('/reports/' + slug); await p.waitForTimeout(3500); await F.pick(kind, name); await p.waitForTimeout(3000); q.exp = await S.expand(group); await p.waitForTimeout(3500);
  for (let i = 0; i < 8 && !(await box(doc)); i++) { await p.mouse.wheel(0, 900); await p.waitForTimeout(1500); } q.heads = await heads(); q.row = (await rows()).find((r) => r.includes(doc)); await box(doc); await p.waitForTimeout(700); q.box = await box(doc); q.pic = await s.shot(tag); } catch (e) { q.err = String(e).slice(0, 200); await s.shot(tag + '-error'); } }
await ev('arc-tucson', 'ar-aging-collection', 'Customer', 'Tucson Truck Center', /^Tucson Truck Center/, 'S3-17147');
await ev('apd-softhip', 'ap-aging-detail', 'Vendor', 'ZZSOFTHIP Traders', /^1\-30 days past due \(/, 'ZZSH-O_TYPO');
await ev('apu-softhip', 'ap-unpaid-invoices', 'Vendor', 'ZZSOFTHIP Traders', /^ZZSOFTHIP Traders/, 'ZZSH-O_TYPO');
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); for (const [k, v] of Object.entries(o)) console.log(k, JSON.stringify({ exp: v.exp, heads: v.heads, row: v.row, box: v.box, err: v.err })); await s.close(); process.exit(0);
