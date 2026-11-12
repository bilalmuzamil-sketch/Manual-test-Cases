// q19_overpay_route.mjs — 12 Nov 2026: is there a LEGITIMATE route to an overpaid invoice (production has 16, PRD v11)? Payment routes refuse it
// (L0641, q13, pr16). Try: pay the $100 invoice S11315-17913 (customer "ZZX Overpaid Q13") in full, then its work order's Finance tab -> invoice menu
// (button_wo_invoice_menu) -> "Issue Credit" for $20 against it, reading every option of the dialog as displayed; then the invoice's balance.
// A negative balance = an overpaid invoice made by the product's own screens. Nothing is faked behind the product (Rule 115). Output q19/out.json.
import { start, REPORTS, A as APP } from './lib.mjs'; import { mk } from './api.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./q19/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const a = mk(p); const F = mkFilt(p); const o = {};
const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); const dlgText = async () => (await p.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900);
try {
  const L = await a.get('/api/customers?search=' + encodeURIComponent('ZZX Overpaid Q13')); const rows = Array.isArray(L.j?.data) ? L.j.data : L.j?.data?.collection ?? []; const c = rows.find((x) => (x.name || x.company_name) === 'ZZX Overpaid Q13'); o.cid = c?.id || c?.company_id;
  const v = await a.get('/api/customers/view/' + o.cid); o.acct = v.j?.data?.customer_account_id || v.j?.data?.company?.customer_account_id;
  const un = async () => (await a.get(`/api/customer-account/list-unpaid-transaction?accountId=${o.acct}&openOnly=false`)).j?.data?.response?.collection || [];
  let row = (await un()).find((x) => x.invoice_display_number === 'S11315-17913'); o.before = row && { amount: row.amount, balance: row.balance, paid: row.amount_paid };
  if (row && Number(row.balance) > 0) { const pay = await a.post('/api/customer-account/create-customer-payment', { account_id: o.acct, payment_date: '2026-11-12 09:00:00', payment_method: 'CASH', reference_number: 'ZZFULL', description: 'ZZAUTOTEST pay in full before credit', transactions: [{ ...row, transaction_payment_amount: Number(row.balance) }], primary_id: row.id, new_credit: 0, new_deposit: 0, applied_credits: [], applied_deposits: [], ibs_batch_id: null, payment_amount: Number(row.balance) }); o.pay = pay.st; }
  row = (await un()).find((x) => x.invoice_display_number === 'S11315-17913'); o.afterPay = row && { amount: row.amount, balance: row.balance, paid: row.amount_paid, status: row.status }; save();
  await s.go(REPORTS.ard); await p.waitForTimeout(2500); await F.pick('Customer', 'ZZX Overpaid Q13'); o.chips = await F.chips(); await s.shot('0-ard');
  // the invoice is paid, so it may have left the report: go to the work order from the customer's page instead if needed
  let href = await p.locator('main tbody tr').filter({ hasText: 'S11315-17913' }).first().locator('a').first().getAttribute('href').catch(() => null);
  o.rowKeys = row && Object.keys(row); if (!href && row) { const wid = row.work_order_id || row.workOrderId || row.reference_id; if (wid) href = '/workorders/' + wid + '/finance'; }
  if (!href) { const wl = await a.get('/api/work-orders?search=S11315-17913'); const w = (Array.isArray(wl.j?.data) ? wl.j.data : wl.j?.data?.collection ?? [])[0]; o.woSearch = w && Object.keys(w).slice(0, 8); href = w && ('/workorders/' + (w.work_order_id || w.id) + '/finance'); }
  o.href = href; await p.goto(new URL(href, APP).toString(), { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); await s.shot('1-finance');
  await p.locator('[data-test-id="button_wo_invoice_menu"]').first().click(); await p.waitForTimeout(1200); o.menu = (await p.locator('.q-menu:visible').last().innerText().catch(() => '')).split('\n').map((t) => t.trim()).filter(Boolean); await s.shot('2-menu');
  await p.locator('.q-menu:visible').last().getByText('Issue Credit', { exact: true }).first().click(); await p.waitForTimeout(2500); o.dialog = await dlgText(); await s.shot('3-issue-credit');
  const d = p.locator('.q-dialog').last(); o.fields = await d.evaluate((e) => [...e.querySelectorAll('.q-field')].map((f) => f.innerText.replace(/\s+/g, ' ').trim().slice(0, 80)));
  const amt = d.locator('.q-field').filter({ hasText: /Amount/i }).locator('input').first(); if (await amt.count()) { await amt.click(); await amt.fill(''); await amt.type('20'); await p.keyboard.press('Tab'); await p.waitForTimeout(800); }
  const out = d.locator('.q-field').filter({ hasText: /Outcome/i }).first(); if (await out.count()) { await out.click(); await p.waitForTimeout(1000); o.outcomes = await p.locator('.q-menu:visible .q-item').allInnerTexts().catch(() => []); await s.shot('4-outcomes');
    const pick = o.outcomes.find((t) => /invoice|apply/i.test(t)) || o.outcomes.find((t) => /store credit/i.test(t)) || o.outcomes[0]; o.picked = pick; if (pick) await p.locator('.q-menu:visible .q-item').filter({ hasText: pick }).first().click(); await p.waitForTimeout(800); }
  const reason = d.locator('textarea, .q-field').filter({ hasText: /Reason/i }).locator('textarea, input').first(); if (await reason.count()) await reason.fill('ZZAUTOTEST overpaid route check');
  o.dialog2 = await dlgText(); await s.shot('5-filled'); const btn = d.getByRole('button', { name: /Issue Credit|Issue Refund|Save|Confirm/i }).last(); o.btn = await btn.innerText().catch(() => null); o.btnDisabled = await btn.isDisabled().catch(() => null);
  if (o.btnDisabled === false) { await btn.click(); await p.waitForTimeout(4000); o.notes = await p.locator('.q-notification').allInnerTexts().catch(() => []); await s.shot('6-after'); }
  row = (await un()).find((x) => x.invoice_display_number === 'S11315-17913'); o.afterCredit = row && { amount: row.amount, balance: row.balance, paid: row.amount_paid, status: row.status };
} catch (e) { o.err = String(e).slice(0, 300); await s.shot('error'); }
save(); console.log(JSON.stringify({ before: o.before, pay: o.pay, afterPay: o.afterPay, menu: o.menu, fields: o.fields, outcomes: o.outcomes, picked: o.picked, btn: o.btn, notes: o.notes, afterCredit: o.afterCredit, err: o.err }).slice(0, 2000)); await s.close(); process.exit(0);
