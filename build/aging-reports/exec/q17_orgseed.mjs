// q17_orgseed.mjs — 12 Nov 2026: seed the QA lead's new EMPTY organization on sv11315 (account bilal.muzamil+reportsFM, one location "Loc1",
// time zone Africa/Abidjan = UTC; sign-in values in /tmp only) for the two tests he moved there:
//  C797943 — A/P Summary Vendor menu with 8 vendors or fewer: the org has ONE vendor, "ZZORG Vendor A" (made in probe 3), given an unpaid $50 bill
//            dated today (PO create + receive, shape of seedlib.bill, category "Uncategorized" of THIS org, tax "Exempt").
//  C715468 — A/R Summary PDF at exactly 2,000 / 2,001 customers: 2,000 customers "ZZORG C0001…C2000", each with one $1.00 credit memo dated
//            2026-11-10 (date A), and "ZZORG C2001 Late" with one dated 2026-11-11 (date B). The probe customer's memo is dated 12 Nov, so it is
//            in neither date. Route per customer (proven 12 Nov, orgprobe2): customers/create -> customers/view (customer_account_id) -> credit-memos.
//            10 at a time inside the page; progress in q17/done.json so a re-run resumes. Then the A/R Summary row counts for both dates are read.
import { orgBoot } from './orgboot.mjs'; import { randomUUID } from 'crypto'; import fs from 'fs';
const OUT = new URL('./q17/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const DONE = OUT + 'done.json';
const r = await orgBoot('/customers'); const p = r.page; const o = { log: [] }; const log = (t) => { console.log(t); o.log.push(t); fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); };
const call = (m, u, b) => p.evaluate(async ([m, u, b]) => { const x = await fetch('https://sv11315api.qa.shopview.com' + u, { method: m, credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); let j = null; try { j = await x.json(); } catch {} return { st: x.status, j }; }, [m, u, b]);
const TAX = '45b970d3-cdd5-4aa4-b52a-efb6342b8139', CAT = '20140573-a8ae-42d2-b3c2-3102e8b1b930', VID = '1236beee-2faf-45db-a054-ba5466d5529b';
const today = new Date().toISOString().slice(0, 10);
// 1. vendor A's unpaid bill (once)
if (!process.env.SKIP_BILL) { const amount = 50; const c = await call('POST', '/api/inventory/orders/create', { vendor_id: VID, note: null, items: [{ core_charge: null, core_id: null, ext_price: amount, id: randomUUID(), is_core: false, part_number: 'ZZORG-' + (Date.now() % 1e6), price: amount, price_decimal: amount, quantity: '1', manufacturer_id: null, category: CAT, description: 'ZZAUTOTEST org seed part', itemsPerPackage: null }] });
  log('po ' + c.st + ' ' + JSON.stringify(c.j).slice(0, 150)); const orderId = c.j?.data?.order_id;
  if (orderId) { const d = await call('GET', '/api/inventory/orders/' + orderId); const items = d.j.data.order.items.map((i) => ({ ...i, quantity_received: Number(i.quantity_ordered), total: Number(i.total_cost_decimal) }));
    const acc = await call('POST', '/api/inventory/orders/accept', { id: orderId, invoiceNumber: 'ZZORG-BILL-A1', invoiceDate: today + 'T12:00:00.000Z', note: 'ZZAUTOTEST org seed', items: JSON.stringify(items), total: amount, orderStatus: 'fulfilled', tax: 0 }); log('accept ' + acc.st + ' ' + JSON.stringify(acc.j).slice(0, 150)); } }
// 2. customers + credit memos
const done = new Set(fs.existsSync(DONE) ? JSON.parse(fs.readFileSync(DONE, 'utf8')) : []);
const jobs = []; for (let i = 1; i <= 2000; i++) jobs.push({ name: 'ZZORG C' + String(i).padStart(4, '0'), date: '2026-11-10T07:00:00.000Z' }); jobs.push({ name: 'ZZORG C2001 Late', date: '2026-11-11T07:00:00.000Z' });
const todo = jobs.filter((j) => !done.has(j.name)); log('customers to make: ' + todo.length + ' (already done ' + done.size + ')'); const fails = [];
for (let k = 0; k < todo.length; k += 20) { const batch = todo.slice(k, k + 20);
  const res = await p.evaluate(async (batch) => { const api = 'https://sv11315api.qa.shopview.com'; const H = { Accept: 'application/json', 'Content-Type': 'application/json' };
    const one = async (b) => { try { const c = await fetch(api + '/api/customers/create', { method: 'POST', credentials: 'include', headers: H, body: JSON.stringify({ name: b.name }) }); const cj = await c.json().catch(() => null); const cid = cj?.data?.company_id; if (!cid) return [b.name, 'create ' + c.status + ' ' + JSON.stringify(cj).slice(0, 100)];
        const v = await fetch(api + '/api/customers/view/' + cid, { credentials: 'include', headers: H }); const vj = await v.json().catch(() => null); const acct = vj?.data?.customer_account_id || vj?.data?.company?.customer_account_id; if (!acct) return [b.name, 'view ' + v.status];
        const m = await fetch(api + '/api/credit-memos', { method: 'POST', credentials: 'include', headers: H, body: JSON.stringify({ customerAccountId: acct, amount: 1, reason: 'ZZAUTOTEST org seed for C715468', originKind: 'manual', originDate: b.date }) }); return [b.name, m.status < 300 ? 'ok' : 'memo ' + m.status]; } catch (e) { return [b.name, 'err ' + String(e).slice(0, 80)]; } };
    const out = []; for (let i = 0; i < batch.length; i += 10) out.push(...(await Promise.all(batch.slice(i, i + 10).map(one)))); return out; }, batch);
  for (const [n, s] of res) { if (s === 'ok') done.add(n); else fails.push([n, s]); }
  fs.writeFileSync(DONE, JSON.stringify([...done])); if ((k / 20) % 10 === 0) log(`progress ${done.size}/2001, fails ${fails.length}${fails.length ? ' last: ' + JSON.stringify(fails.at(-1)) : ''}`);
  if (fails.length > 30) { log('too many failures - stopping: ' + JSON.stringify(fails.slice(-5))); break; } }
o.fails = fails;
// 3. read back
for (const d of ['2026-11-10', '2026-11-11', today]) { const a = await call('GET', `/api/reporting/reports/ar-aging-summary?asOfDate=${d}&pagination[page]=1&pagination[rowsPerPage]=10`); o['ars ' + d] = [a.st, a.j?.data?.pagination, (a.j?.data?.collection || []).length]; }
const v = await call('GET', `/api/reporting/reports/ap-aging-summary?asOfDate=${today}&pagination[page]=1&pagination[rowsPerPage]=10`); o.aps = [v.st, (v.j?.data?.collection || []).map((x) => [x.vendorName, x.totalCents])];
const vl = await call('GET', '/api/parts-catalogue/vendors?search='); o.vendorCount = (Array.isArray(vl.j?.data) ? vl.j.data : vl.j?.data?.collection ?? []).length;
log('done: ' + JSON.stringify({ made: done.size, fails: fails.length, a10: o['ars 2026-11-10'], a11: o['ars 2026-11-11'], aps: o.aps, vendorCount: o.vendorCount }).slice(0, 600)); await r.browser.close(); process.exit(0);
