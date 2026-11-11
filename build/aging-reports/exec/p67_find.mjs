// p67_find.mjs — 11 Nov 2026: read-only data census for the next batch. (1) A/R Detail every bucket today, every page: per customer, the
// transaction types in each bucket (finds a customer with Invoice + Credit Memo + Deposit in one bucket, C1062574/C1062576; credit memos and
// deposits for C715423); bucket sizes (101-400 lines, C715454/C715455 on A/P too). (2) Customers on A/R Summary / A/R Collection and vendors on
// A/P Summary / A/P Unpaid today (31-90 for C715450-C715453, C715612-C715615). (3) Vendors in the organization (C797943). Output p67/out.json.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p67/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const a = mk(s.page); const o = {}; const D = '2026-11-11';
const B = ['current', 'days_1_to_30', 'days_31_to_60', 'days_61_to_90', 'days_91_plus'];
try { for (const R of ['ar-aging-detail', 'ap-aging-detail']) { const per = {}; o[R] = { sizes: {} };
    for (const b of B) { let n = 0; for (let pg = 1; pg < 60; pg++) { const r = await a.get(`/api/reporting/reports/${R}/buckets/${b}/rows?asOfDate=${D}&pagination[page]=${pg}&pagination[rowsPerPage]=100`); const c = r.j?.data?.collection || r.j?.data?.rows || []; if (!Array.isArray(c) || !c.length) { if (pg === 1) o[R]['first-' + b] = [r.st, JSON.stringify(r.j).slice(0, 200)]; break; }
        n += c.length; for (const x of c) { const who = x.customerName || x.vendorName || '?'; (per[who] ||= {}); ((per[who][b] ||= {})[x.transactionType] ||= []).push([x.documentNumber, x.date?.slice(0, 10), x.locationName, x.openBalanceCents]); } if (c.length < 100) break; }
      o[R].sizes[b] = n; }
    o[R].mixed = Object.entries(per).filter(([w, bs]) => Object.values(bs).some((ts) => Object.keys(ts).length >= 3)).map(([w, bs]) => ({ w, bs })).slice(0, 10);
    o[R].withCredit = Object.entries(per).filter(([w, bs]) => Object.values(bs).some((ts) => Object.keys(ts).some((t) => !/^Invoice$|^Bill$/i.test(t)))).map(([w, bs]) => [w, Object.fromEntries(Object.entries(bs).map(([b, ts]) => [b, Object.fromEntries(Object.entries(ts).map(([t, l]) => [t, l.length]))]))]).slice(0, 40);
    o[R].types = [...new Set(Object.values(per).flatMap((bs) => Object.values(bs).flatMap((ts) => Object.keys(ts))))]; o[R].nWho = Object.keys(per).length; }
  for (const R of ['ar-aging-summary', 'ar-aging-collection', 'ap-aging-summary', 'ap-unpaid-invoices']) { let n = 0, tot = null; for (let pg = 1; pg < 60; pg++) { const r = await a.get(`/api/reporting/reports/${R}?asOfDate=${D}&pagination[page]=${pg}&pagination[rowsPerPage]=30`); const d = r.j?.data || {}; const c = d.collection || d.rows || d.groups || []; if (pg === 1) o[R + '-keys'] = Object.keys(d).join(',') + ' ' + JSON.stringify(d).slice(0, 300); tot = d.pagination?.rowsNumber ?? d.total ?? tot; n += c.length; if (c.length < 30) break; } o[R] = { n, tot }; }
  const v = await a.get('/api/vendors?pagination[rowsPerPage]=5'); o.vendorsReply = [v.st, JSON.stringify(v.j).slice(0, 300)];
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p67', o.err || 'ok', JSON.stringify({ ard: o['ar-aging-detail']?.sizes, apd: o['ap-aging-detail']?.sizes, ars: o['ar-aging-summary'], arc: o['ar-aging-collection'], aps: o['ap-aging-summary'], apu: o['ap-unpaid-invoices'] })); await s.close(); process.exit(0);
