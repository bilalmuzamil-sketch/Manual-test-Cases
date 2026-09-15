import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const SHOTS = [
  ['a1-2019-freightliner',    '2019 Freightliner'],
  ['a2-freightliner-cascadia','Freightliner Cascadia'],
  ['b1-phone-as-shown',       '(419) 555-0143'],
  ['b2-phone-partial',        '555-0143'],
  ['c1-midword-name',         'idgepor'],
  ['c2-midword-town',         'ernva'],
];
const { browser, page } = await boot('sv9160', '/workorders', 'admin');
await page.waitForTimeout(3000);
for (const [name, q] of SHOTS) {
  const trigger = page.locator('[data-test-id="global_search_trigger"]').first();
  await trigger.click({ timeout: 15000 });
  await page.waitForTimeout(1500);
  const input = page.locator('input:visible').first();
  await input.click({ timeout: 8000 });
  await input.fill('');
  await page.keyboard.type(q, { delay: 45 });
  await page.waitForTimeout(5000);
  const modal = page.locator('.q-dialog, [role="dialog"]').first();
  const box = await modal.boundingBox().catch(() => null);
  await page.screenshot({ path: `/tmp/shots/${name}.png`, clip: box || undefined });
  console.log('captured', name, box ? `(modal ${Math.round(box.width)}x${Math.round(box.height)})` : '(FULL PAGE - no modal found)');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(900);
}
await browser.close(); console.log('done');
