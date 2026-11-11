// p43_pdf1800.mjs — 11 Nov 2026: earlier, A/P Detail as of 04/01/2025 (1,783 lines, under the PRD's 2,000-line PDF limit, S3-N1) gave NO file and
// NO message within 60 s, twice. Re-try through the screen with a 300 s wait, record the export call (status, time taken, size), every message shown,
// and a positive control: the same report as of 02/01/2025 (444 lines) downloads. Output p43/out.json + pictures.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import { mkExp } from './explib.mjs'; import fs from 'fs';
const OUT = new URL('./p43/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, REPORTS.apd); const p = s.page; const F = mkFilt(p); const E = mkExp(p, OUT); const o = {};
const reqT = {}; p.on('request', (r) => { if (/export/.test(r.url())) reqT[r.url()] = Date.now(); }); const ex = [];
p.on('response', async (r) => { if (/export/.test(r.url())) ex.push({ u: r.url().replace(/^.*reports\//, '').slice(0, 160), st: r.status(), ms: Date.now() - (reqT[r.url()] || Date.now()), len: (r.headers()['content-length'] || '?') }); });
p.on('requestfailed', (r) => { if (/export/.test(r.url())) ex.push({ u: r.url().replace(/^.*reports\//, '').slice(0, 160), failed: r.failure()?.errorText }); });
try { await p.waitForTimeout(2500);
  for (const [tag, back] of [['control-444', 21], ['big-1783', 19]]) { await s.go(REPORTS.apd); await p.waitForTimeout(2500); await F.asOfBack(back, 1); o[tag + '-chips'] = await F.chips(); const n0 = ex.length; const t0 = Date.now(); o[tag] = await E.exportAs('PDF', tag, 300000); o[tag].secs = Math.round((Date.now() - t0) / 1000); o[tag].calls = ex.slice(n0); await s.shot(tag + '-after'); fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); } }
catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 2000)); await s.close(); process.exit(0);
