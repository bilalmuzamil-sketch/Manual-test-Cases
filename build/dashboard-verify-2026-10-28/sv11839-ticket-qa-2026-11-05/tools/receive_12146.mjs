// receive_12146.mjs — SV-12146 set-up ON SCREEN: receive PO d3cda318 one item at a time (each receive = one vendor bill), tax 0.
// Heavy Duty, TZ=America/Edmonton. SECRET-FREE. Usage: node receive_12146.mjs <itemId> <invoiceNo>
import fs from 'fs';
import { boot, finish, shot, sleep, LOC, APP, API } from '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04/tools/common.mjs';
const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-05';
const PO = 'd3cda318-7ae4-423b-a144-05ef1dcbad5d', WO = '7e5edef3-dd93-409b-9942-b3bf1c3a0f39';
const [ITEM, INV] = process.argv.slice(2);
const { browser, page, rule99, app_version } = await boot(LOC.HD, { dest: '/parts/orders' });
const net = []; page.on('response', async r => { if (r.request().method() !== 'GET' && r.url().includes('/api/') && /order|receive|deliver/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 250); } catch {} net.push(`${r.status()} ${r.url().replace(/^.*\/api/, '/api')} ${b}`); } });
await page.goto(`${APP}/order/${PO}?receive=1&workOrderId=${WO}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(10000);
const P = { app_version, item: ITEM, invoice: INV, rule99_start: rule99 };
const items = await page.evaluate(() => [...document.querySelectorAll('[data-test-id^="checkbox_item_"]')].map(e => e.getAttribute('data-test-id').replace('checkbox_item_', '')));
P.items_on_screen = items;
for (const id of items) {   // tick only ITEM
  const cb = page.locator(`[data-test-id="checkbox_item_${id}"]`).first(); const on = (await cb.getAttribute('aria-checked')) === 'true';
  if ((id === ITEM) !== on) { await cb.click(); await sleep(400); }
}
await page.locator(`[data-test-id="select_assign_vendor_${PO}"]`).first().click(); await sleep(800); await page.keyboard.type('ZZAUTOTEST QA11839 Credit', { delay: 30 }); await sleep(2000);
await page.locator('.q-menu .q-item').filter({ hasText: 'ZZAUTOTEST QA11839 Credit Vendor' }).first().click(); await sleep(1200);
const inv = page.locator(`[data-test-id="input_invoice_${PO}"]`).first().locator('xpath=self::input | .//input').first(); await inv.fill(INV);
const tax = page.locator('[data-test-id^="input_tax"]').first().locator('xpath=self::input | .//input').first();
if (await tax.count()) { await tax.fill('0'); await page.keyboard.press('Tab'); }
await sleep(1000);
P.form = await page.evaluate(() => [...document.querySelectorAll('[data-test-id]')].map(e => [e.getAttribute('data-test-id'), e.getAttribute('aria-checked') ?? (e.value ?? e.querySelector?.('input')?.value ?? '')]).filter(x => /input_|checkbox_item|select_assign/.test(x[0])));
P.totals = (await page.locator('main.q-page').innerText()).split('\n').filter(l => /Total|Tax|Subtotal|\$/.test(l)).slice(0, 12);
P.pic = await shot(page, 'SV-12146', `0-receive-${INV}`);
await page.locator(`[data-test-id="button_receive_po_${PO}"]`).first().click(); await sleep(8000);
P.after_url = page.url().replace(APP, ''); P.toasts = await page.locator('.q-notification').allInnerTexts().catch(() => []); P.net = net;
P.rule99_end = await finish(page, LOC.HD, rule99);
fs.writeFileSync(`${OUT}/SV-12146/setup-receive-${INV}.json`, JSON.stringify(P, null, 1));
console.log(JSON.stringify({ items, form: P.form, totals: P.totals, after: P.after_url, toasts: P.toasts, net, r99: P.rule99_end.all_match }).slice(0, 2500));
await browser.close();
