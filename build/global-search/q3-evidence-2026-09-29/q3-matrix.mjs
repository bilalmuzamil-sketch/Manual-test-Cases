/**
 * Q3 EVIDENCE — "Typing a customer's own switchboard number finds nothing. A supplier's number
 * does work." Is that still true on this build?
 *
 * Existing records cannot answer it: 7 Star Truck Repair IS found by its own number
 * (609-461-6502) but the row labels the hit "Contact match", while its only contact carries
 * 027-922-1665 / 675-450-9385. Either the premise is stale or the label is wrong, and guessing
 * which would put a false defect in front of engineering.
 *
 * So this creates records with numbers that exist NOWHERE else and searches for them:
 *   A. a customer with a telephone and NO contacts   <- the question itself
 *   B. a vendor with a telephone                     <- the sheet says this works: POSITIVE CONTROL
 * Both are created the same way, in the same session, and searched the same way. If A is not
 * found and B is, the defect is real and the control proves the instrument. If both are found,
 * the premise no longer reproduces and nothing should be filed.
 */
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
import fs from 'node:fs';

const STAMP = Date.now().toString().slice(-6);
const CUST = { name: `ZZQ3 Switchboard Customer ${STAMP}`, phone: '555-3301-0001' };
const VEND = { name: `ZZQ3 Switchboard Vendor ${STAMP}`,   phone: '555-3302-0002' };
const out = { stamp: STAMP, customer: CUST, vendor: VEND, steps: [] };
const log = (k, v) => { out.steps.push({ [k]: v }); console.log(k, JSON.stringify(v)); };

const { page, browser } = await boot('/customers', { key: 'admin', settle: 13000 });
try {
  await page.setViewportSize({ width: 1440, height: 900 });

  // ── A. the customer ─────────────────────────────────────────────────────────────────────────
  await page.getByRole('button', { name: /New Customer|Add Customer/i }).first().click();
  await page.waitForTimeout(2500);
  let inp = page.locator('.q-dialog input');
  await inp.nth(0).fill(CUST.name);
  await inp.nth(1).fill(CUST.phone);
  await page.locator('.q-dialog button').filter({ hasText: /^Save$/i }).last().click();
  await page.waitForTimeout(7000);
  log('customer_created', { dialogClosed: !(await page.locator('.q-dialog').count()), url: page.url() });

  // ── B. the vendor (the control) ─────────────────────────────────────────────────────────────
  await page.goto('https://app.staging.shopview.com/parts/vendors', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(9000);
  const vbtn = page.getByRole('button', { name: /New Vendor|Add Vendor/i }).first();
  const haveV = await vbtn.count();
  if (haveV) {
    await vbtn.click(); await page.waitForTimeout(2500);
    const vf = await page.evaluate(() => [...document.querySelectorAll('.q-dialog input')]
      .map((e, i) => ({ i, label: (e.closest('.q-field')?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 34) })));
    log('vendor_form', vf);
    inp = page.locator('.q-dialog input');
    const iName = vf.findIndex(f => /^Name/i.test(f.label));
    const iTel = vf.findIndex(f => /Telephone|Phone/i.test(f.label));
    if (iName >= 0) await inp.nth(iName).fill(VEND.name);
    if (iTel >= 0) await inp.nth(iTel).fill(VEND.phone);
    await page.locator('.q-dialog button').filter({ hasText: /^Save$/i }).last().click();
    await page.waitForTimeout(7000);
    log('vendor_created', { dialogClosed: !(await page.locator('.q-dialog').count()) });
  } else log('vendor_created', { skipped: 'no New Vendor button found' });

  // ── the index is allowed up to 30s; give it 45 and say so ───────────────────────────────────
  await page.waitForTimeout(45000);

  async function search(term) {
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(500);
    await page.keyboard.press('Control+k'); await page.waitForTimeout(1400);
    const i = page.locator('.search-modal input');
    await i.click({ clickCount: 3 }); await i.fill(''); await i.type(term, { delay: 45 });
    await page.waitForTimeout(6000);
    return page.evaluate(() => ({
      tabs: [...document.querySelectorAll('.search-tabs__tab')].map(e => e.innerText.replace(/\s+/g, ' ').trim()),
      rows: [...document.querySelectorAll('.search-row')].map(r => r.innerText.replace(/\s+/g, ' ').trim()),
      body: (document.querySelector('.search-modal__body')?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200),
    }));
  }

  for (const [what, term] of [
    ['customer_by_own_phone', CUST.phone],
    ['customer_by_name_CONTROL', 'ZZQ3 Switchboard Customer'],
    ['vendor_by_own_phone_CONTROL', VEND.phone],
    ['vendor_by_name_CONTROL', 'ZZQ3 Switchboard Vendor'],
    ['existing_customer_own_phone', '609-461-6502'],
  ]) log(what, await search(term));

  fs.writeFileSync('q3-matrix.json', JSON.stringify(out, null, 1));
} finally { await browser.close(); }
