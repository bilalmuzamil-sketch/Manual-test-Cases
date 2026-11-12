// q13_refusals.mjs — 12 Nov 2026: RETEST on build v26.45.3-34788b2 (QA lead: retest every Blocked test) of p66_seed_four (11 Nov) plus the overpaid INVOICE (p46 R15). Names carry Q13.
// (p66 header follows) p66_seed_four.mjs — 11 Nov 2026: data for the QA lead's four extra tests (run 557): C1078998 an A/R invoice with NO due date stored (Net 30,
// created 40 days ago); C1078999 an A/P bill with no due date (vendor with no credit term, then term cleared - whichever leaves due_date empty);
// C1079000 a $100 bill paid $110 (API first, then the vendor's Unpaid Invoices screen). Reads back what is stored. Output p66/out.json + pictures.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import * as S from './seedlib.mjs'; import { mkX } from './xseed_nodue.mjs'; import { mkV } from './vseed.mjs'; import fs from 'fs';
const OUT = new URL('./q13/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/customers'); const p = s.page; const a = mk(p); const o = {}; const log = (t) => { console.log(t); (o.log ||= []).push(t); };
const X = mkX(a, log); const V = mkV(a, p, log, ' Q13b') /* Q13 names already used by the first try */; const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
// 1. A/R invoice with no due date
if (!process.env.ONLY_AP) try { const c = await X.customer('ZZR No Due Date Q13', 'Net 30'); const d = await X.invoice(c, 40, 40, S.WP.heavy, 'nodue'); o.ar = { name: c.name, cid: c.cid, acct: c.acct, num: d.num, invoiceId: d.invoiceId };
  const un = await a.get(`/api/customer-account/list-unpaid-transaction?accountId=${c.acct}&openOnly=true`); o.ar.stored = (un.j?.data?.response?.collection || []).map((x) => ({ n: x.invoice_display_number, date: x.date, due: x.due_date, bal: x.balance }));
} catch (e) { o.arErr = String(e).slice(0, 300); } save();
// 2. A/P bill with no due date: vendor made with an empty credit term
for (const term of ['', null]) { if (o.ap?.stored?.some((x) => !x.due)) break; try { const id = await S.vendor(a, 'ZZRV No Due Date Q13c ' + (term === '' ? 'E' : 'N'), term); const b = await S.bill(a, id, { amount: 25, date: '2026-10-20', number: 'ZZRV-NODUE-Q13-' + (Date.now() % 1e4) + (term === '' ? 'E' : 'N') });
  await p.goto('https://sv11315.qa.shopview.com/parts/vendor/' + id + '/unpaid-invoices'); await p.waitForTimeout(4000); const acctCall = await a.get('/api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?vendorId=' + id).catch(() => null);
  const v = { id, term, bill: b }; const tx = await a.get('/api/reporting/reports/ap-unpaid-invoices?asOfDate=2026-11-11&vendors=' + id); v.reportRows = (tx.j?.data?.collection?.[0]?.rows || []).map((x) => [x.documentNumber, x.dueDate, x.daysPastDue]); v.raw = JSON.stringify(acctCall?.j || {}).slice(0, 300); o.ap = v; log('vendor term ' + JSON.stringify(term) + ' rows ' + JSON.stringify(v.reportRows));
} catch (e) { (o.apErr ||= []).push(String(e).slice(0, 300)); } save(); }
if (process.env.SKIP_OP) { save(); console.log('q13', JSON.stringify({ ap: o.ap, apErr: o.apErr }).slice(0, 1200)); await s.close(); process.exit(0); }
// 3. overpaid bill: API then screen
try { const v = await V.vendor('ZZRV Overpaid', 'COD'); const d = await V.bill(v, 100, 15, S.WP.heavy, 'bill-100'); o.op = { name: v.name, id: v.id, bill: d.number };
  try { await V.pay(v, d, 110, V.ymd(10)); o.op.api = 'paid 110'; } catch (e) { o.op.api = String(e).slice(0, 300); }
  await p.goto('https://sv11315.qa.shopview.com/parts/vendor/' + v.id + '/unpaid-invoices'); await p.waitForTimeout(5000); await s.shot('op-0-unpaid');
  const row = p.locator('tr').filter({ hasText: d.number }).first(); const cb = row.locator('[data-test-id^="checkbox_transaction"], .q-checkbox').first(); if (await cb.count()) await cb.click(); await p.waitForTimeout(800);
  const np = p.locator('[data-test-id="button_new_payment"]').or(p.getByRole('button', { name: /New Payment/i })).first(); o.op.np = await np.count(); if (o.op.np) { await np.click(); await p.waitForTimeout(2500); const dlg = p.locator('.q-dialog').last();
    const amt = dlg.locator('[data-test-id="input_payment_amount"]').or(dlg.locator('tr').filter({ hasText: d.number }).locator('input')).first(); if (await amt.count()) { await amt.click(); await amt.fill(''); await amt.type('110.00'); await p.keyboard.press('Tab'); await p.waitForTimeout(1200); o.op.value = await amt.inputValue(); }
    o.op.msgs = (await p.locator('.q-field__messages, .text-negative, .q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ')).filter(Boolean); o.op.makeDisabled = await dlg.getByRole('button', { name: /Make Payment/i }).first().isDisabled().catch(() => null); await s.shot('op-1-typed-110'); await p.keyboard.press('Escape'); }
} catch (e) { o.opErr = String(e).slice(0, 300); } save();
if (!process.env.ONLY_AP) // 4. overpaid INVOICE (C715462 / C1095432): a $100 invoice, then the app's payment call for $120
try { const c = await X.customer('ZZX Overpaid Q13', 'COD'); const d = await X.invoice(c, 100, 10, S.WP.heavy, 'paid-120'); o.oi = { name: c.name, num: d.num };
  try { await X.pay(c, d, 120); o.oi.api = 'paid 120'; } catch (e) { o.oi.api = String(e).slice(0, 300); }
  const un = await a.get(`/api/customer-account/list-unpaid-transaction?accountId=${c.acct}&openOnly=false`); o.oi.stored = (un.j?.data?.response?.collection || []).map((x) => ({ n: x.invoice_display_number, amt: x.amount, bal: x.balance }));
} catch (e) { o.oiErr = String(e).slice(0, 300); } save();
console.log('oi', JSON.stringify({ oi: o.oi, oiErr: o.oiErr }));
console.log('q13', JSON.stringify({ ar: o.ar?.stored, arErr: o.arErr, ap: o.ap?.reportRows, apErr: o.apErr, op: o.op && { api: o.op.api, msgs: o.op.msgs, dis: o.op.makeDisabled }, opErr: o.opErr }).slice(0, 1500)); await s.close(); process.exit(0);
