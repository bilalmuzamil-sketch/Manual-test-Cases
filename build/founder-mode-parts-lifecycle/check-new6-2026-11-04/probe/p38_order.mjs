// Probe 38 (throwaway data on the dummy branch): click Order on the probe-36 part request (W3030LS, Auth To Order) on the probe-18 work
// order, read every screen; then receive that purchase order from the Purchase Orders list and read the work order line afterwards.
import { start } from '../../build-verify-sv10647-2026-11-03/probe/lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT; const WO = 'https://sv10647.qa.shopview.com/workorders/56ea768d-c925-4f05-b165-16d89aec9cba/part-requests';
const { r, page, step, go, dlg } = await start(OUT);
let k = 0; const body = async n => { await page.waitForTimeout(1500); n = String(++k).padStart(2, '0') + '-' + n; const d = page.locator('.q-dialog:visible, .q-menu:visible');
  const t = (await d.count()) ? (await d.allInnerTexts()).join('\n----\n') : await page.locator('main').innerText().catch(() => '');
  fs.writeFileSync(`${OUT}/${n}.txt`, page.url() + '\n' + t); await page.screenshot({ path: `${OUT}/${n}.png` }); console.log(n, page.url().replace('https://sv10647.qa.shopview.com', ''), '::', t.replace(/\s+/g, ' ').slice(0, 420)); };
const openWO = async () => { for (let t = 0; t < 3 && !page.url().includes('/part-requests'); t++) { await page.goto(WO); await page.waitForTimeout(5000); } };
await step('order', async () => { await openWO(); await body('parts-tab-before');
  await page.locator('main button:visible', { hasText: /^Order$/ }).first().click(); await page.waitForTimeout(3000); await body('after-order-click');
  if (await page.locator('.q-dialog:visible').count()) { fs.writeFileSync(`${OUT}/order-dialog-buttons.json`, JSON.stringify(await dlg().locator('button:visible, label:visible').allInnerTexts()));
    const v = dlg().getByLabel(/Vendor/).first(); if (await v.count()) { await v.click(); await page.waitForTimeout(1500); await page.locator('.q-menu:visible .q-item').filter({ hasNotText: 'No results' }).first().click().catch(() => {}); await page.waitForTimeout(800); }
    await body('order-dialog-filled'); const go2 = dlg().locator('button:visible').filter({ hasText: /^(Order|Save|Confirm|Create|Submit|Send)/ }).last(); await go2.click(); await page.waitForTimeout(4000); await body('after-order-confirm'); }
  await page.goto(WO); await page.waitForTimeout(5000); await body('parts-tab-after-order'); });
await step('receive', async () => { await go('/parts/orders'); await page.waitForTimeout(3000); await body('po-list');
  const row = page.locator('main tbody tr').filter({ hasText: 'S10647-17584' }).first(); fs.writeFileSync(`${OUT}/po-row.txt`, await row.innerText().catch(() => 'no row'));
  await row.locator('button:visible', { hasText: /^Receive$/ }).first().click(); await page.waitForTimeout(6000);
  fs.writeFileSync(`${OUT}/receive.txt`, page.url() + '\n' + await page.locator('main').innerText());
  const inv = page.locator('main label').filter({ hasText: /Vendor Invoice #/ }).locator('input').first(); await inv.fill('ZZAUTOTEST-PLBV-INV1');
  const dt = page.locator('main label').filter({ hasText: /Invoice Date/ }).first(); await dt.click(); await page.waitForTimeout(800); await page.locator('.q-menu:visible, .q-date:visible').getByText('4', { exact: true }).first().click().catch(() => {}); await page.keyboard.press('Escape');
  await body('receive-filled'); await page.locator('main button:visible', { hasText: /Receive Parts/ }).first().click(); await page.waitForTimeout(5000); await body('after-receive');
  await page.goto(WO); await page.waitForTimeout(5000); await body('parts-tab-after-receive'); });
await r.browser.close();
