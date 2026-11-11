// s9b_ar.mjs — 11 Nov 2026: more A/R exact-amount tests on the p46 customers: C797945 (R12), C715344 (R4), C715346/C715347 (R5), C715580 (R10),
// C715581 (R11, payment recorded with the call the payment screen sends), C1062580 (R13), C1062581 (makes its own invoice dated Nov 4, Net 30),
// C1062587 (R14). Same recording as s9_ar.mjs: chips, every table row, the Totals row and a picture per step; exports saved and read.
// Output exec/s9/<id>.json + pictures. ONLY=<ids>.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import { mkExp } from './explib.mjs'; import { mk } from './api.mjs'; import * as SL from './seedlib.mjs'; import { mkX } from './xseed.mjs'; import fs from 'fs';
const OUT = new URL('./s9/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const R3 = JSON.parse(fs.readFileSync(new URL('./p46/out-R3.json', import.meta.url))).sets; const R5 = (() => { const u = new URL('./p46r5/out.json', import.meta.url); return fs.existsSync(u) ? JSON.parse(fs.readFileSync(u)).sets : {}; })();
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
const T = {};
T.C797945 = async (o) => { const c = R5.R12; if (!c) throw new Error('no R12 (R5) customers'); await s.go(REPORTS.ars); await p.waitForTimeout(3000); await F.pick('Customer', c[0].name); await F.pick('Customer', c[1].name); await snap(o, '0-AB');
  await F.menuClick('Past due', '31-60 days'); await snap(o, '1-summary-31-60'); const { p2, F2 } = await tab2('ard'); await snap(o, '2-detail-open', { page: p2, F: F2 });
  await F2.pick('Customer', c[0].name); await snap(o, '3-detail-A', { page: p2, F: F2 }); await F2.pick('Customer', c[1].name); await snap(o, '4-detail-AB', { page: p2, F: F2 });
  await F2.menuClick('Past due', '31-60 days'); await snap(o, '5-detail-31-60', { page: p2, F: F2 }); await snap(o, '6-expand-all', { page: p2, F: F2, expand: true }); await p2.close(); };
T.C715344 = async (o) => { const c = R3.R4[0]; o.customer = c.name; await s.go(REPORTS.ars); await p.waitForTimeout(3000); await snap(o, '0-open');
  const r = await exp(o, 'CSV', '1-csv'); if (r.csv) { o.csvTop = r.csv.slice(0, 4); o.csvRowA = r.csv.filter((x) => x.some((v) => v === c.name)); o.csvTotals = r.csv.filter((x) => x.some((v) => /^Totals?$/.test(v.trim()))); o.csvLast = r.csv.slice(-2); o.csvCols = r.csv.map((x) => x.length).filter((v, i, arr) => arr.indexOf(v) === i); }
  const q = await exp(o, 'PDF', '3-pdf'); if (q.text) o.pdfHead = q.text.filter((l) => /Current|91|Over|Customer/.test(l)).slice(0, 6); };
for (const [id, rep] of [['C715346', 'ard'], ['C715347', 'arc']]) T[id] = async (o) => { const c = R3.R5[0]; o.customer = c.name; o.docs = c.docs; await s.go(REPORTS[rep]); await p.waitForTimeout(3000); await F.pick('Customer', c.name); await snap(o, '0-ticked', { expand: true });
  const r = await exp(o, 'CSV', '1-csv'); if (r.csv) o.csvAll = r.csv; };
T.C715580 = async (o) => { const cs = R3.R10; await s.go(REPORTS.ars); await p.waitForTimeout(3000); const calls0 = s.net.length;
  await p.locator('main button', { hasText: /Customer:/ }).first().click(); await p.waitForTimeout(1200); await snap(o, '1-menu-open'); const m = p.locator('.q-menu').last();
  await m.locator('input').first().type('ZZX Quick', { delay: 20 }); await p.waitForTimeout(1800); const t0 = Date.now();
  for (const c of cs) await m.locator('.q-item, label, .q-checkbox').filter({ hasText: c.name }).first().click({ delay: 0 }); o.tickMs = Date.now() - t0; await snap(o, '2-all-ticked');
  await p.keyboard.press('Escape'); await p.waitForTimeout(500); await snap(o, '3-closed'); await p.waitForTimeout(3500); await snap(o, '4-loaded'); await p.waitForTimeout(10000); await snap(o, '5-after-10s');
  o.reportCalls = s.net.slice(calls0).map((n) => ({ u: String(n.u || n.url || '').slice(-160), st: n.st || n.status })).filter((n) => /ar-aging-summary/.test(n.u)); };
T.C715581 = async (o) => { const c = R3.R11[0]; o.customer = c.name; await s.go(REPORTS.ars); await p.waitForTimeout(3000); await F.pick('Customer', c.name); await snap(o, '1-before');
  const d = c.docs[0]; o.payment = await X.pay(c, d, 200).then(() => 'recorded 200.00').catch((e) => 'ERR ' + String(e).slice(0, 200)); await p.waitForTimeout(1500); await snap(o, '4-not-reloaded');
  await p.reload(); await p.waitForTimeout(5000); await snap(o, '5-reloaded'); };
T.C1062580 = async (o) => { const c = R3.R13[0]; o.customer = c.name; await s.go(REPORTS.ard); await p.waitForTimeout(3000); await F.pick('Customer', c.name); await snap(o, '1-expanded', { expand: true });
  const q = await exp(o, 'PDF', '2-pdf'); if (q.text) o.pdfRows = q.text.filter((l) => /150/.test(l)); };
T.C1062581 = async (o) => { const c = await X.customer('ZZX PDF Date' + (process.env.SFX2 || ' S9'), 'Net 30'); const d = await X.invoice(c, 64, 7, SL.WP.heavy, 'nov4'); o.customer = c.name; o.doc = d;
  await s.go(REPORTS.ard); await p.waitForTimeout(3000); await F.pick('Customer', c.name); await F.asOf('4'); await snap(o, '1-asof-nov4', { expand: true });
  const q = await exp(o, 'PDF', '3-pdf'); if (q.text) { o.pdfRows = q.text.filter((l) => /Nov 0?4|Dec 0?4/.test(l)); o.pdfTop = q.text.slice(0, 6); } };
T.C1062587 = async (o) => { const c = R3.R14[0]; o.customer = c.name; await s.go(REPORTS.ars); await p.waitForTimeout(3000); await F.pick('Customer', c.name); await snap(o, '1-summary');
  await s.go(REPORTS.ard); await p.waitForTimeout(3000); await snap(o, '2-detail-open'); await F.pick('Customer', c.name); await snap(o, '3-ticked'); await snap(o, '4-expand-all', { expand: true }); };
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const o = { id, steps: [] };
  try { await fn(o); } catch (e) { o.err = String(e).slice(0, 300); try { await p.screenshot({ path: OUT + id + '-error.png' }); } catch {} }
  fs.writeFileSync(OUT + id + '.json', JSON.stringify(o, null, 1)); console.log(id, o.err || 'ok'); }
await s.close(); process.exit(0);
