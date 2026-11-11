// q8_bigpdf.mjs — 11 Nov 2026 19:50 UTC: does ANY PDF on the QA site survive past ~30 s? (q7: every PDF that printed took 7-25 s; every Inventory
// Value PDF over ~250 rows died with 500 at ~31 s.) Count A/R Detail and A/P Detail rows per 1st-of-month as-of date (the screen's own list
// calls), pick dates with the MOST rows that are still <= 2,000 (the PRD's PDF limit), and time the PDF export call for each (same address form
// as the screen's: /api/reporting/reports/<r>/export?asOfDate=…&format=pdf, read from q7). Status, seconds, error body.
import { start, API } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./q8/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const a = mk(p); const o = { counts: {}, tries: [] };
const q7 = JSON.parse(fs.readFileSync(new URL('./q7/out.json', import.meta.url).pathname, 'utf8'));
for (const r of ['ar-aging-detail', 'ap-aging-detail']) { o.counts[r] = [];
  for (let back = 0; back < 20; back++) { const d = new Date(Date.UTC(2026, 10 - back, 1)).toISOString().slice(0, 10); const x = await a.get(`/api/reporting/reports/${r}?asOfDate=${d}`); const n = (x.j?.data?.groups || []).reduce((t, g) => t + (g.rowsNumber || 0), 0); o.counts[r].push([d, n]); } }
o.q7url = { ard: q7.ard.answers[0].url, apd: q7.apd.answers[0].url };
for (const [k, r] of [['ard', 'ar-aging-detail'], ['apd', 'ap-aging-detail']]) { const best = o.counts[r].filter(([, n]) => n > 0 && n <= 2000).sort((x, y) => y[1] - x[1]).slice(0, 2);
  for (const [d, n] of best) { const u = o.q7url[k].replace(/asOfDate=[0-9-]+/, 'asOfDate=' + d).split('&pagination')[0] + '&format=pdf'; /* 19:58: q7 kept only 160 chars of the address - add the format */ const t0 = Date.now(); const res = await p.evaluate(async (url) => { const h = JSON.parse(localStorage.getItem('user') || '{}'); const r = await fetch(url, { credentials: 'include' }); const b = r.status >= 400 ? (await r.text()).slice(0, 300) : (await r.arrayBuffer()).byteLength; return { st: r.status, ct: r.headers.get('content-type'), b }; }, API + u).catch((e) => ({ err: String(e).slice(0, 200) }));
    const t = { report: r, asOf: d, rows: n, secs: Math.round((Date.now() - t0) / 1000), ...res }; o.tries.push(t); console.log('q8', JSON.stringify(t)); fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); } }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('q8 counts', JSON.stringify(o.counts).slice(0, 800)); await s.close(); process.exit(0);
