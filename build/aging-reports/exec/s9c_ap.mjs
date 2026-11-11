// s9c_ap.mjs — 11 Nov 2026: the A/P exact-amount tests on the p49 vendors (V4-V16): C715457, C715460, C715461, C715464, C715466, C797946,
// C1062588, C1062589, C715345, C715348, C715349, C715310, C715311. Built from s9b_ar.mjs (same recording). Was: more A/R exact-amount tests on the p46 customers: C797945 (R12), C715344 (R4), C715346/C715347 (R5), C715580 (R10),
// C715581 (R11, payment recorded with the call the payment screen sends), C1062580 (R13), C1062581 (makes its own invoice dated Nov 4, Net 30),
// C1062587 (R14). Same recording as s9_ar.mjs: chips, every table row, the Totals row and a picture per step; exports saved and read.
// Output exec/s9/<id>.json + pictures. ONLY=<ids>.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import { mkExp } from './explib.mjs'; import { mk } from './api.mjs'; import * as SL from './seedlib.mjs'; import { mkX } from './xseed.mjs'; import fs from 'fs';
const OUT = new URL('./s9/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const V = JSON.parse(fs.readFileSync(new URL('./p49/out.json', import.meta.url))).sets; const need = (k) => { if (!V[k]) throw new Error('no ' + k + ' vendors seeded' + (V[k + '-err'] ? ': ' + V[k + '-err'] : '')); return V[k]; };
const s = await start(OUT); const p = s.page; const F = mkFilt(p); const E = mkExp(p, OUT); const a = mk(p); const X = mkX(a, (t) => console.log(t));
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const rowsOf = (pg) => pg.evaluate(() => [...document.querySelectorAll('main tr')].map((tr) => [...tr.children].map((td) => td.innerText.replace(/\s+/g, ' ').trim()).join(' | ')).filter((t) => t.replace(/[ |]/g, '')));
const totalsOf = async (pg) => { const t = await pg.evaluate(() => [...document.querySelectorAll('main div, main tr')].filter((e) => /^Totals\b/.test(e.innerText.trim()) && e.innerText.length < 300).map((e) => e.innerText.replace(/\s+/g, ' ').trim())); return t.sort((x, y) => x.length - y.length)[0] || null; };
async function expandAll(pg) { const hb = pg.locator('main thead th').first().locator('button').first(); for (let i = 0; i < 4; i++) { const r = await rowsOf(pg); if (!r.some((x) => /keyboard_arrow_right/.test(x))) return true;
  if (await hb.count()) { await hb.hover(); await pg.waitForTimeout(600); const tip = (await pg.locator('.q-tooltip').allInnerTexts().catch(() => [])).join(' '); if (/Expand all/i.test(tip)) { await hb.click(); await pg.waitForTimeout(2500); continue; } }
  const g = pg.locator('main tr').filter({ hasText: 'keyboard_arrow_right' }).first(); if (await g.count()) { await g.locator('button, i').first().click().catch(() => {}); await pg.waitForTimeout(2000); } } return false; }
async function snap(o, label, opts = {}) { const pg = opts.page || p; const Fx = opts.F || F; if (opts.expand) o['expanded-' + label] = await expandAll(pg); await pg.waitForTimeout(800);
  const st = { label, chips: await Fx.chips(), rows: await rowsOf(pg), totals: await totalsOf(pg) }; const f = OUT + o.id + '-' + label + '.png'; await pg.screenshot({ path: f }); st.shot = f; o.steps.push(st); fs.writeFileSync(OUT + o.id + '.json', JSON.stringify(o, null, 1)); return st; }
async function exp(o, kind, tag) { const r = await E.exportAs(kind, o.id + '-' + tag, 120000); if (r.file && kind === 'PDF') { r.text = E.readPdf(r.file).split('\n').filter((l) => l.trim()).map((l) => l.replace(/\s{2,}/g, '  ').trim()); }
  if (r.file && kind === 'CSV') { r.raw = fs.readFileSync(r.file, 'utf8').split('\n'); r.csv = E.readCsv(r.file); } o.steps.push({ step: kind + '-' + tag, r: { ...r, text: r.text?.slice(0, 400), raw: r.raw?.length > 400 ? [...r.raw.slice(0, 12), '…', ...r.raw.slice(-5)] : r.raw, csv: undefined, csvN: r.csv?.length } }); return r; }
async function tab2(rep) { const p2 = await p.context().newPage(); await p2.setViewportSize({ width: 1440, height: 900 }); await p2.goto(new URL(REPORTS[rep], p.url()).href); await p2.waitForTimeout(4500); return { p2, F2: mkFilt(p2) }; }
const T = {}; const LB = 'Staging Lethbridge - 4310';
async function sortSteps(o, pairs, pg = p) { for (const [i, th] of pairs.entries()) { await pg.locator('main thead th').filter({ hasText: new RegExp('^\\s*(keyboard_arrow_\\w+\\s*)?' + th + '\\s*(arrow_drop_(up|down))?\\s*$') }).first().click(); await pg.waitForTimeout(2500); await snap(o, (i + 2) + '-' + th.replace(/\W+/g, '')); } }
for (const [id, rep] of [['C715460', 'apd'], ['C715461', 'apu']]) T[id] = async (o) => { const v = need('V6'); await s.go(REPORTS[rep]); await p.waitForTimeout(3000); await snap(o, '0-open');
  await F.pick('Vendor', v[0].name); await F.pick('Vendor', v[1].name); await snap(o, '1-AB', { expand: true });
  await F.menuClick('Past due', '31-60 days'); await snap(o, '2-3-pastdue-31-60', { expand: true }); await F.menuClick('Location', LB); await snap(o, '4-5-no-lethbridge', { expand: true });
  const q = await exp(o, 'PDF', '6-pdf'); if (q.text) o.pdfTotals = q.text.filter((l) => /^Totals?\b/.test(l)); const r = await exp(o, 'CSV', '8-csv'); if (r.csv) o.csvTotals = r.csv.filter((x) => x.some((c) => /^Totals?$/.test(c.trim()))); };
T.C715457 = async (o) => { const v = need('V6'); await s.go(REPORTS.aps); await p.waitForTimeout(3000); await snap(o, '0-open'); await F.pick('Vendor', v[0].name); await F.pick('Vendor', v[1].name); await snap(o, '1-AB');
  await F.menuClick('Location', LB); await snap(o, '2-no-lethbridge'); o.selectAllMenu = await F.menuClick('Location', 'Select all'); await snap(o, '3-select-all'); await F.menuClick('Past due', '91+ days'); await snap(o, '4-91plus');
  const q = await exp(o, 'PDF', '5-pdf'); if (q.text) o.pdfTotals = q.text.filter((l) => /^Totals?\b/.test(l)); const r = await exp(o, 'CSV', '7-csv'); if (r.csv) o.csvTotals = r.csv.filter((x) => x.some((c) => /^Totals?$/.test(c.trim()))); };
T.C715464 = async (o) => { const b = need('V8'); await s.go(REPORTS.aps); await p.waitForTimeout(3000); await F.pick('Vendor', b[0].name); await F.pick('Vendor', b[1].name); await snap(o, '1-summary-AB');
  const { p2, F2 } = await tab2('apd'); await snap(o, '2-detail-open', { page: p2, F: F2 }); await F2.pick('Vendor', b[0].name); await snap(o, '3-detail-A', { page: p2, F: F2 }); await F2.pick('Vendor', b[1].name); await snap(o, '4-detail-AB', { page: p2, F: F2 });
  await F2.menuClick('Location', LB); await snap(o, '5-detail-no-lethbridge', { page: p2, F: F2 }); await p.bringToFront(); await p.waitForTimeout(1500); await snap(o, '6-summary-again'); await F.menuClick('Location', LB); await snap(o, '7-summary-no-lethbridge'); await p2.close(); };
T.C715466 = async (o) => { const v = need('V9')[0]; await s.go(REPORTS.apu); await p.waitForTimeout(3000); await F.pick('Vendor', v.name); await snap(o, '0-any', { expand: true }); let i = 1;
  for (const r of ['1-30 days', '31-60 days', '61-90 days', '91+ days']) { await F.menuClick('Past due', r); await snap(o, (i++) + '-' + r.replace(/\W+/g, ''), { expand: true }); }
  for (const r of ['1-30 days', '31-60 days', '61-90 days', '91+ days']) await F.menuClick('Past due', r); await snap(o, '5-none', { expand: true }); };
T.C797946 = async (o) => { const c = need('V12'); await s.go(REPORTS.aps); await p.waitForTimeout(3000); await F.pick('Vendor', c[0].name); await F.pick('Vendor', c[1].name); await snap(o, '0-AB');
  await F.menuClick('Past due', '31-60 days'); await snap(o, '1-summary-31-60'); const { p2, F2 } = await tab2('apd'); await snap(o, '2-detail-open', { page: p2, F: F2 });
  await F2.pick('Vendor', c[0].name); await snap(o, '3-detail-A', { page: p2, F: F2 }); await F2.pick('Vendor', c[1].name); await snap(o, '4-detail-AB', { page: p2, F: F2 });
  await F2.menuClick('Past due', '31-60 days'); await snap(o, '5-detail-31-60', { page: p2, F: F2 }); await snap(o, '6-expand-all', { page: p2, F: F2, expand: true }); await p2.close(); };
T.C1062588 = async (o) => { const v = need('V14')[0]; await s.go(REPORTS.aps); await p.waitForTimeout(3000); await F.pick('Vendor', v.name); await snap(o, '1-summary');
  await s.go(REPORTS.apd); await p.waitForTimeout(3000); await snap(o, '2-detail-open'); await F.pick('Vendor', v.name); await snap(o, '3-ticked'); await snap(o, '4-expand-all', { expand: true }); };
T.C1062589 = async (o) => { const v = need('V15')[0]; await s.go(REPORTS.apu); await p.waitForTimeout(3000); await F.pick('Vendor', v.name); await snap(o, '1-group-and-totals');
  await snap(o, '2-expanded', { expand: true }); o.rowsAfterOpen = (await rowsOf(p)).filter((r) => /^[A-Z][a-z]{2} \d/.test(r)).length;
  for (let i = 0; i < 30; i++) { await p.evaluate(() => { const e = [...document.querySelectorAll('main *')].find((x) => x.scrollHeight > x.clientHeight + 50 && ['auto', 'scroll'].includes(getComputedStyle(x).overflowY)); if (e) e.scrollTop = e.scrollHeight; }); await p.waitForTimeout(700); }
  await snap(o, '3-scrolled-end'); const all = (await rowsOf(p)).filter((r) => /^[A-Z][a-z]{2} \d/.test(r)); o.rowsAtEnd = all.length; o.distinctAtEnd = new Set(all.map((r) => r.split(' | ')[3])).size;
  const r = await exp(o, 'CSV', '4-csv'); if (r.csv) { o.csvBillRows = r.csv.filter((x) => /^\d{4}-\d{2}-\d{2}$/.test((x[0] || '').trim())).length; o.csvTotals = r.csv.filter((x) => x.some((c) => /^Totals?$/.test(c.trim()))); o.csvHead = r.csv.slice(0, 5); } };
T.C715345 = async (o) => { const v = need('V4')[0]; o.vendor = v.name; await s.go(REPORTS.aps); await p.waitForTimeout(3000); await snap(o, '0-open');
  const r = await exp(o, 'CSV', '1-csv'); if (r.csv) { o.csvTop = r.csv.slice(0, 4); o.csvRowA = r.csv.filter((x) => x.some((c) => c === v.name)); o.csvTotals = r.csv.filter((x) => x.some((c) => /^Totals?$/.test(c.trim()))); o.csvLast = r.csv.slice(-2); o.csvCols = [...new Set(r.csv.map((x) => x.length))]; }
  const q = await exp(o, 'PDF', '3-pdf'); if (q.text) o.pdfHead = q.text.filter((l) => /Current|91|Over|Vendor/.test(l)).slice(0, 6); };
for (const [id, rep] of [['C715348', 'apd'], ['C715349', 'apu']]) T[id] = async (o) => { const v = need('V5')[0]; o.vendor = v.name; o.docs = v.docs; await s.go(REPORTS[rep]); await p.waitForTimeout(3000); await F.pick('Vendor', v.name); await snap(o, '0-ticked', { expand: true });
  const r = await exp(o, 'CSV', '1-csv'); if (r.csv) o.csvAll = r.csv; };
T.C715310 = async (o) => { const v = need('V16')[0]; o.vendor = v.name; await s.go(REPORTS.apu); await p.waitForTimeout(3000); await F.pick('Vendor', v.name); await snap(o, '1-expanded', { expand: true }); await sortSteps(o, ['Due Date', 'Due Date', 'Past Due', 'Past Due']); };
T.C715311 = async (o) => { const v = need('V16')[0]; o.vendor = v.name; await s.go(REPORTS.apd); await p.waitForTimeout(3000); await F.pick('Vendor', v.name); await snap(o, '1-expanded', { expand: true }); await sortSteps(o, ['Due Date', 'Due Date']); };
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const o = { id, steps: [] };
  try { await fn(o); } catch (e) { o.err = String(e).slice(0, 300); try { await p.screenshot({ path: OUT + id + '-error.png' }); } catch {} }
  fs.writeFileSync(OUT + id + '.json', JSON.stringify(o, null, 1)); console.log(id, o.err || 'ok'); }
await s.close(); process.exit(0);
