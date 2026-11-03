// Probe 17: (1) a purchase order with no work order: Add Order Item window (closed unsaved); New PO window (closed unsaved).
// (2) throwaway part ZZAUTOTEST-PLBV-D created then deleted (Delete Part), then its Part Library entry's Delete confirmation opened and cancelled.
import { start } from './lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT;
const { r, page, step, go, search, dlg } = await start(OUT);
const save = (n, o) => fs.writeFileSync(`${OUT}/${n}.json`, JSON.stringify(o, null, 1));
const body = async n => { await page.waitForTimeout(1500); const d = page.locator('.q-dialog:visible'); const t = (await d.count()) ? (await d.allInnerTexts()).join('\n----\n') : await page.locator('body').innerText();
  fs.writeFileSync(`${OUT}/${n}.txt`, page.url() + '\n' + t); await page.screenshot({ path: `${OUT}/${n}.png` }); console.log(n, page.url(), t.length); };
await step('po-nowo', async () => { await go('/parts/orders'); await page.waitForTimeout(2500);
  const rows = page.locator('main tbody tr'); const n = await rows.count(); let picked = null;
  for (let k = 0; k < n && !picked; k++) { const cells = await rows.nth(k).locator('td').allInnerTexts(); if (cells.length > 4 && cells[0].trim() === '' && /Ordered|Partially|Open|Pending|Draft/i.test(cells.join(' '))) picked = { k, cells }; }
  save('po-picked', picked); if (!picked) throw new Error('no PO without a work order on the first page');
  await rows.nth(picked.k).locator('td').nth(1).click(); await page.waitForTimeout(6000); await body('po-nowo-page');
  await page.locator('button:visible', { hasText: 'Add Order Item' }).first().click(); await page.waitForTimeout(2500); await body('add-order-item');
  save('add-order-item-labels', await dlg().locator('label:visible, button:visible').allInnerTexts()); await page.keyboard.press('Escape'); });
await step('newpo', async () => { await go('/parts/orders'); await page.waitForTimeout(2000); await page.locator('main button:visible', { hasText: 'New PO' }).first().click(); await page.waitForTimeout(2500); await body('new-po');
  save('new-po-labels', await dlg().locator('label:visible, button:visible').allInnerTexts()); await page.keyboard.press('Escape'); });
await step('delete', async () => { await go('/parts/inventory'); await page.locator('main button:visible', { hasText: 'New Inventory Part' }).click(); await page.waitForTimeout(1500);
  const d = dlg(); await d.getByLabel('Description', { exact: true }).first().fill('ZZAUTOTEST PLBV PART D'); await d.getByLabel('Part Number', { exact: true }).first().fill('ZZAUTOTEST-PLBV-D');
  await d.getByLabel('Cost', { exact: true }).first().fill('10'); await d.getByLabel('Sell Price', { exact: true }).first().fill('20'); await d.getByRole('button', { name: 'Save', exact: true }).click(); await page.waitForTimeout(3000);
  await go('/parts/inventory'); await search('ZZAUTOTEST-PLBV-D'); await page.locator('main td').filter({ hasText: 'ZZAUTOTEST PLBV PART D' }).first().click(); await page.waitForTimeout(2000);
  await dlg().locator('button:visible', { hasText: 'Delete Part' }).first().click(); await page.waitForTimeout(1500); await body('delete-part-confirm');
  save('delete-part-buttons', await page.locator('.q-dialog:visible').last().locator('button:visible').allInnerTexts());
  await page.locator('.q-dialog:visible').last().locator('button:visible').filter({ hasText: /^(Delete|Confirm|Yes)/ }).last().click(); await page.waitForTimeout(3000); await body('after-delete-part'); });
await step('libdel', async () => { await go('/parts/parts-catalogue'); await search('ZZAUTOTEST-PLBV-D'); await page.waitForTimeout(1500); await body('lib-search');
  await page.locator('main tbody tr.cursor-pointer').first().locator('td').nth(1).click(); await page.waitForTimeout(2500); await body('lib-entry');
  await page.locator('main i:visible', { hasText: 'edit_note' }).first().click(); await page.waitForTimeout(1500); await body('lib-edit');
  await dlg().getByRole('button', { name: 'Delete', exact: true }).click(); await page.waitForTimeout(1500); await body('lib-delete-confirm');
  save('lib-delete-buttons', await page.locator('.q-dialog:visible').last().locator('button:visible').allInnerTexts());
  await page.locator('.q-dialog:visible').last().locator('button:visible', { hasText: /Cancel/ }).first().click(); });
await r.browser.close();
