// p49_seed_ap.mjs — 11 Nov 2026: A/P exact-amount test data on sv11315 (the vendor twin of p46). Vendors are named "ZZY <set> <letter><SFX>".
// Bill: seedlib.bill() (PO + receive, invoiceDate T18:00Z on the day). Bill at Lethbridge: change-location first. Vendor credit on a day:
// manual return of inventory part P550848 (p25) then manual-return/<id>/create with creditDate. Part payment: vendor/payment/create with the FULL
// transaction from list-unpaid-by-vendor-account + transaction_payment_amount (playbook 005-e-parts); the vendor ACCOUNT id is read from the
// request the vendor's Unpaid Invoices page makes. Term switch: parts-catalogue/change-vendor. Every vendor is read back from A/P Detail.
// Output p49/out.json (OUTDIR=), log p49.log. ONLY=V1,V2… SFX=" R1".
import { start, A, API } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import fs from 'fs';
const OUT = new URL('./' + (process.env.OUTDIR || 'p49') + '/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const s = await start(OUT, '/parts/vendors'); const p = s.page; const a = mk(p); const HD = S.WP.heavy, LB = S.WP.leth; const SFX = process.env.SFX || '';
const o = { sets: {}, disc: {} }; const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); const log = (t) => { console.log(t); (o.log ||= []).push(t); };
const ymd = (daysAgo) => new Date(Date.UTC(2026, 10, 11 - daysAgo)).toISOString().slice(0, 10);
const ok = (tag, r) => { if (r.st >= 300) throw new Error(tag + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); return r.j; };
let METHOD = process.env.METHOD || '10000_CALGARY_CHEQUING';
async function vendor(name, term) { const id = await S.vendor(a, name + SFX, term); const v = { name: name + SFX, id, term, docs: [] }; log('vendor ' + v.name + ' ' + term); return v; }
async function bill(v, amount, daysAgo, wp = HD, tag = '') { if (wp !== HD) await S.loc(a, wp); const number = 'ZZY' + (Date.now() % 1e8); const b = await S.bill(a, v.id, { amount, date: ymd(daysAgo), number }); if (wp !== HD) await S.loc(a);
  const d = { tag, number, orderId: b.orderId, amount, daysAgo, wp: wp === HD ? 'HD' : 'LB', term: v.term }; v.docs.push(d); log('  bill ' + number + ' ' + amount + ' dated -' + daysAgo + ' ' + v.term + ' ' + d.wp); return d; }
async function credit(v, amount, daysAgo, wp = HD, tag = '') { if (wp !== HD) await S.loc(a, wp);
  const rq = ok('return-request', await a.post('/api/part/manual-return-request/create', { vendorId: v.id, packagingSlip: 'ZZY-SLIP-' + (Date.now() % 1e6), items: [{ inventoryPartId: '000657fe-522f-4c3f-9680-621c5449e2bd', partNumber: 'P550848', partDescription: 'FUEL/WATER SEPARATOR, (FS19732, 33732, BF1385-SPS)', quantity: 1, costDecimal: amount }] }));
  const rid = rq?.data?.id || rq?.data?.return_id || rq?.data?.manual_return_id || rq?.id; if (!rid) throw new Error('no return id ' + JSON.stringify(rq).slice(0, 200));
  const when = daysAgo === 0 ? '2026-11-11T08:00:00.000Z' : ymd(daysAgo) + 'T18:00:00.000Z'; const num = 'ZZYCM' + (Date.now() % 1e7);
  ok('return-credit', await a.post(`/api/part/manual-return/${rid}/create`, { creditMemoNumber: num, creditDate: when, tax: 0, note: null })); if (wp !== HD) await S.loc(a);
  const d = { tag, number: num, amount: -amount, daysAgo, credit: true, wp: wp === HD ? 'HD' : 'LB' }; v.docs.push(d); log('  vendor credit ' + num + ' ' + amount + ' dated -' + daysAgo); return d; }
async function account(v) { if (v.acct) return v.acct; let acct = null; const h = (r) => { const m = /accountId=([0-9a-f-]{36})/.exec(r.url()); if (m) acct = m[1]; if (/payment-method|paymentMethod|accounting\/accounts|chart/.test(r.url())) (o.disc.methodCalls ||= []).push(r.url().slice(-160)); };
  p.on('request', h); for (let i = 0; i < 3 && !acct; i++) { await p.goto(A + '/parts/vendor/' + v.id + '/unpaid-invoices'); await p.waitForTimeout(4000 + 3000 * i); } p.off('request', h); v.acct = acct; return acct; } /* 11 Nov: V3 once saw no accountId request in 4 s; up to three loads now */
async function pay(v, d, amount) { const acct = await account(v); if (!acct) throw new Error('no vendor account id for ' + v.name);
  const un = await a.get(`/api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId=${acct}&pagination%5BrowsPerPage%5D=1000`); const found = []; const walk = (x) => { if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object') { if ('reference_id' in x && 'amount' in x) found.push(x); else Object.values(x).forEach(walk); } }; walk(un.j);
  const t = found.find((x) => String(x.invoice_number) === String(d.number)) || found.find((x) => Number(x.amount) === d.amount && Number(x.balance) === d.amount); if (!t) throw new Error('unpaid bill not found ' + d.number + ' among ' + found.length);
  const body = { account_id: acct, payment_date: ymd(Math.max(0, d.daysAgo - 1)) + 'T18:00:00.000Z', payment_method: METHOD, reference_number: 'ZZYPAY' + (Date.now() % 1e6), description: 'ZZAUTOTEST aging part payment', transactions: [{ ...t, transaction_payment_amount: amount }], payment_amount: amount };
  const r = await a.post('/api/parts-catalogue/vendor/payment/create', body); o.disc.lastPay = { st: r.st, j: JSON.stringify(r.j).slice(0, 300) }; if (r.st >= 300) throw new Error('pay ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); log('  paid ' + amount + ' on ' + d.number); }
async function setTerm(v, term) { const g = await a.get('/api/parts-catalogue/vendor/' + v.id); const cur = g.j?.data?.vendor || g.j?.data || {}; o.disc.vendorKeys = Object.keys(cur);
  const body = { ...cur, vendor_id: v.id, id: v.id, credit_term: term }; const r = await a.post('/api/parts-catalogue/change-vendor', body); o.disc.changeVendor = { st: r.st, j: JSON.stringify(r.j).slice(0, 300) }; if (r.st >= 300) throw new Error('change-vendor ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 200)); v.term = term; log('  term -> ' + term); }
const SETS = {
  V1: async () => { const out = []; for (const [n, v] of [['A', [100, 200, 300, 250, 350]], ['B', [300, 100, 200, 350, 150]], ['C', [200, 300, 100, 150, 250]]]) { const x = await vendor('ZZY Sort Vend ' + n, 'Net 30');
    await bill(x, v[0], 5, HD, 'current'); await bill(x, v[1], 45, HD, '1-30'); await bill(x, v[2], 75, HD, '31-60'); await bill(x, v[3], 105, HD, '61-90'); await bill(x, v[4], 150, HD, '91+'); out.push(x); } return out; },
  V2: async () => { const A_ = await vendor('ZZY Doc Vend A', 'Net 30'); const dA = await bill(A_, 300, 40, HD, 'A'); await pay(A_, dA, 250); const B = await vendor('ZZY Doc Vend B', 'COD'); await bill(B, 100, 20, HD, 'B');
    const C = await vendor('ZZY Doc Vend C', 'Net 30'); const dC = await bill(C, 200, 35, HD, 'C'); await pay(C, dC, 50); return [A_, B, C]; },
  V3: async () => { const G = await vendor('ZZY Doc Group', 'Net 30'); const dA = await bill(G, 300, 40, HD, 'A'); await pay(G, dA, 250); const dC = await bill(G, 200, 35, HD, 'C'); await pay(G, dC, 50); await setTerm(G, 'COD'); await bill(G, 100, 20, HD, 'B'); return [G]; },
  V4: async () => { const v = await vendor('ZZY CSV Sum A', 'COD'); await bill(v, 1250.5, 15, HD, '1-30'); await bill(v, 99, 100, HD, '91+'); return [v]; },
  V5: async () => { const v = await vendor('ZZY CSV Det A', 'COD'); await bill(v, 1250.5, 45, HD, 'A'); await bill(v, 75, 15, HD, 'B'); return [v]; },
  V6: async () => { const A_ = await vendor('ZZY Tot Vend A', 'COD'); await bill(A_, 1000, 15, HD, 'A-1000'); await bill(A_, 400, 45, LB, 'A-400-LB'); await credit(A_, 150, 5, HD, 'A-credit');
    const B = await vendor('ZZY Tot Vend B', 'COD'); await bill(B, 700, 45, HD, 'B-700'); await bill(B, 250, 100, LB, 'B-250-LB'); const C = await vendor('ZZY Tot Vend C', 'COD'); await bill(C, 900, 5, HD, 'C-900'); return [A_, B, C]; },
  V8: async () => { const A_ = await vendor('ZZY Bkt Vend A', 'Net 30'); await bill(A_, 1000, 5, HD, 'A-notdue'); await bill(A_, 400, 75, HD, 'A-400'); await bill(A_, 300, 45, LB, 'A-300-LB');
    const B = await vendor('ZZY Bkt Vend B', 'Net 30'); const d = await bill(B, 700, 75, HD, 'B-700'); await pay(B, d, 200); await bill(B, 250, 130, HD, 'B-250'); return [A_, B]; },
  V9: async () => { const v = await vendor('ZZY Bounds', 'Net 30'); await bill(v, 10, 5, HD, 'notdue'); for (const [amt, pd] of [[1, 1], [30, 30], [31, 31], [60, 60], [61, 61], [90, 90], [91, 91]]) await bill(v, amt, 30 + pd, HD, String(pd)); return [v]; },
  V12: async () => { const A_ = await vendor('ZZY Diff Vend A', 'Net 30'); await bill(A_, 1000, 5, HD, 'A-notdue'); await bill(A_, 400, 75, HD, 'A-400'); await bill(A_, 300, 45, HD, 'A-300'); await credit(A_, 150, 5, HD, 'A-credit');
    const B = await vendor('ZZY Diff Vend B', 'Net 30'); await bill(B, 500, 75, HD, 'B-500'); await bill(B, 250, 130, HD, 'B-250'); return [A_, B]; },
  V14: async () => { const v = await vendor('ZZY Credit Today', 'COD'); await bill(v, 500, 20, HD, 'A'); await credit(v, 120, 0, HD, 'credit-today'); return [v]; },
  V16: async () => { /* C715310, C715311: bills due 10 and 20 days ago and a vendor credit dated 15 days ago (between them) */ const v = await vendor('ZZY Credit Sort', 'COD'); await bill(v, 300, 10, HD, 'A'); await bill(v, 100, 20, HD, 'B'); await credit(v, 75, 15, HD, 'credit-A'); return [v]; },
  V15: async () => { const v = await vendor('ZZY 101 Bills', 'COD'); for (let i = 1; i <= 101; i++) await bill(v, 10, 10, HD, 'b' + i); return [v]; },
};
await p.waitForTimeout(2000); await S.loc(a);
const ONLY = process.env.ONLY?.split(',');
for (const [k, fn] of Object.entries(SETS)) { if (ONLY && !ONLY.includes(k)) continue; log('== ' + k);
  try { const vs = await fn(); o.sets[k] = vs.map((v) => ({ name: v.name, id: v.id, acct: v.acct, docs: v.docs }));
    for (const v of vs) { const r = await a.get(`/api/reporting/reports/ap-aging-detail?asOfDate=2026-11-11&vendors=${v.id}`); const g = (r.j?.data?.groups || []).map((x) => [x.bucket, x.rowsNumber, x.openBalanceCents]); o.sets[k].find((x) => x.id === v.id).groups = g; log('  read back ' + v.name + ' ' + JSON.stringify(g)); } }
  catch (e) { log('  ERR ' + String(e).slice(0, 400)); o.sets[k + '-err'] = String(e).slice(0, 400); }
  save(); }
save(); await s.close(); process.exit(0);
