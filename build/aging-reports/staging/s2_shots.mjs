// s2_shots.mjs — 12 Nov 2026, staging after the release: pictures for C715471/C715472. (a) each of the six reports opened from the Reports
// menu untouched: As of / Location chips, the Totals row, a picture; (b) evidence rows: A/R Detail for "ZZAUTOTEST SV11315 Staging CM"
// (CM2-4541 in Current), "E2E Credits Customer" and "Tucson Truck Center" (the documents counted a day younger), A/P Detail for
// "ZZAUTOTEST SV11315 Staging VC" (C-13911 in Current, Past Due 0). The QA lead's session only — no sign-in, no location change (stglib).
import { stgStart } from './stglib.mjs'; import { mkFilt } from '../exec/filt.mjs'; import fs from 'fs';
const OUT = new URL('./s2/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const F = mkFilt(p); const o = {};
const R = { ars: 'ar-aging-summary', ard: 'ar-aging-detail', arc: 'ar-aging-collection', aps: 'ap-aging-summary', apd: 'ap-aging-detail', apu: 'ap-unpaid-invoices' };
const rows = () => p.evaluate(() => [...document.querySelectorAll('main tbody tr, main tfoot tr')].map((tr) => tr.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean));
const box = (re) => p.evaluate((src) => { const re = new RegExp(src); const tr = [...document.querySelectorAll('main tr')].find((t) => re.test(t.innerText)); if (!tr) return null; const r = tr.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }, re.source);
for (const [k, slug] of Object.entries(R)) { try { await s.go('/reports/' + slug); await p.waitForTimeout(4000); const r = await rows();
  o[k] = { url: p.url(), chips: await F.chips(), totals: r.find((t) => /^Totals?\b/.test(t)) || r.at(-1), first: r.slice(0, 3), totBox: await box(/^\s*Totals?\b/), chipBox: await p.evaluate(() => { const b = [...document.querySelectorAll('main button')].find((x) => /Location:/.test(x.innerText)); if (!b) return null; const r = b.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }) };
  o[k].pic = await s.shot(k + '-untouched'); } catch (e) { o[k] = { err: String(e).slice(0, 200) }; } }
async function ev(tag, slug, kind, name, re) { const q = (o[tag] = {}); try { await s.go('/reports/' + slug); await p.waitForTimeout(3500); await F.pick(kind, name); await p.waitForTimeout(3000); q.chips = await F.chips(); q.rows = await rows(); q.box = await box(re); q.pic = await s.shot(tag); } catch (e) { q.err = String(e).slice(0, 200); await s.shot(tag + '-error'); } }
await ev('ev-cm', R.ard, 'Customer', 'ZZAUTOTEST SV11315 Staging CM', /CM2-4541/);
await ev('ev-e2e', R.ard, 'Customer', 'E2E Credits Customer', /P3-2458/);
await ev('ev-tucson', R.ard, 'Customer', 'Tucson Truck Center', /S3-17147/);
await ev('ev-vc', R.apd, 'Vendor', 'ZZAUTOTEST SV11315 Staging VC', /C-13911/);
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
console.log(JSON.stringify(Object.fromEntries(Object.entries(o).map(([k, v]) => [k, { chips: v.chips, totals: v.totals, err: v.err, rows: v.rows?.slice(0, 14) }]))).slice(0, 5000)); await s.close(); process.exit(0);
