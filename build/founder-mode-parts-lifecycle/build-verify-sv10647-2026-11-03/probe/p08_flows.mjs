// Probe 08: work order + inline part row lookup, part sale finance, purchase orders, vendors, canned lines, quick sign-in users.
// Opens and cancels; nothing saved.
import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT;
const { r, page, dump, step, go, search, dots, btn, dlg } = await start(OUT);
const save = (n, o) => fs.writeFileSync(`${OUT}/${n}.json`, JSON.stringify(o, null, 1));
await step('quick', async () => { const q = await page.evaluate(async () => { const x = await fetch('https://sv10647api.qa.shopview.com/api/quick-login/users', { credentials: 'include' }); return x.status + ' ' + (await x.text()).slice(0, 800); }); save('quick-login-users', q); });
await step('inline', async () => { await go('/workorders'); await page.locator('main td').filter({ hasText: 'S2-6761' }).first().click(); await page.waitForTimeout(3500);
  await page.locator('main').locator('button:visible, a:visible', { hasText: 'Add Part' }).first().click(); await page.waitForTimeout(1500);
  const pn = page.locator('main input:visible').first(); await pn.click(); await page.keyboard.type('ZZAUTOTEST-PLBV', { delay: 50 }); await page.waitForTimeout(3000); await dump('inline-lookup');
  save('inline-lookup-menu', await page.locator('.q-menu:visible').allInnerTexts()); await page.keyboard.press('Escape'); await page.waitForTimeout(600); await dump('after-esc-1', true); await page.keyboard.press('Escape'); await page.waitForTimeout(600); await dump('after-esc-2', true);
  await btn('Add Part').click(); await page.waitForTimeout(1200); await btn('More options').click(); await page.waitForTimeout(2000); await dump('more-options-window'); save('more-options-buttons', await dlg().locator('button:visible').allInnerTexts()); await page.keyboard.press('Escape'); });
await step('create-wo', async () => { await go('/workorders'); await btn('Create Work Order').click(); await page.waitForTimeout(2000); await dump('create-wo-window'); await page.keyboard.press('Escape'); });
await step('ps-finance', async () => { await go('/parts/part-sales'); await page.locator('main td').filter({ hasText: 'P2-162' }).first().click(); await page.waitForTimeout(3000); await page.getByRole('tab', { name: /Finance/ }).click(); await page.waitForTimeout(2500); await dump('part-sale-finance', true); save('ps-finance-buttons', await page.locator('main button:visible').allInnerTexts()); });
await step('po', async () => { await go('/parts/inventory'); await page.locator('aside, .q-drawer').getByText('Purchase Orders', { exact: true }).first().click(); await page.waitForTimeout(3000); await dump('po-list', true); save('po-buttons', await page.locator('main button:visible').allInnerTexts()); });
await step('vinv', async () => { await page.locator('aside, .q-drawer').getByText('Vendor Invoices', { exact: true }).first().click(); await page.waitForTimeout(3000); await dump('vendor-invoices', true); save('vinv-buttons', await page.locator('main button:visible').allInnerTexts()); });
await step('vendors', async () => { await page.locator('aside, .q-drawer').getByText('Vendors', { exact: true }).first().click(); await page.waitForTimeout(3000); await dump('vendors', true); save('vendors-buttons', await page.locator('main button:visible').allInnerTexts()); });
await step('canned', async () => { await go('/administration/canned-lines'); await dump('canned-lines', true); save('canned-buttons', await page.locator('main button:visible').allInnerTexts()); });
await r.browser.close();
