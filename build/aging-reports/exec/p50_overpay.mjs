// p50_overpay.mjs — 11 Nov 2026: C715462 needs "an invoice of $100.00 paid $120.00 (overpaid)". The payment call refused it (p46 R15:
// 400 "Transaction cannot be overpaid."). Route 2: the customer's New Payment screen — type 120.00 in the $100 invoice's Payment box, and
// separately the dialog's total amount box, Make Payment; record every message, the field's value after typing (a screen may cap it at the
// balance), the request sent and its answer, and the invoice's balance after. Customer ZZX Overpaid R5 (p46r5). Output p50/out.json + pictures.
import { start } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./p50/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/customers'); const p = s.page; const o = { tries: [] };
const R = JSON.parse(fs.readFileSync(new URL('./p46r5/out.json', import.meta.url))).sets.R15[0]; const num = R.docs[0].num; o.customer = R.name; o.invoice = num;
const reqs = []; p.on('request', (r) => { if (r.method() === 'POST' && /payment/i.test(r.url())) reqs.push({ u: r.url().replace(/^.*\/api/, '/api'), b: (r.postData() || '').slice(0, 1500) }); });
p.on('response', async (r) => { if (r.request().method() === 'POST' && /payment/i.test(r.url())) reqs.push({ u: r.url().replace(/^.*\/api/, '/api'), st: r.status(), body: (await r.text().catch(() => '')).slice(0, 400) }); });
const notes = async () => (await p.locator('.q-notification, .q-field__messages, .text-negative').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
try {
  for (const mode of ['row-box', 'total-box']) { const t = { mode };
    await s.go('/customers/' + R.cid); await p.waitForTimeout(3500); const np = p.getByRole('button', { name: /New Payment/i }).first(); t.np = await np.count(); if (!t.np) { o.tries.push(t); continue; }
    await np.click(); await p.waitForTimeout(2500); t.form = (await p.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900); await s.shot(mode + '-1-form');
    const pm = p.locator('.q-dialog .q-field').filter({ hasText: /Payment Method/ }).first(); if (await pm.count()) { await pm.click(); await p.waitForTimeout(800); await p.locator('.q-menu .q-item').filter({ hasText: /Cash/ }).first().click().catch(() => {}); }
    const rowInput = p.locator('.q-dialog tr').filter({ hasText: num }).locator('input').first(); const total = p.locator('.q-dialog input').filter({ hasNot: p.locator('xx') });
    const tgt = mode === 'row-box' ? rowInput : p.locator('.q-dialog .q-field').filter({ hasText: /Amount|Payment Amount/i }).locator('input').first();
    t.tgt = await tgt.count(); if (!t.tgt) { t.inputs = await p.locator('.q-dialog input').evaluateAll((es) => es.map((e) => ({ v: e.value, ph: e.placeholder, aria: e.getAttribute('aria-label') }))); o.tries.push(t); await p.keyboard.press('Escape'); continue; }
    await tgt.click(); await tgt.fill(''); await tgt.type('120.00'); await p.keyboard.press('Tab'); await p.waitForTimeout(1200); t.valueAfter = await tgt.inputValue().catch(() => null); t.notesTyped = await notes(); await s.shot(mode + '-2-typed-120');
    const mk = p.locator('.q-dialog').getByRole('button', { name: /Make Payment/i }).first(); t.makeDisabled = await mk.isDisabled().catch(() => null);
    const n0 = reqs.length; if (!t.makeDisabled) { await mk.click().catch((e) => { t.clickErr = String(e).slice(0, 150); }); await p.waitForTimeout(4000); }
    t.notesAfter = await notes(); t.calls = reqs.slice(n0); await s.shot(mode + '-3-after'); await p.keyboard.press('Escape').catch(() => {}); o.tries.push(t);
    fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); }
  const un = await p.evaluate(async (acct) => { const r = await fetch('https://sv11315api.qa.shopview.com/api/customer-account/list-unpaid-transaction?accountId=' + acct + '&openOnly=true', { credentials: 'include', headers: { Accept: 'application/json' } }); return r.json().catch(() => null); }, R.acct);
  o.unpaid = JSON.stringify(un).slice(0, 1500);
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 1500)); await s.close(); process.exit(0);
