// s2x_305.mjs — 11 Nov 2026: C715305 re-run. The 1-30 bucket of A/P Detail holds 365 lines and the reader stopped at 200, so steps 2-3 could not
// be read. Here the Vendor filter keeps only the two test vendors (ZZAUTOTEST S1R5 V Alpha / Bravo, bills 9917, 10023, 10024 with the same due
// date), so the whole bucket is read at every step. Pictures at every step. Output s2/C715305x.json.
import { start, REPORTS } from './lib.mjs'; import { mkSort } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./s2/', import.meta.url).pathname; const s = await start(OUT, REPORTS.apd); const p = s.page; const S = mkSort(p); const F = mkFilt(p); const o = { id: 'C715305x', steps: [] };
const boxes = () => p.evaluate(`[...document.querySelectorAll('main tbody tr, main thead th, main button')].map(e => { const b = e.getBoundingClientRect(); return [e.innerText.replace(/\\s+/g,' ').trim().slice(0, 90), Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }).filter(b => b[3] > 0 && b[2] >= 0 && b[2] < 900)`);
const read = async (label) => { const rows = await S.collect(); const seg = S.segment(rows, /^1-30 days past due/); const f = await s.shot('C715305x-' + label); o.steps.push({ label, sorted: await S.sorted(), head: seg?.head, rows: (seg?.rows || []).map((r) => r.cells.slice(2, 6)), f, boxes: await boxes() }); };
try { await p.waitForTimeout(2500); await F.pick('Vendor', 'ZZAUTOTEST S1R5 V Alpha'); await F.pick('Vendor', 'ZZAUTOTEST S1R5 V Bravo'); o.chips = await F.chips(); await S.expand(/^1-30 days past due/); await read('0-open');
  for (const [i, th] of [[1, 'No.'], [2, 'No.'], [3, 'Due Date'], [4, 'Due Date']]) { await S.clickTh(th); await p.waitForTimeout(2500); await S.expand(/^1-30 days past due/); await read(i + '-' + th.replace('.', '')); } }
catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'C715305x.json', JSON.stringify(o, null, 1)); console.log(o.err || 'ok', o.steps.map((x) => x.label + ' ' + x.sorted + ' ' + x.rows.map((r) => r[1]).join(',')).join(' | ').slice(0, 1500)); await s.close(); process.exit(0);
