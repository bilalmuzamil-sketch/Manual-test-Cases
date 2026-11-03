// Probe 18: setup walk with throwaway data (dummy branch; QA lead: "never need to worry for the throw away data").
// Part D created (category picked) then deleted; its library entry's Delete confirmation opened and cancelled.
// Work order for the first customer with its first asset, line "ZZAUTOTEST PL line", approved; part B (active, 5 in bin) added from stock
// with Qty 7 (more than the bin holds); a part request via More options (Source Vendor) saved; Order clicked if offered.
import { start } from './lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT;
const { r, page, step, go, search, dlg } = await start(OUT);
const save = (n, o) => fs.writeFileSync(`${OUT}/${n}.json`, JSON.stringify(o, null, 1));
let k = 0; const body = async n => { await page.waitForTimeout(1500); n = String(++k).padStart(2, '0') + '-' + n; const d = page.locator('.q-dialog:visible, .q-menu:visible'); const t = (await d.count()) ? (await d.allInnerTexts()).join('\n----\n') : await page.locator('main').innerText().catch(() => '');
  fs.writeFileSync(`${OUT}/${n}.txt`, page.url() + '\n' + t); await page.screenshot({ path: `${OUT}/${n}.png` }); console.log(n, t.length); };
const pickFirst = async (label, scope) => { await (scope || dlg()).getByLabel(label, { exact: true }).first().click(); await page.waitForTimeout(1200); await page.locator('.q-menu:visible .q-item').first().click(); await page.waitForTimeout(600); };
await step('partD', async () => { await go('/parts/inventory'); await page.locator('main button:visible', { hasText: 'New Inventory Part' }).click(); await page.waitForTimeout(1500);
  const d = dlg(); await d.getByLabel('Description', { exact: true }).first().fill('ZZAUTOTEST PLBV PART D'); await d.getByLabel('Part Number', { exact: true }).first().fill('ZZAUTOTEST-PLBV-D');
  await pickFirst('Category'); await d.getByLabel('Cost', { exact: true }).first().fill('10'); await d.getByLabel('Sell Price', { exact: true }).first().fill('20');
  await d.getByRole('button', { name: 'Save', exact: true }).click(); await page.waitForTimeout(3000); await body('partD-after-save');
  await go('/parts/inventory'); await search('ZZAUTOTEST-PLBV-D'); await page.locator('main td').filter({ hasText: 'ZZAUTOTEST PLBV PART D' }).first().click(); await page.waitForTimeout(2000);
  await dlg().locator('button:visible', { hasText: 'Delete Part' }).first().click(); await page.waitForTimeout(1500); await body('delete-part-confirm');
  save('delete-part-buttons', await page.locator('.q-dialog:visible').last().locator('button:visible').allInnerTexts());
  await page.locator('.q-dialog:visible').last().locator('button:visible').filter({ hasText: /^Delete/ }).last().click(); await page.waitForTimeout(3000); await body('after-delete-part'); });
await step('libdel', async () => { await go('/parts/parts-catalogue'); await search('ZZAUTOTEST-PLBV-D'); await page.waitForTimeout(1500);
  await page.locator('main tbody tr.cursor-pointer').first().locator('td').nth(1).click(); await page.waitForTimeout(2500); await body('lib-entry');
  await page.locator('main i:visible', { hasText: 'edit_note' }).first().click(); await page.waitForTimeout(1500);
  await dlg().getByRole('button', { name: 'Delete', exact: true }).click(); await page.waitForTimeout(1500); await body('lib-delete-confirm');
  save('lib-delete-buttons', await page.locator('.q-dialog:visible').last().locator('button:visible').allInnerTexts());
  await page.locator('.q-dialog:visible').last().locator('button:visible', { hasText: /Cancel/ }).first().click(); await page.keyboard.press('Escape'); });
await step('wo', async () => { await go('/workorders'); await page.locator('main button:visible', { hasText: 'Create Work Order' }).click(); await page.waitForTimeout(1500);
  await pickFirst('Customer'); await pickFirst('Asset'); await body('new-wo-filled'); await dlg().getByRole('button', { name: 'Save', exact: true }).click(); await page.waitForTimeout(3000);
  if (await page.locator('.q-dialog:visible').count()) { await body('wo-confirm'); const b = page.locator('.q-dialog:visible').last().locator('button:visible').filter({ hasText: /Create|Confirm|Yes|Continue/ }); if (await b.count()) await b.first().click(); }
  await page.waitForTimeout(4000); await body('wo-created'); save('wo-url', page.url()); });
await step('line', async () => { if (!(await page.locator('.q-dialog:visible').count())) await page.locator('button:visible', { hasText: /^New Line$/ }).first().click(); await page.waitForTimeout(2000);
  await dlg().getByLabel('Title').first().fill('ZZAUTOTEST PL line'); await page.keyboard.press('Tab'); await page.waitForTimeout(800); await body('new-line-filled');
  await dlg().locator('button:visible', { hasText: 'Save & Close' }).first().click(); await page.waitForTimeout(3000); await body('line-saved');
  save('line-buttons', await page.locator('main button:visible').allInnerTexts()); });
await step('approve', async () => { const a = page.locator('main button:visible', { hasText: /^Approve$/ }); save('approve-count', await a.count()); if (await a.count()) { await a.first().click(); await page.waitForTimeout(2500); await body('after-approve'); } });
await step('stock', async () => { await page.locator('main button:visible, main a:visible', { hasText: 'Add Part' }).first().click(); await page.waitForTimeout(1200);
  await page.locator('main input:visible').first().click(); await page.keyboard.type('ZZAUTOTEST-PLBV-B', { delay: 50 }); await page.waitForTimeout(3000); await body('stock-lookup');
  await page.locator('.q-menu:visible .q-item').filter({ hasText: 'Inventory Qty' }).first().click(); await page.waitForTimeout(1500); await body('stock-picked');
  const qty = page.locator('main').getByLabel(/Qty/).first(); await qty.fill('7').catch(() => {}); await page.waitForTimeout(800); await body('stock-qty7');
  await page.locator('main button:visible', { hasText: /^Save$/ }).first().click(); await page.waitForTimeout(3000); await body('stock-saved'); });
await step('request', async () => { await page.locator('main button:visible, main a:visible', { hasText: 'Add Part' }).first().click(); await page.waitForTimeout(1200);
  await page.locator('main button:visible', { hasText: 'More options' }).first().click(); await page.waitForTimeout(2000); await body('npr-window');
  const d = dlg(); await d.getByLabel('Part Number').first().click(); await page.keyboard.type('ZZAUTOTEST-PLBV-SO1', { delay: 40 }); await page.waitForTimeout(2500); await body('npr-typed');
  await page.locator('.q-menu:visible .q-item').filter({ hasText: /ZZAUTOTEST-PLBV-SO1/ }).first().click().catch(() => {}); await page.waitForTimeout(1000);
  await d.getByLabel('Description').first().fill('ZZAUTOTEST PLBV SPECIAL ORDER 1').catch(() => {}); await body('npr-filled');
  save('npr-labels', await d.locator('label:visible, button:visible').allInnerTexts()); });
await r.browser.close();
