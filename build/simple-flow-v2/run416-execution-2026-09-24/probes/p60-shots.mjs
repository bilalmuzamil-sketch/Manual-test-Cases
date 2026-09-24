// Re-capture the pictures the reports need at twice the size they will be shown at (Rule 116),
// so the annotated version is downsampled and sharp rather than blown up.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWoSettings, readWoSettings } from './lib2.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const SH='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/shots';
const { browser, ctx, page } = await bootProdLogin('/administration/settings', { settle: 15000, viewport: { width: 1000, height: 640 }, deviceScaleFactor: 2 });
page.setDefaultTimeout(25000);


// 1 + 2: the confirmation dialogs
await openWoSettings(page);
const r0 = await readWoSettings(page);
async function dialogShot(label, file) {
  await page.goto('https://app.shopview.com/administration/settings',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
  await openWoSettings(page);
  const r = await readWoSettings(page);
  const i = r.settings.findIndex(s=>s.label===label);
  await page.locator('.q-tab-panel:has-text("Save Settings") .q-toggle').nth(i).click();
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${SH}/${file}.png` });
  console.log('captured', file);
  const cancel = page.locator('.q-dialog .q-btn:has-text("Cancel")').first();
  if (await cancel.count()) { await cancel.click(); await page.waitForTimeout(1500); }
}
await dialogShot('Require Ordering Parts', 'sweep-dialog');
await dialogShot('Require Approval for New Lines', 'approval-dialog');
await dialogShot('Require Receiving Parts Before Completion', 'receiving-dialog');

// 3: line actions on S2-908
await openWo(page, '068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(4000);
await page.screenshot({ path: `${SH}/line-actions.png` });
console.log('captured line-actions');

// 4: the bulk bar
const rowIds = await page.evaluate(()=>[...document.querySelectorAll('tr[class*="line-row-"]')].map(tr=>(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1]));
const tr = page.locator(`tr.line-row-${rowIds[0]}`).first();
await tr.hover(); await page.waitForTimeout(900);
await page.locator(`[data-test-id="line_checkbox_${rowIds[0]}"]`).first().click();
await page.waitForTimeout(2500);
await page.screenshot({ path: `${SH}/bulk-bar.png` });
console.log('captured bulk-bar');

// 5: the purchase orders page
await page.goto('https://app.shopview.com/parts/orders',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(11000);
await page.screenshot({ path: `${SH}/purchase-orders.png` });
console.log('captured purchase-orders');

// 6: a work order header with every line complete (the finish actions on offer)
await openWo(page, '4560a837-ee20-46e5-a62c-c6a4892fc85d'); await page.waitForTimeout(4000);
await page.screenshot({ path: `${SH}/header-complete.png` });
console.log('captured header-complete');
await browser.close();
