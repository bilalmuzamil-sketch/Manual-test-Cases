// p02_data.mjs — 11 Nov 2026: pull every row of A/R Summary and A/P Summary (as of today) and the Detail bucket counts, from the
// server through the signed-in page, to see which seeded names already exist. Read only. Output exec/p02/data.json.
import { start, API } from './lib.mjs';
const OUT = new URL('./p02/', import.meta.url).pathname; const s = await start(OUT);
const get = (u) => s.page.evaluate(async (u) => { const r = await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } }); return { st: r.status, j: await r.json().catch(() => null) }; }, API + u);
const o = {}; const D = process.env.ASOF || '2026-11-10'; const q = (u) => u + (u.includes('?') ? '&' : '?') + 'asOfDate=' + D;
for (const [k, sort] of [['ar-aging-summary', 'customer_name'], ['ap-aging-summary', 'vendor_name']]) {
  let all = [], page = 1;
  while (page < 60) { const r = await get(q(`/api/reporting/reports/${k}?pagination[page]=${page}&pagination[rowsPerPage]=100&pagination[sortBy]=${sort}&pagination[descending]=false`));
    const c = r.j?.data?.collection ?? []; all = all.concat(c); if (c.length < 100) break; page++; }
  o[k] = all; console.log(k, all.length, 'rows');
}
for (const k of ['ar-aging-detail', 'ap-aging-detail', 'ar-aging-collection', 'ap-unpaid-invoices']) { const r = await get(q(`/api/reporting/reports/${k}`)); o[k + '-head'] = r; console.log(k, r.st, JSON.stringify(r.j).slice(0, 300)); }
o.locations = await get(q('/api/reporting/reports/ar-aging-summary/locations')); console.log('locations', JSON.stringify(o.locations.j).slice(0, 400));
s.save('data', o); await s.close(); process.exit(0);
