// Open a PART SALE in the UI and learn its detail + document routes from the app's own traffic.
// I claimed 9 cases were blocked on "no parts-sale document" while never having clicked a part sale
// row. /api/part-sales lists 53 of them; /api/part-sales/view/{id} is a 404, so the route is
// something else -- and the app knows it. Read-only: navigates, records GETs.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`; fs.mkdirSync(EV, { recursive: true });
const log = (...a) => console.log(...a);
const calls = [];
// The part-sales list is CUSTOMER-SCOPED: /customers/{id}/part-sales is the route the app itself
// used (it called /api/part-sales from there). Top-level /partsales, /part-sales and /parts-sales
// all render an empty shell -- another reminder that a guessed route proves nothing.
const CUST = '97734382-36a3-4f04-9226-a97bd662ec24';
const { browser, page } = await boot(`/customers/${CUST}/part-sales`);
page.on('request', r => { const u = r.url(); if (/\/api\//.test(u)) calls.push(`${r.method()} ${u.replace(/^https?:\/\/[^/]+/, '')}`); });
await page.waitForTimeout(4000);
log('url:', page.url().replace(APP, ''));
let txt = await page.evaluate(() => (document.body.innerText || '').slice(0, 400));
log('list page text head:', JSON.stringify(txt.slice(0, 260)));
// click the first part-sale number in the table
const before = calls.length;
const full = await page.evaluate(() => document.body.innerText || '');
const m = full.match(/P\d*-\d+/);
log('first part-sale number seen:', m ? m[0] : 'none');
if (m) {
  await page.getByText(m[0], { exact: false }).first().click({ timeout: 10000, force: true }).catch(e => log('click failed:', String(e).slice(0, 80)));
  await page.waitForTimeout(5000);
  log('\nafter click, url:', page.url().replace(APP, ''));
  [...new Set(calls.slice(before))].forEach(c => log('   ', c));
  await page.screenshot({ path: `${EV}/part-sale-open.png`, fullPage: true }).catch(() => {});
  const t2 = await page.evaluate(() => (document.body.innerText || '').slice(0, 700));
  log('\npage text:', JSON.stringify(t2.slice(0, 450)));
  // is there a finance tab / document control?
  const ctl = await page.evaluate(() => [...document.querySelectorAll('[data-test-id]')]
    .map(e => e.getAttribute('data-test-id')).filter(i => /finance|invoice|print|download|document|preview|settings/i.test(i)));
  log('\ndocument-ish test-ids:', [...new Set(ctl)].join(', ') || 'none');
  const fin = page.locator('[data-test-id*="finance" i]').first();
  if (await fin.count()) {
    const b2 = calls.length;
    await fin.click({ timeout: 8000, force: true }).catch(() => {});
    await page.waitForTimeout(4500);
    log('\nfinance tab url:', page.url().replace(APP, ''));
    [...new Set(calls.slice(b2))].forEach(c => log('   ', c));
    await page.screenshot({ path: `${EV}/part-sale-finance.png`, fullPage: true }).catch(() => {});
  }
}
fs.writeFileSync(`${DIR}/part-sale-traffic.json`, JSON.stringify([...new Set(calls)], null, 1));
log('\n---- all distinct routes ----');
[...new Set(calls)].filter(c => !/sentry/.test(c)).forEach(c => log('   ', c));
await browser.close();
