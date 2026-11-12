// s3_zone.mjs — 12 Nov 2026, staging (browser in Asia/Karachi, Rule 125; proved with Intl): which day does the SCREEN show for a document
// whose day differs by time zone, and does the bucket agree with the shown Due Date (PRD v11 S1-R5a)? A/R Detail, as of 11/12/2026:
//  S2-17154 (Heavy Duty, Asia/Karachi; due 12 Oct 21:56 UTC = 13 Oct Karachi)  CM3-4400 (Lethbridge, America/Edmonton; due 22 Sep 00:00 UTC
//  = 21 Sep Edmonton)  CM1-4535 (DVI Test, Pacific/Fiji; due 28 Oct 18:44 UTC = 29 Oct Fiji). Plus A/R Collection "E2E Credits Customer":
//  the Past Due shown for P3-2458 (due 11 Nov 19:01 UTC). Output s3/out.json + pictures.
import { stgStart } from './stglib.mjs'; import { mkFilt } from '../exec/filt.mjs'; import { mkSort } from '../exec/sortlib.mjs'; import fs from 'fs';
const OUT = new URL('./s3/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const F = mkFilt(p); const S = mkSort(p);
const o = {}; const rows = () => p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((tr) => tr.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean));
const box = (src) => p.evaluate((src) => { const tr = [...document.querySelectorAll('main tbody tr')].find((t) => t.innerText.includes(src)); if (!tr) return null; tr.scrollIntoView({ block: 'center' }); const r = tr.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }, src);
const esc = (t) => t.replace(/[-()]/g, (c) => '\\' + c);
await s.go('/reports/ar-aging-detail'); o.browserZone = await p.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone); o.browserNow = await p.evaluate(() => new Date().toString());
for (const [tag, cust, bucket, doc] of [['hd', 'Desert Edge Truck Service', '1-30 days past due', 'S2-17154'], ['leth', 'ZZAUTOTEST SV-9647 Credit Split BEFORE', '31-60 days past due', 'CM3-4400'], ['fiji', 'ZZAUTOTEST Dash A1', '1-30 days past due', 'CM1-4535']]) {
  const q = (o[tag] = {}); try { await s.go('/reports/ar-aging-detail'); await p.waitForTimeout(3000); await F.pick('Customer', cust); await p.waitForTimeout(2500); q.exp = await S.expand(new RegExp('^' + esc(bucket) + ' \\(')); await p.waitForTimeout(3500);
    for (let i = 0; i < 6 && !(await box(doc)); i++) { await p.mouse.wheel(0, 900); await p.waitForTimeout(1500); }
    q.row = (await rows()).find((r) => r.includes(doc + ' ')); await box(doc); await p.waitForTimeout(700); q.box = await box(doc); q.pic = await s.shot(tag); } catch (e) { q.err = String(e).slice(0, 200); await s.shot(tag + '-error'); } }
{ const q = (o.coll = {}); try { await s.go('/reports/ar-aging-collection'); await p.waitForTimeout(3000); await F.pick('Customer', 'E2E Credits Customer'); await p.waitForTimeout(3000); q.exp = await S.expand(/^E2E Credits Customer/); await p.waitForTimeout(3500);
  q.heads = await p.evaluate(() => [...document.querySelectorAll('main thead th')].map((t) => t.innerText.replace(/\s+/g, ' ').trim()));
  for (let i = 0; i < 12 && !(await box('P3-2458')); i++) { await p.mouse.wheel(0, 1200); await p.waitForTimeout(1500); }
  q.rows = (await rows()).filter((r) => /P3-245|P3-246|CM3-453/.test(r)); await box('P3-2458'); await p.waitForTimeout(700); q.box = await box('P3-2458'); q.pic = await s.shot('coll'); } catch (e) { q.err = String(e).slice(0, 200); await s.shot('coll-error'); } }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 3500)); await s.close(); process.exit(0);
