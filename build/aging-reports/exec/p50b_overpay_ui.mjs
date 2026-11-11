// p50b_overpay_ui.mjs — 11 Nov 2026: C715462 setup, second try through the screen (p50 found no "New Payment" on the customer's main page).
// Route A (playbook 019 "Create a payment"): open the $100 invoice's work order /workorders/{wo}/lines → Finance tab → New Payment → method
// Cash → amount 120.00 → Make Payment. Route B: the customer's page — list its tabs, open the one holding transactions, tick the $100
// invoice's row, New Payment, amount 120.00, Make Payment. Records every message, the amount box's value after typing, the requests sent
// and their answers, then the invoice's balance. Stops after the first route that takes the payment. Output p50b/out.json + pictures.
import { start } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./p50b/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/customers'); const p = s.page; const o = { tries: [] };
const R = JSON.parse(fs.readFileSync(new URL('./p46r5/out.json', import.meta.url))).sets.R15[0]; const D = R.docs[0]; o.customer = R.name; o.invoice = D.num;
const reqs = []; p.on('request', (r) => { if (r.method() === 'POST' && /payment/i.test(r.url())) reqs.push({ u: r.url().replace(/^.*\/api/, '/api'), b: (r.postData() || '').slice(0, 1500) }); });
p.on('response', async (r) => { if (r.request().method() === 'POST' && /payment/i.test(r.url())) reqs.push({ u: r.url().replace(/^.*\/api/, '/api'), st: r.status(), body: (await r.text().catch(() => '')).slice(0, 400) }); });
const notes = async () => (await p.locator('.q-notification, .q-field__messages, .text-negative').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
const balance = async () => { const un = await p.evaluate(async (acct) => { const r = await fetch('https://sv11315api.qa.shopview.com/api/customer-account/list-unpaid-transaction?accountId=' + acct + '&openOnly=false', { credentials: 'include', headers: { Accept: 'application/json' } }); return r.json().catch(() => null); }, R.acct);
  const c = un?.data?.response?.collection || []; return c.filter((x) => x.invoice_display_number === D.num).map((x) => ({ amount: x.amount, balance: x.balance, paid: x.amount_paid, status: x.status })); };
async function payDialog(t, tag) { const dlg = p.locator('.q-dialog').last(); t.form = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900); await s.shot(tag + '-1-form');
  const pm = dlg.locator('.q-field').filter({ hasText: /Payment Method|Method/ }).first(); if (await pm.count()) { await pm.click(); await p.waitForTimeout(800); t.methods = await p.locator('.q-menu .q-item').allInnerTexts().catch(() => []); await p.locator('.q-menu .q-item').filter({ hasText: /Cash/ }).first().click().catch(() => {}); await p.waitForTimeout(500); }
  t.inputs = await dlg.locator('input').evaluateAll((es) => es.map((e) => ({ v: e.value, ph: e.placeholder, aria: e.getAttribute('aria-label'), tid: e.getAttribute('data-test-id') })));
  let amt = dlg.locator('[data-test-id="input_payment_amount"]'); if (!(await amt.count())) amt = dlg.locator('.q-field').filter({ hasText: /Amount/i }).locator('input').first();
  t.amt = await amt.count(); if (!t.amt) return false; await amt.click(); await amt.fill(''); await amt.type('120.00'); await p.keyboard.press('Tab'); await p.waitForTimeout(1200);
  t.valueAfter = await amt.inputValue().catch(() => null); t.notesTyped = await notes(); await s.shot(tag + '-2-typed-120');
  const mk = dlg.getByRole('button', { name: /Make Payment|Save|Apply/i }).last(); t.makeLabel = await mk.innerText().catch(() => null); t.makeDisabled = await mk.isDisabled().catch(() => null);
  const n0 = reqs.length; if (!t.makeDisabled) { await mk.click().catch((e) => { t.clickErr = String(e).slice(0, 150); }); await p.waitForTimeout(4500); }
  t.notesAfter = await notes(); t.calls = reqs.slice(n0); await s.shot(tag + '-3-after'); await p.keyboard.press('Escape').catch(() => {}); return t.calls.some((c) => c.st && c.st < 300); }
try {
  o.before = await balance();
  { const t = { route: 'A-work-order-finance' }; await s.go('/workorders/' + D.wo + '/lines'); await p.waitForTimeout(5000); t.url = p.url(); await s.shot('A-0-wo');
    const ft = p.locator('[data-test-id="link_finance_tab"]').first(); t.finance = await ft.count(); if (t.finance) { await ft.click(); await p.waitForTimeout(4000); await s.shot('A-1-finance');
      t.buttons = await p.locator('main button').allInnerTexts().catch(() => []); const np = p.getByRole('button', { name: /New Payment/i }).first(); t.np = await np.count();
      if (t.np) { await np.click(); await p.waitForTimeout(2500); t.ok = await payDialog(t, 'A'); } }
    o.tries.push(t); fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); }
  if (!o.tries.some((t) => t.ok)) { const t = { route: 'B-customer-transactions' }; await s.go('/customers/' + R.cid); await p.waitForTimeout(4000); t.url = p.url();
    t.tabs = await p.locator('.q-tab, [role=tab]').allInnerTexts().catch(() => []); const tab = p.locator('.q-tab, [role=tab]').filter({ hasText: /Transactions|Payments|Invoices|Finance|Account/i }).first(); t.tab = await tab.innerText().catch(() => null);
    if (t.tab) { await tab.click(); await p.waitForTimeout(3500); } await s.shot('B-0-tab');
    const row = p.locator('tr').filter({ hasText: D.num }).first(); t.row = await row.count(); if (t.row) { const cb = row.locator('.q-checkbox, input[type=checkbox], [data-test-id^="checkbox_transaction"]').first(); t.cb = await cb.count(); if (t.cb) { await cb.click(); await p.waitForTimeout(1000); } }
    const np = p.locator('[data-test-id="button_new_payment"]').or(p.getByRole('button', { name: /New Payment/i })).first(); t.np = await np.count(); t.buttons = await p.locator('main button').allInnerTexts().catch(() => []);
    if (t.np) { await np.click(); await p.waitForTimeout(2500); t.ok = await payDialog(t, 'B'); } o.tries.push(t); }
  o.after = await balance();
} catch (e) { o.err = String(e).slice(0, 300); try { await s.shot('error'); } catch {} }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p50b', JSON.stringify({ before: o.before, after: o.after, tries: o.tries.map((t) => ({ route: t.route, np: t.np, value: t.valueAfter, notes: t.notesAfter, calls: (t.calls || []).filter((c) => c.st).map((c) => c.st + ' ' + c.body) })), err: o.err }).slice(0, 1500)); await s.close(); process.exit(0);
