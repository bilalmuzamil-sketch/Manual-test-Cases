// pr15_overpaid.mjs — 12 Nov 2026: the QA lead asked to retest every Blocked test. Five are Blocked because the app refuses the set-up (an overpaid
// invoice / bill, a document with no due date). PRD v11 says "Production has 16 such invoices across 13 customer accounts", so the state exists. Here,
// on PRODUCTION (read-only): list A/R aging transactions with a negative balance that are invoices, and transactions with no due date; the same for
// A/P where the old endpoint answers. Output prod/pr15.json. Next step: read how one of them became overpaid.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import fs from 'fs';
const OUT = new URL('./prod/', import.meta.url).pathname; const o = {}; const B = await bootProdLogin('/reports', { viewport: { width: 1440, height: 900 } }); const p = B.page; o.version = B.version;
const API = (path) => `https://${B.APIH}${path}`; const H = { Accept: 'application/json' }; const J = async (r) => { try { return await r.json(); } catch { return null; } };
const day = new Date().toISOString().slice(0, 10);
for (const [k, path] of [['ar', `/api/reporting/account-receivable/aging-detail-report?asOfDate=${day}T23:59:59.999Z`], ['ap', `/api/reporting/account-payable/aging-detail-report?asOfDate=${day}T23:59:59.999Z`], ['ap2', `/api/reporting/accounts-payable/aging-detail-report?asOfDate=${day}T23:59:59.999Z`]]) {
  const r = await B.ctx.request.get(API(path), { headers: H }); const j = await J(r); const q = (o[k] = { st: r.status(), keys: Object.keys(j?.data || {}).slice(0, 10) });
  const b = j?.data?.buckets || {}; const all = Object.entries(b).flatMap(([bk, v]) => (v.transactions || []).map((t) => ({ bk, ...t })));
  q.n = all.length; q.sample = all[0]; q.types = [...new Set(all.map((t) => t.type))];
  q.negInvoices = all.filter((t) => !/credit/i.test(t.type || '') && Number(t.balance) < 0).slice(0, 30);
  q.noDue = all.filter((t) => !t.dueDate).slice(0, 30);
}
fs.writeFileSync(OUT + 'pr15.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify({ v: o.version, ar: { st: o.ar.st, n: o.ar.n, types: o.ar.types, neg: o.ar.negInvoices?.length, noDue: o.ar.noDue?.length }, ap: [o.ap.st, o.ap.n, o.ap.negInvoices?.length, o.ap.noDue?.length], ap2: [o.ap2.st, o.ap2.n] })); await B.browser?.close?.(); process.exit(0);
