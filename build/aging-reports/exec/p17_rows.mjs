// p17_rows.mjs — 11 Nov 2026: pull every A/R Collection group with its rows (all pages) and the A/R Detail bucket rows (expand all on
// screen, capturing the bucket-rows replies), to find existing customers whose document numbers differ in digit count (S1 C715280/82).
import { start, REPORTS } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p17/', import.meta.url).pathname; const s = await start(OUT); const a = mk(s.page); const o = {};
let page = 1, coll = []; while (page < 30) { const r = await a.get(`/api/reporting/reports/ar-aging-collection?asOfDate=2026-11-10&pagination[page]=${page}&pagination[rowsPerPage]=100&pagination[sortBy]=date&pagination[descending]=false`); const c = r.j?.data?.collection ?? []; coll = coll.concat(c); if (c.length < 100) break; page++; }
o.arc = coll; console.log('arc groups', coll.length, 'rows', coll.reduce((n, g) => n + (g.rows?.length ?? 0), 0), 'rowsNumber', coll.reduce((n, g) => n + g.rowsNumber, 0));
const n0 = s.net.length; await s.go(REPORTS.ard); await s.page.waitForTimeout(2500); await s.page.locator('main thead th').first().locator('button, i').first().click().catch(() => {}); await s.page.waitForTimeout(6000);
o.ardCalls = s.net.slice(n0).filter((c) => /buckets/.test(c.u)).map((c) => ({ u: c.u.replace(/^.*reports\//, ''), st: c.st, n: c.body?.data?.collection?.length ?? c.body?.data?.rows?.length ?? null, body: c.body }));
console.log('ard bucket calls', o.ardCalls.map((c) => c.st + ' ' + c.u + ' n=' + c.n).join(' ; ').slice(0, 800));
fs.writeFileSync(OUT + 'rows.json', JSON.stringify(o, null, 1)); await s.close(); process.exit(0);
