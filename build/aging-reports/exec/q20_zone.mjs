// q20_zone.mjs — 12 Nov 2026, sv11315 (QA site, locations in America/Edmonton): is the staging finding real for a North American location?
// Reads every location's zone and the signed-in one, then every A/R and A/P Detail document as of today from the report's own calls, and lists
// documents whose Greenwich day differs from their location's day (due in the local evening), with the Past Due the report counted.
// Read-only. Output q20/out.json.
import { start, API } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./q20/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const o = {};
const get = (u) => p.evaluate(async (u) => { const x = await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } }); return { st: x.status, j: await x.json().catch(() => null) }; }, API + u);
const w = await get('/api/staff/my-workplaces'); o.locs = (w.j?.data?.collection || w.j?.data || []).map((l) => [l.name, l.timezone]); o.current = await p.evaluate(() => localStorage.getItem('location'));
const today = new Date().toISOString().slice(0, 10); o.asOf = today; const B = ['current', 'days_1_to_30', 'days_31_to_60', 'days_61_to_90', 'days_91_plus'];
for (const slug of ['ar-aging-detail', 'ap-aging-detail']) { const docs = []; for (const b of B) for (let pg = 1; pg < 200; pg++) { const r = await get(`/api/reporting/reports/${slug}/buckets/${b}/rows?asOfDate=${today}&pagination[page]=${pg}&pagination[rowsPerPage]=100`); const c = r.j?.data?.collection || []; docs.push(...c.map((d) => ({ ...d, bucket: b }))); if (c.length < 100) break; }
  o[slug] = docs.map((d) => [d.documentNumber, d.customerName || d.vendorName, d.locationName, d.dueDate, d.daysPastDue, d.bucket, d.transactionType]); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o)); console.log(JSON.stringify({ locs: o.locs, current: o.current, ar: o['ar-aging-detail'].length, ap: o['ap-aging-detail'].length })); await s.close(); process.exit(0);
