// vseed.mjs — 11 Nov 2026: the vendor helpers of p49_seed_ap.mjs as a module: mkV(a, p, log, SFX) -> {vendor, bill, credit, account, pay, setTerm, ymd}.
// pay(v, d, amount, when) takes an optional payment day ('YYYY-MM-DD'); bill/credit take daysAgo. See p49 for the recipes.
import { A } from './lib.mjs'; import * as S from './seedlib.mjs';
export function mkV(a, p, log, SFX = '') { const HD = S.WP.heavy; const o = { disc: {} };
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
async function pay(v, d, amount, when) { const acct = await account(v); if (!acct) throw new Error('no vendor account id for ' + v.name);
  const un = await a.get(`/api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId=${acct}&pagination%5BrowsPerPage%5D=1000`); const found = []; const walk = (x) => { if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object') { if ('reference_id' in x && 'amount' in x) found.push(x); else Object.values(x).forEach(walk); } }; walk(un.j);
  const t = found.find((x) => String(x.invoice_number) === String(d.number)) || found.find((x) => Number(x.amount) === d.amount && Number(x.balance) === d.amount); if (!t) throw new Error('unpaid bill not found ' + d.number + ' among ' + found.length);
  const body = { account_id: acct, payment_date: (when || ymd(Math.max(0, d.daysAgo - 1))) + 'T18:00:00.000Z', payment_method: METHOD, reference_number: 'ZZYPAY' + (Date.now() % 1e6), description: 'ZZAUTOTEST aging part payment', transactions: [{ ...t, transaction_payment_amount: amount }], payment_amount: amount };
  const r = await a.post('/api/parts-catalogue/vendor/payment/create', body); o.disc.lastPay = { st: r.st, j: JSON.stringify(r.j).slice(0, 300) }; if (r.st >= 300) throw new Error('pay ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 300)); log('  paid ' + amount + ' on ' + d.number); }
async function setTerm(v, term) { const g = await a.get('/api/parts-catalogue/vendor/' + v.id); const cur = g.j?.data?.vendor || g.j?.data || {}; o.disc.vendorKeys = Object.keys(cur);
  const body = { ...cur, vendor_id: v.id, id: v.id, credit_term: term }; const r = await a.post('/api/parts-catalogue/change-vendor', body); o.disc.changeVendor = { st: r.st, j: JSON.stringify(r.j).slice(0, 300) }; if (r.st >= 300) throw new Error('change-vendor ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 200)); v.term = term; log('  term -> ' + term); }
return { vendor, bill, credit, account, pay, setTerm, ymd, disc: o.disc }; }
