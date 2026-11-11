// s9_ar.mjs — 11 Nov 2026: A/R exact-amount totals tests on the p46 customers (C715456, C715458, C715459, C715462, C715463, C715465).
// Each test: tick filters through the screen, after each step record the chips, every table row (cells joined by " | "), the Totals row,
// a picture; exports are saved and their Totals rows read. Customer names come from p46/out-R3.json (R6) and p46r4/out.json (R8, R9, R15).
// Output exec/s9/<id>.json + pictures. One admin session; ONLY=<ids> to pick tests.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import { mkExp } from './explib.mjs'; import fs from 'fs';
const OUT = new URL('./s9/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const R3 = JSON.parse(fs.readFileSync(new URL('./p46/out-R3.json', import.meta.url))).sets;
let R4 = fs.existsSync(new URL('./p46r4/out.json', import.meta.url)) ? JSON.parse(fs.readFileSync(new URL('./p46r4/out.json', import.meta.url))).sets : {};
for (const d of ['p46r5']) { const u = new URL('./' + d + '/out.json', import.meta.url); if (fs.existsSync(u)) Object.assign(R4, JSON.parse(fs.readFileSync(u)).sets); }
const nm = (set, i) => (set ? set[i].name : null);
const LB = 'Staging Lethbridge - 4310';
const s = await start(OUT); const p = s.page; const F = mkFilt(p); const E = mkExp(p, OUT);
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const rows = () => p.evaluate(() => [...document.querySelectorAll('main tr')].map((tr) => [...tr.children].map((td) => td.innerText.replace(/\s+/g, ' ').trim()).join(' | ')).filter((t) => t.replace(/[ |]/g, '')));
const totals = async () => { const t = await p.evaluate(() => [...document.querySelectorAll('main div, main tr')].filter((e) => /^Totals\b/.test(e.innerText.trim()) && e.innerText.length < 300).map((e) => e.innerText.replace(/\s+/g, ' ').trim())); return t.sort((a, b) => a.length - b.length)[0] || null; };
const headBtn = () => p.locator('main thead th').first().locator('button').first();
async function expandAll() { for (let i = 0; i < 4; i++) { const r = await rows(); if (!r.some((x) => /^keyboard_arrow_right/.test(x) || /\| ?keyboard_arrow_right/.test(x))) return true;
  if (await headBtn().count()) { await headBtn().hover(); await p.waitForTimeout(600); const tip = (await p.locator('.q-tooltip').allInnerTexts().catch(() => [])).join(' '); if (/Expand all/i.test(tip)) { await headBtn().click(); await p.waitForTimeout(2500); continue; } }
  const g = p.locator('main tr').filter({ hasText: 'keyboard_arrow_right' }).first(); if (await g.count()) { await g.locator('button, i').first().click().catch(() => {}); await p.waitForTimeout(2000); } }
  return false; }
const lastLine = (txt, re) => txt.split('\n').filter((l) => re.test(l)).map((l) => l.replace(/\s+/g, ' ').trim()).pop() || null;
async function exp(o, kind, tag) { const r = await E.exportAs(kind, o.id + '-' + tag, 120000); if (r.file && kind === 'PDF') { const t = E.readPdf(r.file); r.totalsLine = lastLine(t, /^\s*Totals?\b/); r.pdfLines = t.split('\n').filter((l) => l.trim()).length; }
  if (r.file && kind === 'CSV') { const c = E.readCsv(r.file); r.head = c[0]; r.totalsRow = c.find((x) => /^Totals?$/i.test((x[0] || '').trim()) || x.some((v) => /^Totals?$/i.test(v.trim()))) || null; r.n = c.length; }
  o.steps.push({ step: kind + '-' + tag, r }); return r; }
async function snap(o, label, opts = {}) { if (opts.expand) o.expanded = await expandAll(); await p.waitForTimeout(800);
  const st = { label, chips: await F.chips(), rows: await rows(), totals: await totals() }; st.shot = await s.shot(o.id + '-' + label); o.steps.push(st); fs.writeFileSync(OUT + o.id + '.json', JSON.stringify(o, null, 1)); return st; }
const T = {};
const tot = R3.R6; // Tot Cust A, B, C
for (const [id, rep] of [['C715458', 'ard'], ['C715459', 'arc']]) T[id] = async (o) => { await s.go(REPORTS[rep]); await p.waitForTimeout(3000); await snap(o, '0-open');
  await F.pick('Customer', nm(tot, 0)); await F.pick('Customer', nm(tot, 1)); await snap(o, '1-AB', { expand: true });
  await F.menuClick('Past due', '31-60 days'); await snap(o, '2-3-pastdue-31-60', { expand: true });
  await F.menuClick('Location', LB); await snap(o, '4-5-no-lethbridge', { expand: true });
  await exp(o, 'PDF', '6-pdf'); await exp(o, 'CSV', '8-csv'); };
T.C715456 = async (o) => { await s.go(REPORTS.ars); await p.waitForTimeout(3000); await snap(o, '0-open');
  await F.pick('Customer', nm(tot, 0)); await F.pick('Customer', nm(tot, 1)); await snap(o, '1-AB');
  await F.menuClick('Location', LB); await snap(o, '2-no-lethbridge');
  o.selectAllMenu = await F.menuClick('Location', 'Select all'); await snap(o, '3-select-all');
  await F.menuClick('Past due', '91+ days'); await snap(o, '4-91plus');
  await exp(o, 'PDF', '5-pdf'); await exp(o, 'CSV', '7-csv'); };
T.C715462 = async (o) => { const c = R4.R15?.[0]; if (!c) throw new Error('no R15 customer seeded'); await s.go(REPORTS.ars); await p.waitForTimeout(3000);
  await F.pick('Customer', c.name); await snap(o, '1-2-row-and-totals'); };
T.C715463 = async (o) => { const b = R4.R8; if (!b) throw new Error('no R8 (R4) customers'); await s.go(REPORTS.ars); await p.waitForTimeout(3000);
  await F.pick('Customer', b[0].name); await F.pick('Customer', b[1].name); await snap(o, '0-summary-AB'); const sumP = p;
  const p2 = await p.context().newPage(); await p2.setViewportSize({ width: 1440, height: 900 }); const F2 = mkFilt(p2);
  await p2.goto(new URL(REPORTS.ard, p.url()).href); await p2.waitForTimeout(4000);
  const rows2 = () => p2.evaluate(() => [...document.querySelectorAll('main tr')].map((tr) => [...tr.children].map((td) => td.innerText.replace(/\s+/g, ' ').trim()).join(' | ')).filter((t) => t.replace(/[ |]/g, '')));
  const snap2 = async (label) => { const st = { label, tab: 'detail', chips: await F2.chips(), rows: await rows2() }; const f = OUT + o.id + '-' + label + '.png'; await p2.screenshot({ path: f }); st.shot = f; o.steps.push(st); fs.writeFileSync(OUT + o.id + '.json', JSON.stringify(o, null, 1)); };
  await snap2('2-detail-open'); await F2.pick('Customer', b[0].name); await snap2('3-detail-A'); await F2.pick('Customer', b[1].name); await snap2('4-detail-AB');
  await F2.menuClick('Location', LB); await snap2('5-detail-no-lethbridge');
  await sumP.bringToFront(); await p.waitForTimeout(1500); await snap(o, '6-summary-again'); await F.menuClick('Location', LB); await snap(o, '7-summary-no-lethbridge'); await p2.close(); };
T.C715465 = async (o) => { const c = R4.R9?.[0]; if (!c) throw new Error('no R9 (R4) customer'); await s.go(REPORTS.ard); await p.waitForTimeout(3000);
  await F.pick('Customer', c.name); await snap(o, '0-any', { expand: true });
  let i = 1; for (const r of ['1-30 days', '31-60 days', '61-90 days', '91+ days']) await (async () => { await F.menuClick('Past due', r); await snap(o, (i++) + '-' + r.replace(/\W+/g, ''), { expand: true }); })();
  for (const r of ['1-30 days', '31-60 days', '61-90 days', '91+ days']) await F.menuClick('Past due', r); await snap(o, '5-none', { expand: true }); };
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const o = { id, steps: [] };
  try { await fn(o); } catch (e) { o.err = String(e).slice(0, 300); try { o.errShot = await s.shot(id + '-error'); } catch {} }
  fs.writeFileSync(OUT + id + '.json', JSON.stringify(o, null, 1)); console.log(id, o.err || 'ok'); }
await s.close(); process.exit(0);
