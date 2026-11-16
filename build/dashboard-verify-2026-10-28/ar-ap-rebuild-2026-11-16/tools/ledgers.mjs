// A/R + A/P rebuild (16 Nov): the INDEPENDENT sources for the recompute — a different code path from the report:
//  A/R: each customer's own account list (customer card, Invoices tab: customer-account/list-unpaid-transaction?openOnly=true),
//       its deposits (customer-deposits/list) and its payments (customer-payment/list, with per-invoice statements);
//  A/P: each vendor's own Unpaid list (vendor page: parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account);
//  both read with the session switched to EVERY location in the reports' location lists (these lists are location-scoped);
//  plus Reports > Export Reports "Customer Payment" and "Vendor Bill Payment" files for 1 Oct 2026 .. 31 Dec 2026
//  (payments after the 30 Sep as-of date, for the historical replay).
// Customers/vendors = union of every customer/vendor in the collected report snapshots (HD + LE, both dates, both scopes).
// Usage: TZ=Asia/Karachi node ledgers.mjs   Raw -> /tmp/cln/arap/ledgers/ (business data, never committed). SECRET-FREE.
import fs from 'fs'; import { execFileSync } from 'child_process';
import { boot, LOC, rule99, save } from '../../report-gaps-2026-11-16/tools/sboot.mjs';
const EV = new URL('../evidence/', import.meta.url).pathname; const API = 'https://api.staging.shopview.com/api'; const O = '/tmp/cln/arap/ledgers/';
const loc = LOC.HD; const { browser, page } = await boot(loc); const log = { start: await rule99(page, loc), steps: [] };
const get = p => page.evaluate(async ([A, p]) => { for (let i = 0; i < 4; i++) { try { const r = await fetch(A + p, { credentials: 'include', headers: { Accept: 'application/json' } }); if (r.status >= 500) { await new Promise(z => setTimeout(z, 1500 * (i + 1))); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } catch (e) { await new Promise(z => setTimeout(z, 1500)); } } return { s: 0 }; }, [API, p]);
const post = (p, b) => page.evaluate(async ([A, p, b]) => { const r = await fetch(A + p, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(b) }); return r.status; }, [API, p, b]);
async function pool(items, n, fn) { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const it = items[i++]; await fn(it); } })); }
const cust = new Map(), vend = new Map(), wps = new Map();
for (const f of execFileSync('find', ['/tmp/cln/arap/HD', '/tmp/cln/arap/LE', '-name', '*.json']).toString().trim().split('\n')) {
  const d = JSON.parse(fs.readFileSync(f)); if (f.endsWith('-locations.json')) { for (const l of (d?.collection || d || [])) wps.set(l.id, l.name); continue; }
  for (const r of d.collection || []) { if (r.customerId) cust.set(r.customerId, r.customerName || r.name); if (r.vendorId) vend.set(r.vendorId, r.vendorName || r.name); }
  for (const rows of Object.values(d.rows || {})) for (const r of rows) { if (r.customerId) cust.set(r.customerId, r.customerName); if (r.vendorId) vend.set(r.vendorId, r.vendorName); if (r.workplaceId) wps.set(r.workplaceId, r.locationName); }
}
const tzOf = { [LOC.HD.id]: 'Asia/Karachi', [LOC.LE.id]: 'America/Edmonton', [LOC.QB.id]: 'America/Vancouver', [LOC.DVI.id]: 'Pacific/Fiji' };
log.population = { customers: cust.size, vendors: vend.size, workplaces: [...wps].map(([id, n]) => ({ id, n, tz: tzOf[id] || 'America/Edmonton' })) };
console.log(JSON.stringify(log.population));
fs.mkdirSync(O + 'acc', { recursive: true });
// customer -> account (once, at HD); vendor -> account
const cacc = {}, vacc = {};
await pool([...cust.keys()], 8, async id => { const v = await get(`/customers/view/${id}`); cacc[id] = v.j?.data?.company?.customer_account_id || null; });
await pool([...vend.keys()], 8, async id => { const v = await get(`/parts-catalogue/vendor/${id}`); vacc[id] = v.j?.data?.vendor?.vendor_account_id || null; });
fs.writeFileSync(O + 'accounts.json', JSON.stringify({ cacc, vacc, cust: Object.fromEntries(cust), vend: Object.fromEntries(vend) }));
for (const [wid] of wps) {
  const tz = tzOf[wid] || 'America/Edmonton'; const st = await post('/iam/change-location', { workplace_id: wid, workplace_timezone: tz });
  const dir = O + wid + '/'; fs.mkdirSync(dir, { recursive: true }); let nC = 0, nV = 0, bad = 0;
  await pool(Object.entries(cacc).filter(([, a]) => a), 8, async ([cid, acc]) => {
    let rows = [], pg = 1, r; do { r = await get(`/customer-account/list-unpaid-transaction?accountId=${acc}&openOnly=true&pagination[page]=${pg}&pagination[rowsPerPage]=500`); const c = r.j?.data?.response?.collection || []; rows = rows.concat(c); pg++; if (c.length < 500) break; } while (true);
    const dep = await get(`/customer-deposits/list?accountId=${acc}`); if (r.s !== 200 || dep.s !== 200) bad++;
    fs.writeFileSync(dir + 'c_' + cid + '.json', JSON.stringify({ cid, acc, s: r.s, rows, dep_s: dep.s, deposits: dep.j?.data })); nC++;
  });
  await pool(Object.entries(vacc).filter(([, a]) => a), 8, async ([vid, acc]) => {
    let rows = [], pg = 1, r; do { r = await get(`/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId=${acc}&pagination[page]=${pg}&pagination[rowsPerPage]=500`); const resp = r.j?.data?.response || r.j?.data || {}; const c = resp.collection || []; rows = rows.concat(c); pg++; if (c.length < 500) break; } while (true);
    if (r.s !== 200) bad++; fs.writeFileSync(dir + 'v_' + vid + '.json', JSON.stringify({ vid, acc, s: r.s, rows })); nV++;
  });
  log.steps.push({ wid, tz, change_location: st, customers: nC, vendors: nV, non200: bad, at: new Date().toISOString() }); console.log(JSON.stringify(log.steps.at(-1)));
}
await post('/iam/change-location', { workplace_id: loc.id, workplace_timezone: loc.tz });
// payments per customer account (org-wide list; statements carry the invoice numbers and settlement amounts)
fs.mkdirSync(O + 'pay', { recursive: true }); let np = 0;
await pool([...new Set(Object.values(cacc).filter(Boolean))], 8, async acc => { let rows = [], pg = 1, r; do { r = await get(`/customer-payment/list?accountId=${acc}&pagination[page]=${pg}&pagination[rowsPerPage]=500`); const c = r.j?.data?.collection || []; rows = rows.concat(c); pg++; if (c.length < 500) break; } while (true); fs.writeFileSync(O + 'pay/' + acc + '.json', JSON.stringify({ acc, s: r.s, payments: rows })); np++; });
log.steps.push({ customer_payment_lists: np });
// payment export files after 30 Sep (as the Export Reports dialog sends them; window in the session zone, Karachi)
const inst = (d, end) => { const s = execFileSync('python3', ['-I', '-c', `import datetime as d;from zoneinfo import ZoneInfo as Z;t=d.datetime.combine(d.date.fromisoformat('${d}'),d.time(23,59,59,999000) if ${end ? 1 : 0} else d.time(0),Z('Asia/Karachi')).astimezone(d.timezone.utc);print(t.strftime('%Y-%m-%dT%H:%M:%S.')+f'{t.microsecond//1000:03d}Z')`]).toString().trim(); return s; };
for (const rep of ['customer_payment', 'vendor_bill_payment', 'customer_credit_memo', 'vendor_credit_memo']) {
  const r = await get(`/reporting/export/${rep}?report=${rep}&start_date=${encodeURIComponent(inst('2026-09-30', false))}&end_date=${encodeURIComponent(inst('2026-12-31', true))}&range=custom`);
  fs.writeFileSync(O + 'export_' + rep + '.json', JSON.stringify(r.j)); log.steps.push({ rep, s: r.s, lines: typeof r.j?.data?.[0] === 'string' ? r.j.data[0].split('\n').length : null });
}
log.end = await rule99(page, loc); save(EV + 'ledgers.json', log); console.log('ledgers done'); await browser.close();
