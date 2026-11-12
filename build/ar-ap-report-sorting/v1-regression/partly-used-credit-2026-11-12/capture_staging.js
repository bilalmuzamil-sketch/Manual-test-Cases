// Staging (new reports, after the feature): A/R Aging Detail narrowed to 4 Star Truck Repair with its partly used
// credits CM2-4353, CM2-4354, DEP2-4713 marked; then the customer's Invoices tab with the same credits. QA lead's session.
const fs = require('fs'); const path = require('path');
const lib = require('../staging-run-2026-11-12/tech-tools/lib.js');
const OUT = path.join(__dirname, 'shots'); const CUST = '6a7b6afc-084d-4584-aacb-773bcd71cbcd'; const DOCS = ['CM2-4353', 'CM2-4354', 'DEP2-4713'];
(async () => {
  const { browser, page, app } = await lib.open('staging', { width: 1920 }); const notes = [];
  await lib.reportsHome(page, app);
  notes.push('build ' + await page.locator('meta[name="app-version"]').getAttribute('content'));
  await lib.nav(page, 'A/R Aging Detail');
  notes.push('pick: ' + JSON.stringify(await lib.pickParty(page, 'customerIds', '4 Star Truck Repair')));
  await lib.openAll(page);
  const rs = await lib.rows(page);
  const head = await page.locator('thead tr').first().innerText().catch(() => ''); notes.push('headings: ' + head.replace(/\s+/g, ' | '));
  for (const d of DOCS) { const r = rs.find((x) => x.text.includes(d)); notes.push(`${d}: ` + (r ? JSON.stringify(r.cells) + ' || ' + r.text : 'NOT FOUND')); }
  for (const d of DOCS) { const row = page.locator('tr', { hasText: d }).first(); if (await row.count()) await row.evaluate((el) => { el.style.outline = '3px solid #e11'; el.style.outlineOffset = '-2px'; }); }
  await page.locator('tr', { hasText: 'CM2-4354' }).first().evaluate((el) => el.scrollIntoView({ block: 'center' })); await lib.sleep(800);
  await page.screenshot({ path: path.join(OUT, 'staging-1-AR-Aging-Detail-4-Star-Truck-Repair-credits.png') });
  await page.goto(`${app}/customers/${CUST}/invoices`, { waitUntil: 'domcontentloaded' }); await lib.settle(page, 4000);
  for (const d of ['CM2-4353', 'CM2-4354']) { const row = page.locator('tr', { hasText: d }).first();
    notes.push(`customer tab ${d}: ` + ((await row.count()) ? (await row.innerText()).replace(/\s+/g, ' | ') : 'NOT FOUND'));
    if (await row.count()) await row.evaluate((el) => { el.style.outline = '3px solid #e11'; el.style.outlineOffset = '-2px'; }); }
  
  await lib.sleep(600); await page.screenshot({ path: path.join(OUT, 'staging-2-customer-Invoices-tab-4-Star-Truck-Repair.png') });
  notes.push('utc ' + new Date().toISOString());
  fs.writeFileSync(path.join(OUT, 'staging-NOTES.txt'), notes.join('\n') + '\n'); console.log(notes.join('\n')); await browser.close();
})();
