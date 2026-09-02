// Walk the QA lead's exact route on HIS branch and capture what the print icon fires.
// Customers -> the customer -> Invoices tab -> the Credit row -> the print icon ("Print credit memo").
// This is the document render path the 2026-08-31 pass searched 13 candidate routes for.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST = '039fd202-c7f5-4b34-8000-969488b49687';          // from the screenshot's URL
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const out = { branch: 'sv8218', customer: CUST, at: new Date().toISOString(), calls: [], popups: [] };
page.on('request', r => { const u = r.url();
  if (u.includes(APIH)) out.calls.push(`${r.method()} ${u.replace(`https://${APIH}`, '<api>')}`); });
browser.on('targetcreated', () => {});
page.context().on('page', async p2 => { try { await p2.waitForLoadState('domcontentloaded');
  out.popups.push(p2.url()); } catch (e) {} });

await page.goto(`${APP}/customers/${CUST}/invoices`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(9000);
out.url = page.url().replace(APP, '');
out.build = await page.evaluate(() => document.querySelector('meta[name=app-version]')?.content);
console.log('branch sv8218, build', out.build, '| url', out.url);

// read the table per cell against its header
out.table = await page.evaluate(() => {
  const t = document.querySelector('table'); if (!t) return null;
  const lab = el => { const c = el.cloneNode(true);
    c.querySelectorAll('svg,i,[class*="icon"],[aria-hidden="true"]').forEach(n => n.remove());
    return (c.textContent || '').replace(/\s+/g, ' ').trim(); };
  const heads = [...t.querySelectorAll('thead th, thead td')].map(lab);
  return { heads, rows: [...t.querySelectorAll('tbody tr')].map(tr =>
    Object.fromEntries([...tr.cells].map((c, i) => [heads[i] ?? 'col' + i, lab(c)]))) };
});
console.log('columns:', JSON.stringify(out.table?.heads));
(out.table?.rows || []).forEach(r => console.log('   row:', JSON.stringify(r)));

// find the CREDIT row and its print control, by tooltip
const found = await page.evaluate(() => {
  const t = document.querySelector('table'); if (!t) return null;
  for (const tr of t.querySelectorAll('tbody tr')) {
    if (!/Credit/.test(tr.textContent || '')) continue;
    const el = [...tr.querySelectorAll('[title],[aria-label],button,i,span')]
      .find(e => /print credit memo/i.test((e.getAttribute('title') || e.getAttribute('aria-label') || e.textContent || '')));
    if (el) { el.setAttribute('data-qa-print', '1');
      return { tip: el.getAttribute('title') || el.getAttribute('aria-label'), tag: el.tagName }; }
  }
  return null;
});
console.log('print control on the credit row:', JSON.stringify(found));
if (found) {
  const before = out.calls.length;
  await page.locator('[data-qa-print="1"]').first().click({ timeout: 20000 }).catch(e => console.log('click:', String(e).split('\n')[0]));
  await page.waitForTimeout(9000);
  out.newCalls = out.calls.slice(before);
  console.log('\nrequests the print icon fired:');
  [...new Set(out.newCalls)].forEach(c => console.log('   ' + c));
  console.log('popups/tabs opened:', JSON.stringify(out.popups));
}
fs.writeFileSync('build/probe-2026-09-02/credit-doc-sv8218.json', JSON.stringify(out, null, 1));
await page.screenshot({ path: 'build/probe-2026-09-02/credit-doc-sv8218.png' });
await browser.close();
