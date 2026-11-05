// sv12146.mjs — SV-12146 on screen, vendor "ZZAUTOTEST QA11839 Credit Vendor", Staging Heavy Duty - 9919 (TZ=America/Edmonton). SECRET-FREE.
// Phases: credit <amount> <memo> · probe-pay · pay <billInvoiceNo> <creditMemo> · read <tag> (Unpaid Invoices + Payments tabs, remittance slip download)
import fs from 'fs';
import { boot, finish, shot, sleep, LOC, APP, API } from '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04/tools/common.mjs';
const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-05'; const T = 'SV-12146';
const V = 'e5c02c82-811f-4f91-98c0-fe2bdbba5605'; const [phase, a1, a2] = process.argv.slice(2);
const { browser, page, rule99, app_version } = await boot(LOC.HD, { dest: '/parts/vendors' });
const net = []; page.on('response', async r => { if (r.request().method() !== 'GET' && r.url().includes('/api/') && /vendor|payment|credit/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 300); } catch {} net.push({ status: r.status(), url: r.url().replace(/^.*\/api/, '/api'), sent: (r.request().postData() || '').slice(0, 1500), body: b }); } });
const goUnpaid = async () => { await page.goto(`${APP}/parts/vendor/${V}/unpaid-invoices`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(9000); };
const tableRows = async sel => (await page.locator(`${sel} tbody tr`).allInnerTexts().catch(() => [])).map(x => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
const P = { phase, args: [a1, a2], app_version, rule99_start: rule99 };
const dlgInput = (dlg, id) => dlg.locator(`[data-test-id="${id}"]`).first().locator('xpath=self::input | .//input').first();
if (phase === 'credit') {
  await goUnpaid(); await page.locator('[data-test-id="button_new_credit_vendor"]').click(); await sleep(2500);
  const dlg = page.locator('.q-dialog').last();
  await dlgInput(dlg, 'input_credit_amount').fill(a1); await dlgInput(dlg, 'input_credit_memo').fill(a2).catch(async () => { await dlg.locator('[data-test-id="input_credit_memo"]').fill(a2); });
  P.pic = await shot(page, T, `1-new-credit-${a1}`); await dlg.locator('[data-test-id="button_save_credit"]').click(); await sleep(6000);
  await goUnpaid(); P.unpaid = await tableRows('[data-test-id="table-unpaid-transactions"]');
}
if (phase === 'probe-pay' || phase === 'pay') {
  await goUnpaid(); P.unpaid_before = await tableRows('[data-test-id="table-unpaid-transactions"]');
  for (const t of [a1, a2]) { const row = page.locator('[data-test-id="table-unpaid-transactions"] tbody tr').filter({ hasText: t }).first(); await row.locator('[data-test-id^="checkbox_transaction_"]').first().click(); await sleep(800); }
  await page.locator('[data-test-id="button_new_payment"]').click(); await sleep(4000);
  const dlg = page.locator('.q-dialog').last();
  P.dialog_rows = await dlg.locator('[data-test-id="table_transactions"] tbody tr').evaluateAll(trs => trs.map(tr => ({ text: tr.innerText.replace(/\s+/g, ' ').trim(), ids: [...tr.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')) })));
  P.dialog_text = (await dlg.innerText()).replace(/\s+/g, ' ').slice(0, 1200);
  P.pic_dialog = await shot(page, T, `2-new-payment-dialog-${phase}`);
  if (phase === 'pay') {
    const billRow = dlg.locator('[data-test-id="table_transactions"] tbody tr').filter({ hasText: a1 }).first();
    const credRow = dlg.locator('[data-test-id="table_transactions"] tbody tr').filter({ hasText: a2 }).first();
    for (const r of [billRow, credRow]) { const cb = r.locator('[data-test-id^="checkbox_select_transaction_"]').first(); if (await cb.count() && (await cb.getAttribute('aria-checked')) !== 'true') { await cb.click(); await sleep(1000); } }
    const pm = dlg.locator('[data-test-id="select_payment_method"]').first();
    if (await pm.count()) { await pm.click(); await sleep(1000); await page.locator('.q-menu .q-item').first().click(); await sleep(800); }
    P.dialog_after_select = (await dlg.innerText()).replace(/\s+/g, ' ').slice(0, 1500);
    P.inputs = await dlg.evaluate(d => [...d.querySelectorAll('[data-test-id]')].filter(e => /input_|batch_credit|text_payment|text_application|text_zero/.test(e.getAttribute('data-test-id'))).map(e => [e.getAttribute('data-test-id'), e.value ?? e.querySelector?.('input')?.value ?? e.innerText]));
    P.pic_ready = await shot(page, T, `3-payment-ready-${a1}`);
    await dlg.locator('[data-test-id="button_make_payment"]').first().click(); await sleep(7000);
    P.toasts = await page.locator('.q-notification').allInnerTexts().catch(() => []);
  }
}
if (phase === 'read') {
  await goUnpaid(); P.unpaid_open_only = await tableRows('[data-test-id="table-unpaid-transactions"]'); P.pic_unpaid = await shot(page, T, `4-unpaid-invoices-${a1}`);
  const tg = page.locator('[data-test-id="toggle_filter_open_invoices"]').first();
  if (await tg.count()) { await tg.click(); await sleep(5000); P.unpaid_all = await tableRows('[data-test-id="table-unpaid-transactions"]'); await tg.click(); await sleep(2000); }
  await page.goto(`${APP}/parts/vendor/${V}/payments`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(9000);
  for (const b of await page.locator('tbody tr i, tbody tr button').filter({ hasText: 'expand_more' }).all()) { await b.click().catch(() => {}); await sleep(1500); }
  P.payments_rows = (await page.locator('tbody tr').allInnerTexts()).map(x => x.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 20);
  P.pic_payments = await shot(page, T, `5-payments-tab-${a1}`, { fullPage: true });
  const ids = await page.evaluate(() => [...document.querySelectorAll('[data-test-id^="button_download_remittance_"]')].map(e => e.getAttribute('data-test-id').replace('button_download_remittance_', '')));
  P.remittances = [];
  for (const id of ids) {
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 40000 }).catch(() => null), page.locator(`[data-test-id="button_download_remittance_${id}"]`).first().click()]);
    await sleep(2000); let f = null;
    if (dl) { f = `/tmp/cln/qa11839/remit-${a1}-${id.slice(0, 8)}.pdf`; await dl.saveAs(f); }
    else { const p2 = page.context().pages().at(-1); if (p2 !== page) { P.remit_popup_url = p2.url(); await p2.close(); } }
    P.remittances.push({ payment_id: id, file: f });
  }
}
P.net = net; P.rule99_end = await finish(page, LOC.HD, rule99);
fs.mkdirSync(`${OUT}/${T}`, { recursive: true }); fs.writeFileSync(`${OUT}/${T}/step-${phase}-${a1 || ''}.json`, JSON.stringify(P, null, 1));
console.log(JSON.stringify({ unpaid: P.unpaid || P.unpaid_before, rows: P.dialog_rows, inputs: P.inputs, toasts: P.toasts, net: net.map(n => `${n.status} ${n.url} ${n.body.slice(0, 120)}`), r99: P.rule99_end.all_match }).slice(0, 3500));
await browser.close();
