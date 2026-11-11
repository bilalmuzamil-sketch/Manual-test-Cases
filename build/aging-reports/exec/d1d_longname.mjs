// d1d_longname.mjs — 11 Nov 2026: step 5 of the 1440 px design tests ("the long name wraps onto a second line; money, date and number cells
// stay on one line") was only measured on A/R Detail — on the other reports the long-named customer sorts last and was never on screen.
// Filters each report to the long-named customer/vendor at 1440 px light and measures the name cell's lines and every money/date cell.
// Makes the long-named vendor first if it does not exist ("ZZAUTOTEST Northern Alberta Heavy Haul Parts Supply Ltd", a $75 bill at HD).
// Output exec/d1d/out.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import { mkFilt } from './filt.mjs'; import { mkSort } from './sortlib.mjs'; import fs from 'fs';
const OUT = new URL('./d1d/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const a = mk(p); const F = mkFilt(p); const SO = mkSort(p); const o = { runs: {} };
const CUST = 'ZZAUTOTEST Northern Alberta Heavy Haul and Towing Ltd', VEND = 'ZZAUTOTEST Northern Alberta Heavy Haul Parts Supply Ltd';
const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
try { const r = await a.get('/api/reporting/reports/ap-aging-summary?asOfDate=2026-11-11&pagination[rowsPerPage]=30&search=' + encodeURIComponent('Northern Alberta')); o.vendCheck = JSON.stringify(r.j).slice(0, 200);
  if (!/Northern Alberta Heavy Haul Parts/.test(o.vendCheck)) { const id = await S.vendor(a, VEND, 'COD'); const b = await S.bill(a, id, { amount: 75, date: '2026-11-01', number: 'ZZLONG' + (Date.now() % 1e6) }); o.vendMade = { id, b }; } } catch (e) { o.vendErr = String(e).slice(0, 300); } save();
const measure = () => p.evaluate(() => { const lines = (td) => { const rg = document.createRange(); rg.selectNodeContents(td); return new Set([...rg.getClientRects()].filter((x) => x.width > 2).map((x) => Math.round(x.top))).size; };
  const out = { name: [], cells: [] }; for (const tr of document.querySelectorAll('main tbody tr')) for (const td of tr.children) { const t = td.innerText.trim(); if (/Northern Alberta/.test(t)) out.name.push([t.slice(0, 70), lines(td), Math.round(td.getBoundingClientRect().width)]); else if (/^\$-?[\d,]+\.\d\d$|^[A-Z][a-z]{2} \d{1,2}, \d{4}$|^\d+$|^[A-Z]{1,4}\d/.test(t)) out.cells.push([t, lines(td)]); }
  out.wrapped = out.cells.filter((c) => c[1] > 1); out.side = document.querySelector('main .q-table__middle')?.scrollWidth > document.querySelector('main .q-table__middle')?.clientWidth + 1; return out; });
for (const [k, kind, who] of [['ars', 'Customer', CUST], ['arc', 'Customer', CUST], ['ard', 'Customer', CUST], ['aps', 'Vendor', VEND], ['apd', 'Vendor', VEND], ['apu', 'Vendor', VEND]]) {
  try { await s.go(REPORTS[k]); await p.waitForTimeout(3500); await F.pick(kind, who); for (const re of [/^Current/, /^1-30/, /^31-60/, /^61-90/, /^91/, /Northern Alberta/]) await SO.expand(re).catch(() => {}); await p.mouse.move(900, 860); await p.waitForTimeout(800);
    const m = await measure(); m.shot = await s.shot(k + '-long-name'); o.runs[k] = m; console.log('d1d', k, JSON.stringify({ name: m.name, wrapped: m.wrapped, side: m.side })); } catch (e) { o.runs[k] = { err: String(e).slice(0, 200) }; } save(); }
await s.close(); process.exit(0);
