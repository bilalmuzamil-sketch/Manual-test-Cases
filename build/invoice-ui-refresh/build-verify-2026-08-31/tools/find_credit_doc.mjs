// LAST targeted probe for the credit memo document route: the work order the credit was ISSUED
// from (S2-15517, wo 8c5c5751-549e-405c-8d1c-ed7896eb802b). CM-100 is not on the customer's
// Invoices/Payments/Deposits tabs, and every guessed route 404s -- so look where it was created.
// Read-only: opens the finance tab and the invoice menu to READ them, records API GETs, presses
// nothing that commits.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`; fs.mkdirSync(EV, { recursive: true });
const WO = '8c5c5751-549e-405c-8d1c-ed7896eb802b';
const log = (...a) => console.log(...a);
const calls = [];
const { browser, page } = await boot(`/workorders/${WO}/lines`);
page.on('request', r => { const u = r.url(); if (/\/api\//.test(u)) calls.push(`${r.method()} ${u.replace(/^https?:\/\/[^/]+/, '')}`); });

await page.waitForSelector('[data-test-id="link_finance_tab"]', { timeout: 30000 }).catch(() => {});
await page.locator('[data-test-id="link_finance_tab"]').first().click({ timeout: 10000 }).catch(() => {});
await page.waitForTimeout(4000);
const txt = await page.evaluate(() => document.body.innerText || '');
log('finance tab mentions CM-100:', /CM-100/.test(txt), '| mentions Credit:', /credit/i.test(txt));
fs.writeFileSync(`${DIR}/surface-wo-15517-finance.txt`, txt);
await page.screenshot({ path: `${EV}/wo-15517-finance.png`, fullPage: true }).catch(() => {});

// the invoice menu on this work order — a credited invoice should offer a credit document
const im = page.locator('[data-test-id="button_wo_invoice_menu"]').first();
if (await im.count()) {
  const before = calls.length;
  await im.click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(2000);
  const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item,[role=menuitem]')]
    .map(e => ({ t: (e.innerText || '').trim().replace(/\s+/g, ' '), id: e.getAttribute('data-test-id') || '' })).filter(x => x.t));
  log('\ninvoice menu items:');
  items.forEach(i => log(`   ${JSON.stringify(i.t).slice(0, 44).padEnd(46)} ${i.id}`));
  const cred = items.find(i => /credit/i.test(i.t + i.id) && !/issue/i.test(i.t + i.id));
  if (cred) {
    log(`\nopening ${JSON.stringify(cred)} — a VIEW item, not the Issue action`);
    await page.locator(`[data-test-id="${cred.id}"]`).first().click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${EV}/credit-doc-attempt.png`, fullPage: true }).catch(() => {});
    log('url now:', page.url().replace(APP, ''));
    [...new Set(calls.slice(before))].forEach(c => log('   ', c));
  } else {
    log('\nno credit VIEW item in the menu (only the Issue action, which creates)');
    await page.keyboard.press('Escape');
  }
}
fs.writeFileSync(`${DIR}/credit-doc-traffic.json`, JSON.stringify([...new Set(calls)], null, 1));
log('\n---- all routes this run ----');
[...new Set(calls)].forEach(c => log('   ', c));
await browser.close();
