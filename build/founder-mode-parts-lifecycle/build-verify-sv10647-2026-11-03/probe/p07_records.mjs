// Probe 07: role editor Parts Department, work order part dialog, part sale, purchase orders, returns, vendor invoices, credits.
// Opens and cancels; nothing saved.
import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT;
const { r, page, dump, step, go, search, dots, btn, dlg } = await start(OUT);
const save = (n, o) => fs.writeFileSync(`${OUT}/${n}.json`, JSON.stringify(o, null, 1));
await step('role-parts', async () => { await go('/administration/roles-permissions'); await btn('Create Custom Role').click(); await page.waitForTimeout(1500); await dlg().locator('button:visible', { hasText: 'Skip' }).click(); await page.waitForTimeout(2500);
  const card = page.locator('.permission-card').filter({ hasText: 'Parts Department' }).first(); await card.scrollIntoViewIfNeeded();
  await card.locator('.q-toggle:visible, [role=switch]:visible').first().click(); await page.waitForTimeout(1200);
  save('role-parts-card', await card.innerText()); await card.screenshot({ path: `${OUT}/role-parts-card.png` }); });
await step('wo', async () => { await go('/workorders'); await page.locator('main td').filter({ hasText: 'S2-6761' }).first().click(); await page.waitForTimeout(3500); await dump('wo-open', true);
  const ap = page.locator('main').locator('button:visible, a:visible', { hasText: 'Add Part' }).first(); await ap.click(); await page.waitForTimeout(2000); await dump('wo-part-dialog');
  save('wo-part-dialog-buttons', await dlg().locator('button:visible').allInnerTexts());
  await dlg().getByLabel('Part number', { exact: true }).first().click(); await page.keyboard.type('ZZAUTOTEST-PLBV', { delay: 40 }); await page.waitForTimeout(2500); await dump('wo-part-lookup');
  await page.keyboard.press('Escape'); await page.waitForTimeout(500); await page.keyboard.press('Escape'); });
await step('partsale', async () => { await go('/parts/part-sales'); await page.locator('main td').filter({ hasText: 'P2-162' }).first().click(); await page.waitForTimeout(3000); await dump('part-sale', true);
  save('part-sale-tabs', await page.locator('main [role=tab]:visible').allInnerTexts()); save('part-sale-buttons', await page.locator('main button:visible').allInnerTexts()); });
await step('po', async () => { await go('/parts/purchase-orders'); await dump('po-list', true); save('po-buttons', await page.locator('main button:visible').allInnerTexts());
  await page.locator('main tbody tr').filter({ hasText: /PO|\d/ }).nth(1).click(); await page.waitForTimeout(3000); await dump('po-open', true); save('po-open-buttons', await page.locator('main button:visible').allInnerTexts()); });
await step('returns', async () => { await go('/parts/returns'); await dump('returns', true); await btn('Create Return').click(); await page.waitForTimeout(2500); await dump('create-return', true); save('create-return-labels', await page.locator('main label:visible, main .q-field__label:visible, main button:visible').allInnerTexts()); });
await step('vinv', async () => { await go('/parts/vendor-invoices'); await dump('vendor-invoices', true); save('vinv-buttons', await page.locator('main button:visible').allInnerTexts()); });
await r.browser.close();
