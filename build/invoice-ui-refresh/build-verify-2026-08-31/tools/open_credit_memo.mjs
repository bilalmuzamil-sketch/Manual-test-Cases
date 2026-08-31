// Open credit memo CM-100 in the UI and record how the app renders its document.
// CM-100 is the ZZAUTOTEST credit seeded on 2026-08-31 (status Unapplied, -36.57, origin S-15517).
// Guessed preview routes all 404'd; the app's own traffic is the only reliable source.
// Read-only: navigates, clicks to VIEW, records GETs. No commit control is pressed.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';

const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`;
fs.mkdirSync(EV, { recursive: true });
const CUST = '97734382-36a3-4f04-9226-a97bd662ec24';
const log = (...a) => console.log(...a);
const calls = [];

const { browser, page } = await boot(`/customers/${CUST}/invoices`);
page.on('request', r => { const u = r.url(); if (/\/api\//.test(u)) calls.push(`${r.method()} ${u.replace(/^https?:\/\/[^/]+/, '')}`); });
page.on('response', async r => {
  const u = r.url();
  if (/preview|pdf|document|print|credit/i.test(u) && /\/api\//.test(u)) {
    log(`   [response] ${r.status()} ${u.replace(/^https?:\/\/[^/]+/, '').slice(0, 130)}`);
  }
});

await page.waitForTimeout(4500);
let txt = await page.evaluate(() => document.body.innerText || '');
log('invoices tab mentions CM-100:', /CM-100/.test(txt));

// try each tab until CM-100 is visible
const tabs = ['Invoices', 'Payments', 'Deposits'];
let found = false;
for (const t of tabs) {
  const loc = page.getByText(t, { exact: false }).first();
  if (await loc.count()) { await loc.click({ timeout: 8000, force: true }).catch(() => {}); await page.waitForTimeout(3500); }
  txt = await page.evaluate(() => document.body.innerText || '');
  log(`  [tab ${t}] CM-100 present: ${/CM-100/.test(txt)}   url=${page.url().replace(APP, '')}`);
  if (/CM-100/.test(txt)) { found = true; break; }
}

if (found) {
  const before = calls.length;
  const row = page.getByText('CM-100', { exact: false }).first();
  await row.click({ timeout: 8000, force: true }).catch(e => log('  row click failed:', String(e).slice(0, 90)));
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${EV}/credit-memo-opened.png`, fullPage: true }).catch(() => {});
  log(`\nafter clicking CM-100, url=${page.url().replace(APP, '')}`);
  [...new Set(calls.slice(before))].forEach(c => log('   ', c));
  const t2 = await page.evaluate(() => (document.body.innerText || '').slice(0, 900));
  log('\npage text:', JSON.stringify(t2.slice(0, 600)));
  // look for a print / download / view-document control
  const ctrls = await page.evaluate(() => [...document.querySelectorAll('button,[role=button],[data-test-id],.q-item')]
    .map(e => ({ t: (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' '), id: e.getAttribute('data-test-id') || '' }))
    .filter(x => (x.t || x.id) && /print|download|pdf|document|preview|view|more|menu/i.test(x.t + x.id)));
  log('\ndocument-ish controls:');
  ctrls.slice(0, 25).forEach(c => log(`   ${JSON.stringify(c.t).slice(0, 40).padEnd(42)} ${c.id}`));
  // press the most document-like one and watch what it fetches
  const pick = ctrls.find(c => /print/i.test(c.t + c.id)) || ctrls.find(c => /pdf|document|preview/i.test(c.t + c.id));
  if (pick) {
    log(`\npressing ${JSON.stringify(pick)} to reveal the render route`);
    const b2 = calls.length;
    const l = pick.id ? page.locator(`[data-test-id="${pick.id}"]`).first() : page.getByText(pick.t, { exact: true }).first();
    await l.click({ timeout: 10000, force: true }).catch(() => {});
    await page.waitForTimeout(5000);
    [...new Set(calls.slice(b2))].forEach(c => log('   ', c));
    await page.screenshot({ path: `${EV}/credit-memo-document.png`, fullPage: true }).catch(() => {});
  }
}

fs.writeFileSync(`${DIR}/credit-memo-traffic.json`, JSON.stringify([...new Set(calls)], null, 1));
log('\n---- routes mentioning credit / preview / pdf ----');
[...new Set(calls)].filter(c => /credit|memo|preview|pdf|document/i.test(c)).forEach(c => log('   >>>', c));
await browser.close();
