// p22_asof.mjs — 11 Nov 2026: (1) find a customer whose invoices are all paid and who is not on A/R Summary today (C715287 customer A);
// (2) learn the As of chip: click it, picture, try typing 11/09/2026, record the request the screen makes. Output exec/p22/.
import { start, REPORTS } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p22/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const a = mk(p); const o = {};
const all = []; for (let pg = 1; pg < 400; pg++) { const r = await a.get(`/api/work-orders?pagination[page]=${pg}&pagination[rowsPerPage]=100`); const w = r.j?.data?.work_orders || []; all.push(...w.map((x) => ({ n: x.number, st: x.status, co: x.companyName }))); if (w.length < 100) break; }
const by = {}; for (const w of all) (by[w.co] ||= []).push(w.st);
const ars = []; for (let pg = 1; pg < 30; pg++) { const r = await a.get(`/api/reporting/reports/ar-aging-summary?asOfDate=2026-11-10&pagination[page]=${pg}&pagination[rowsPerPage]=100`); const c = r.j?.data?.collection || []; ars.push(...c.map((x) => x.name)); if (c.length < 100) break; }
o.arsCount = ars.length; const onArs = new Set(ars);
o.paidOnly = Object.entries(by).filter(([co, sts]) => sts.length && sts.every((x) => x === 'paid') && !onArs.has(co)).map(([co, sts]) => [co, sts.length]).slice(0, 15);
o.tenTrucking = { onArs: onArs.has('10 Trucking'), wos: by['10 Trucking'] };
await s.go(REPORTS.ars); await p.waitForTimeout(2500); o.url0 = p.url();
await p.locator('main button', { hasText: /As of:/ }).first().click(); await p.waitForTimeout(1500); await s.shot('asof-open'); o.menu = (await p.locator('.q-menu, .q-dialog').last().innerText().catch(() => '')).slice(0, 800);
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 3000)); await s.close(); process.exit(0);
