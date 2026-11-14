// s16d_loc_blank.mjs — 14 Nov 2026, staging (Karachi browser, 1440 px): C1145297 (A/R Detail: Location chip hides when a new as-of date leaves
// one location - location A = QB Location, whose seeded invoice of 2 Dec 2024 is the only open A/R document before 6 Jan 2025; staging has
// five locations today, so "untick location A" is done as "leave only location B (Staging Heavy Duty) ticked" to reach the test's state) and
// C1145298 / C1145299 (Summaries: blank 1-30 Days cell stays last in both sort orders; heading positions recorded). Output s16d/out.json.
import { stgStart } from './stglib.mjs'; import { mkFilt } from '../exec/filt.mjs'; import { mkSort } from '../exec/sortlib.mjs'; import { M, moved } from './m16.mjs'; import fs from 'fs';
const OUT = new URL('./s16d/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const F = mkFilt(p); const S = mkSort(p); const m = M(p); const o = {};
const rows = () => p.evaluate(() => [...document.querySelectorAll('main tbody tr, main tfoot tr')].map((t) => t.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 10));
{ const cid = 'C1145297', q = (o[cid] = {}); try { await s.go('/reports/ar-aging-detail'); await p.waitForTimeout(4000);
  await p.locator('main button', { hasText: /Location:/ }).first().click(); await p.waitForTimeout(1500); const menu = p.locator('.q-menu').last(); q.menu0 = (await menu.innerText()).split('\n').map((t) => t.trim()).filter(Boolean);
  q.opts0 = await menu.locator('.filter-panel__option').evaluateAll((es) => es.map((e) => [e.getAttribute('aria-label'), e.getAttribute('aria-checked')]));
  for (const [lab] of q.opts0) { if (!lab || /Select all|Staging Heavy Duty/.test(lab)) continue; await menu.locator(`.filter-panel__option[aria-label="${lab}"]`).first().click(); await p.waitForTimeout(900); } /* 14 Nov: while every location is on, clicking a row UNticks that row; untick every location except Staging Heavy Duty (location B) - staging has five, the test was written for two */
  q.opts1 = await menu.locator('.filter-panel__option').evaluateAll((es) => es.map((e) => [e.getAttribute('aria-label'), e.getAttribute('aria-checked')]));
  await p.keyboard.press('Escape'); await p.waitForTimeout(3000); q.chip1 = (await F.chips()).find((c) => /Location/.test(c)) || null; q.pic1 = await s.shot(cid + '-1-only-B');
  await p.locator('main button', { hasText: /As of:/ }).first().click(); await p.waitForTimeout(1200); const cal = p.locator('.q-menu').last();
  /* go back to December 2024: the year/month view of the calendar */ for (let i = 0; i < 30; i++) { const head = (await cal.innerText()).replace(/\s+/g, ' '); if (/December/.test(head) && /2024/.test(head)) break; await cal.locator('button').filter({ hasText: /chevron_left/ }).first().click(); await p.waitForTimeout(250); }
  q.calHead = (await cal.innerText()).replace(/\s+/g, ' ').slice(0, 60); await cal.locator('.q-date__calendar-item button, button').filter({ hasText: /^15$/ }).first().click(); await p.waitForTimeout(4500);
  q.chips2 = await F.chips(); q.chip2 = q.chips2.find((c) => /Location/.test(c)) || null; q.asOf2 = q.chips2.find((c) => /As of/.test(c)); q.rows2 = await rows(); q.url2 = p.url(); q.pic2 = await s.shot(cid + '-2-date-A');
  q.locList2 = await p.evaluate(async () => { const r = await fetch('https://api.staging.shopview.com/api/reporting/reports/ar-aging-detail/locations?asOfDate=2024-12-15', { credentials: 'include', headers: { Accept: 'application/json' } }); const j = await r.json().catch(() => null); return (j?.data?.collection || []).map((l) => l.name); });
} catch (e) { q.err = String(e).slice(0, 300); await s.shot(cid + '-error'); } }
async function blank(cid, slug, kind, names, head) { const q = (o[cid] = {}); try { await s.go('/reports/' + slug); await p.waitForTimeout(3500); for (const n of names) await F.pick(kind, n.slice(0, 30), n); await p.waitForTimeout(3000);
  q.chips = await F.chips(); q.rows1 = await rows(); q.heads1 = await m.heads(); q.cellC = await m.cell(names[2]); q.pic1 = await s.shot(cid + '-1');
  await S.clickTh(head); await p.waitForTimeout(3000); q.rows2 = await rows(); q.heads2 = await m.heads(); q.moved2 = moved(q.heads1, q.heads2); q.pic2 = await s.shot(cid + '-2-first-click');
  await S.clickTh(head); await p.waitForTimeout(3000); q.rows3 = await rows(); q.heads3 = await m.heads(); q.moved3 = moved(q.heads1, q.heads3); q.pic3 = await s.shot(cid + '-3-second-click');
} catch (e) { q.err = String(e).slice(0, 300); await s.shot(cid + '-error'); } }
const SC1 = `ZZAUTOTEST Special & "Quoted" 'Single' <Less> Greater> Customer One Long Name`, SV1 = `ZZAUTOTEST Special & "Quoted" 'Single' <Less> Greater> Vendor One Long Name`;
await blank('C1145298', 'ar-aging-summary', 'Customer', ['ZZAUTOTEST Blank Cell Customer A', 'ZZAUTOTEST Blank Cell Customer B', SC1], '1-30 Days');
await blank('C1145299', 'ap-aging-summary', 'Vendor', ['ZZAUTOTEST Blank Cell Vendor A', 'ZZAUTOTEST Blank Cell Vendor B', SV1], '1-30 Days');
{ const of = OUT + 'out.json'; const prev = fs.existsSync(of) ? JSON.parse(fs.readFileSync(of, 'utf8')) : {}; fs.writeFileSync(of, JSON.stringify({ ...prev, ...o }, null, 1)); }
for (const [k, q] of Object.entries(o)) console.log(k, JSON.stringify({ err: q.err, opts1: q.opts1, chip1: q.chip1, cal: q.calHead, asOf2: q.asOf2, chip2: q.chip2, loc2: q.locList2, rows2: q.rows2?.slice(0, 4), chips: q.chips?.slice(1, 2), r1: q.rows1, r2: q.rows2, r3: q.rows3, m2: q.moved2, m3: q.moved3, cellC: q.cellC && [q.cellC.lines, q.cellC.overflowsCell, q.cellC.runsIntoNext] }).slice(0, 1500));
await s.close(); process.exit(0);
