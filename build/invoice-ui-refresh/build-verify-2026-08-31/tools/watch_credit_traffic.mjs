// Find the CREDIT MEMO routes by WATCHING THE APP, not by guessing.
// Every guessed route on this project has 404'd; every real one came from the app's own traffic.
// The spec names the document's provider (CreditMemoPdfDataProvider, S11-R6a) and says production
// already renders it, so a credit memo document exists today -- the question is only where.
// Read-only: navigates the customer's tabs and records GET calls. No POST is issued.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';

const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const CUST = '97734382-36a3-4f04-9226-a97bd662ec24';
const log = (...a) => console.log(...a);
const calls = [];

const { browser, page } = await boot(`/customers/${CUST}/work-orders`);
page.on('request', r => {
  const u = r.url();
  if (/\/api\//.test(u)) calls.push({ m: r.method(), u: u.replace(/^https?:\/\/[^/]+/, '') });
});

// walk every tab on the customer record and let the app reveal its own endpoints
const tabs = await page.evaluate(() => [...document.querySelectorAll('[role=tab],.q-tab,[data-test-id*="tab" i]')]
  .map(e => ({ t: (e.innerText || '').trim().replace(/\s+/g, ' '), id: e.getAttribute('data-test-id') || '' }))
  .filter(x => x.t && x.t.length < 40));
log('customer tabs:', tabs.map(t => t.t).join(' | '));

for (const t of tabs) {
  if (!/credit|payment|deposit|invoice|part sale/i.test(t.t)) continue;
  const before = calls.length;
  const loc = t.id ? page.locator(`[data-test-id="${t.id}"]`).first() : page.getByText(t.t, { exact: true }).first();
  if (!(await loc.count())) continue;
  await loc.click({ timeout: 8000, force: true }).catch(() => {});
  await page.waitForTimeout(3500);
  const fresh = calls.slice(before).filter(c => c.m === 'GET');
  log(`\n[tab: ${t.t}]  url=${page.url().replace(APP, '')}`);
  [...new Set(fresh.map(c => c.u.split('?')[0]))].forEach(u => log('    GET', u));
  const txt = await page.evaluate(() => (document.body.innerText || '').slice(0, 500));
  if (/credit/i.test(txt)) log('    (page text mentions credit)');
}

fs.writeFileSync(`${DIR}/credit-traffic.json`, JSON.stringify(calls, null, 1));
const uniq = [...new Set(calls.map(c => `${c.m} ${c.u.split('?')[0]}`))].sort();
log(`\n---- every distinct API route the app called (${uniq.length}) ----`);
uniq.forEach(u => log('  ', u));
log('\nroutes mentioning credit/memo:');
uniq.filter(u => /credit|memo/i.test(u)).forEach(u => log('   >>>', u));
await browser.close();
