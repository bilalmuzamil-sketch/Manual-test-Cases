// verify_routes.mjs — WALK every distinct route the 119 Invoice cases tell a tester to follow.
//
// The text gate proves a route is PRESENT. It cannot prove one is CORRECT. A case that sends
// Victoria to a tab that does not exist is still a case that fails her, so every distinct
// screen -> tab claim in the suite is walked here on the live build and recorded pass/fail.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const OUT = 'build/invoice-ui-refresh/build-verify-2026-08-31/runnable-fix-2026-09-01';
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };

const { WO, PS, CUST, IMP } = process.env;
const CHECKS = [
  { claim: 'Work Orders -> Finance',        cited: 179, url: `/workorders/${WO}`,            tab: 'Finance' },
  { claim: 'Customers -> Invoices',         cited: 37,  url: `/customers/${CUST}`,           tab: 'Invoices' },
  { claim: 'Parts -> Part Sales',           cited: 13,  url: `/parts/part-sale/${PS}`,       tab: null, expectMenu: 'Parts' },
  { claim: 'Customers -> Payments',         cited: 6,   url: `/customers/${CUST}`,           tab: 'Payments' },
  { claim: 'Work Orders -> Imported filter', cited: 4,  url: `/workorders?status=imported`,  tab: null, expectRow: 'ZZAUTOTEST-IMP-001' },
  { claim: 'Parts sale -> Finance',         cited: 3,   url: `/parts/part-sale/${PS}`,       tab: 'Finance' },
  { claim: 'Customers -> Contacts',         cited: 2,   url: `/customers/${CUST}`,           tab: 'Contacts' },
  { claim: 'Work Orders -> Contacts',       cited: 1,   url: `/workorders/${WO}`,            tab: 'Contacts' },
  { claim: 'Customers -> Part Sales',       cited: 1,   url: `/customers/${CUST}`,           tab: 'Part Sales' },
];

const { browser, page } = await boot('/workorders');
const results = [];
for (const c of CHECKS) {
  let verdict = 'NOT WALKED', detail = '';
  for (let a = 1; a <= 3; a++) {
    await page.goto(APP + c.url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await page.waitForFunction(() => (document.body?.innerText || '').length > 700, { timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(3500);
    const asleep = await page.evaluate(() => /Environment Sleeping/i.test(document.body?.innerText || ''));
    if (asleep) { detail = 'environment asleep'; await page.waitForTimeout(15000); continue; }
    const seen = await page.evaluate((want) => {
      const tabs = [...document.querySelectorAll('.q-tab, [role="tab"], a.q-tab__content, .q-tab__label')]
        .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
      const body = (document.body?.innerText || '');
      return { url: location.pathname + location.search, tabs: [...new Set(tabs)], chars: body.length,
               // tab labels carry a row count -- "Payments (30)", "Contacts (6)". Comparing the
               // raw label to "Payments" reports a tab that is plainly on screen as missing.
               hasWant: want ? tabs.some(t => t.replace(/\s*\(\d+\)\s*$/, '').trim().toLowerCase() === want.toLowerCase()) : null,
               body: body.slice(0, 300) };
    }, c.tab);
    if (c.tab) {
      verdict = seen.hasWant ? 'ROUTE OK' : 'TAB NOT FOUND';
      detail = `tabs on screen: ${JSON.stringify(seen.tabs)}`;
    } else if (c.expectRow) {
      const found = await page.evaluate(n => [...document.querySelectorAll('tr')].some(r => (r.innerText || '').includes(n)), c.expectRow);
      verdict = found ? 'ROUTE OK' : 'ROW NOT FOUND'; detail = `looked for ${c.expectRow}`;
    } else {
      verdict = seen.chars > 700 && !/\/login/.test(seen.url) ? 'ROUTE OK' : 'DID NOT LAND';
      detail = `landed ${seen.url} (${seen.chars} chars)`;
    }
    break;
  }
  L(`${verdict.padEnd(14)} ${c.claim.padEnd(30)} cited by ${String(c.cited).padStart(3)} cases   ${detail.slice(0, 150)}`);
  results.push({ ...c, verdict, detail });
}
fs.writeFileSync(`${OUT}/route-verification.json`, JSON.stringify(results, null, 1));
fs.writeFileSync(`${OUT}/route-verification.log`, log.join('\n') + '\n');
await browser.close();
