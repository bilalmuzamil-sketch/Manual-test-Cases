// Probe 11: setup walk for work order / part sale cases. Saves test data only: part ZZAUTOTEST-PLBV-B (active),
// a work order (first customer offered) with line "ZZAUTOTEST PL line" holding part B, completed and invoiced;
// a part sale with part B, invoiced; Issue Credit window opened and cancelled.
import { start } from './lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT;
const { r, page, dump, step, go, search, dots, btn, dlg } = await start(OUT);
const save = (n, o) => fs.writeFileSync(`${OUT}/${n}.json`, JSON.stringify(o, null, 1));
const vis = t => page.locator('button:visible', { hasText: t });
await step('partB', async () => { await go('/parts/inventory'); await btn('New Inventory Part').click(); await page.waitForTimeout(1500);
  const d = dlg(); await d.getByLabel('Description', { exact: true }).first().fill('ZZAUTOTEST PLBV PART B'); await d.getByLabel('Part Number', { exact: true }).first().fill('ZZAUTOTEST-PLBV-B');
  await d.getByLabel('Cost', { exact: true }).first().fill('10'); await d.getByLabel('Sell Price', { exact: true }).first().fill('20'); await d.getByLabel('Quantity', { exact: true }).first().fill('5');
  await d.getByRole('button', { name: 'Save', exact: true }).click(); await page.waitForTimeout(2500); await dump('partB-saved', true); });
await step('wo-create', async () => { await go('/workorders'); await btn('Create Work Order').click(); await page.waitForTimeout(1500);
  await dlg().getByLabel('Customer').first().click(); await page.waitForTimeout(1500); await page.locator('.q-menu:visible .q-item').first().click(); await page.waitForTimeout(800); await dump('wo-customer-picked');
  await dlg().getByRole('button', { name: 'Save', exact: true }).click(); await page.waitForTimeout(2500);
  if (await page.locator('.q-dialog:visible').count()) { await dump('wo-confirm'); await page.locator('.q-dialog:visible').last().locator('button:visible').filter({ hasText: /Create|Yes|Confirm/ }).first().click().catch(() => {}); }
  await page.waitForTimeout(3500); await dump('wo-created', true); save('wo-url', page.url()); });
await step('wo-line', async () => { if (await page.locator('.q-dialog:visible').count() === 0) await vis('New Line').first().click(); await page.waitForTimeout(2000); await dump('new-line');
  await dlg().getByLabel('Title').first().fill('ZZAUTOTEST PL line'); await page.keyboard.press('Tab'); await page.waitForTimeout(800); save('new-line-buttons', await dlg().locator('button:visible').allInnerTexts());
  await dlg().locator('button:visible').filter({ hasText: /Save & Close|Save/ }).last().click(); await page.waitForTimeout(3000); await dump('line-saved', true); });
await step('wo-part', async () => { await page.locator('main button:visible, main a:visible', { hasText: 'Add Part' }).first().click(); await page.waitForTimeout(1200);
  await page.locator('main input:visible').first().click(); await page.keyboard.type('ZZAUTOTEST-PLBV-B', { delay: 50 }); await page.waitForTimeout(3000); await dump('wo-part-lookup');
  await page.locator('.q-menu:visible .q-item').filter({ hasText: 'Inventory Qty' }).first().click(); await page.waitForTimeout(1500); await dump('wo-part-picked', true);
  await page.locator('main button:visible', { hasText: /^Save$/ }).first().click(); await page.waitForTimeout(3000); await dump('wo-part-saved', true); save('wo-line-buttons', await page.locator('main button:visible').allInnerTexts()); });
await step('wo-complete', async () => { const c = page.locator('main button:visible', { hasText: /^Complete$/ }).first(); await c.click(); await page.waitForTimeout(2500); await dump('after-complete', true);
  if (await page.locator('.q-dialog:visible').count()) { await dump('complete-dialog'); } });
await step('wo-invoice', async () => { await page.getByRole('tab', { name: /Finance/ }).first().click(); await page.waitForTimeout(2500); await dump('wo-finance', true); save('wo-finance-buttons', await page.locator('main button:visible').allInnerTexts());
  await vis('Create Invoice').first().click(); await page.waitForTimeout(3000); await dump('wo-invoice-click');
  if (await page.locator('.q-dialog:visible').count()) { save('wo-invoice-dialog-buttons', await dlg().locator('button:visible').allInnerTexts()); } });
await r.browser.close();
