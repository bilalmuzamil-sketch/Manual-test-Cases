// Developer question 2 on the question sheet: "what does a person click to produce the printed
// credit note?" Seven Credit Invoice cases have never been checked because the 2026-08-31 pass
// could not find that route. Our own cases document it - Customers -> the customer -> the Invoices
// tab -> the print icon whose tooltip reads "Print credit memo" - and the bundle sweep found that
// tooltip. With a real signed-in browser it can be WALKED instead of asked about.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page, APP } = await boot('sv9315', '/customers', 'admin');
const out = { at: new Date().toISOString(), steps: [] };
const note = (k, v) => { out.steps.push([k, v]); console.log(`${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`); };

note('landed', page.url().replace(APP, ''));
// read the customer table per cell, mapped to its header (never a flattened row)
const rows = await page.evaluate(() => {
  const t = document.querySelector('table'); if (!t) return null;
  const lab = el => { const c = el.cloneNode(true);
    c.querySelectorAll('svg,i,[class*="icon"],[aria-hidden="true"]').forEach(n => n.remove());
    return (c.textContent || '').replace(/\s+/g, ' ').trim(); };
  const heads = [...t.querySelectorAll('thead th, thead td')].map(lab);
  return { heads, first: [...t.querySelectorAll('tbody tr')].slice(0, 5).map(tr =>
    Object.fromEntries([...tr.cells].map((c, i) => [heads[i] ?? 'col' + i, lab(c)]))) };
});
note('customer table columns', rows && rows.heads);

// open the first customer and find its Invoices tab
await page.locator('tbody tr').first().click().catch(() => {});
await page.waitForTimeout(7000);
note('customer url', page.url().replace(APP, ''));
const tabs = await page.evaluate(() => [...document.querySelectorAll('.q-tab, [role="tab"], .q-tab__label')]
  .map(el => { const c = el.cloneNode(true);
    c.querySelectorAll('svg,i,[class*="icon"]').forEach(n => n.remove());
    return (c.textContent || '').replace(/\s+/g, ' ').trim(); }).filter(Boolean));
note('tabs on the customer screen', [...new Set(tabs)]);

const invTab = page.locator('.q-tab, [role="tab"]').filter({ hasText: /Invoice/i }).first();
if (await invTab.count()) {
  await invTab.click(); await page.waitForTimeout(7000);
  note('after the Invoices tab', page.url().replace(APP, ''));
  const inv = await page.evaluate(() => {
    const t = document.querySelector('table'); if (!t) return null;
    const lab = el => { const c = el.cloneNode(true);
      c.querySelectorAll('svg,i,[class*="icon"],[aria-hidden="true"]').forEach(n => n.remove());
      return (c.textContent || '').replace(/\s+/g, ' ').trim(); };
    const heads = [...t.querySelectorAll('thead th, thead td')].map(lab);
    const body = [...t.querySelectorAll('tbody tr')].slice(0, 12).map(tr =>
      Object.fromEntries([...tr.cells].map((c, i) => [heads[i] ?? 'col' + i, lab(c)])));
    // every title/tooltip on the row - this is where "Print credit memo" lives
    const tips = [...new Set([...t.querySelectorAll('[title],[aria-label]')]
      .map(e => e.getAttribute('title') || e.getAttribute('aria-label')).filter(Boolean))];
    return { heads, body, tips };
  });
  note('invoice table columns', inv && inv.heads);
  note('tooltips on the invoice rows', inv && inv.tips);
  const credits = (inv?.body || []).filter(r => JSON.stringify(r).includes('CM-'));
  note('rows whose number starts CM- (credits)', credits.length ? credits.slice(0,3) : 'none on this customer');
}
await page.screenshot({ path: 'build/probe-2026-09-02/credit-ui.png', fullPage: false });
fs.writeFileSync('build/probe-2026-09-02/credit-ui.json', JSON.stringify(out, null, 1));
await browser.close();
