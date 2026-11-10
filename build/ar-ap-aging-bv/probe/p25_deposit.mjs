import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./25/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dlg = () => page.locator('.q-dialog:visible').last();
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 1200);
const CU = fs.readFileSync(new URL('./10/customer-url.txt', import.meta.url), 'utf8').trim().replace(A, '').replace(/\/work-orders$/, '');
const okNotes = async () => { for (let i = 0; i < 2; i++) { const ok = page.locator('.q-dialog:visible button', { hasText: /^Ok$/ }).first(); if (await ok.count()) { await ok.click(); await page.waitForTimeout(1000); } } };
await step('store-credit', async () => { await go(CU + '/invoices'); await page.waitForTimeout(3000); await page.locator('main button:visible', { hasText: 'Issue Credit' }).first().click(); await page.waitForTimeout(2500); await dlg().getByText('Issue Store Credit', { exact: true }).click(); await page.waitForTimeout(1000); log('STORE CREDIT:', await dl()); log('buttons', JSON.stringify((await dlg().locator('button:visible').allInnerTexts()).map(T))); await dump('store-credit'); await dlg().locator('button:visible', { hasText: /^Cancel$/ }).click(); await page.waitForTimeout(1000); });
await step('wo2', async () => { await go(CU + '/work-orders'); await page.waitForTimeout(3000); await page.locator('main button:visible', { hasText: 'New Work Order' }).first().click(); await page.waitForTimeout(3000); log('NEW WO dialog:', await dl());
  if (await page.locator('.q-dialog:visible', { hasText: 'New Work Order' }).count()) { const af = dlg().locator('.q-field', { hasText: /Asset/ }).first(); await af.click(); await page.waitForTimeout(1200); await page.locator('.q-menu:visible .q-item').first().click(); await page.waitForTimeout(800); await dlg().locator('button:visible', { hasText: /^Save$/ }).first().click(); await page.waitForTimeout(4000); }
  await okNotes(); const nl = page.locator('.q-dialog:visible', { hasText: 'New Line' }); if (await nl.count()) await nl.locator('button', { hasText: 'close' }).first().click(); await page.waitForTimeout(1500); fs.writeFileSync(OUT + 'wo2-url.txt', page.url()); log('WO2', page.url()); });
await step('deposit', async () => { await page.locator('main .q-tab', { hasText: /^\s*Finance/ }).first().click(); await page.waitForTimeout(3000); log('fin buttons', JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))].filter(Boolean)));
  await page.locator('main button:visible', { hasText: 'Add Deposit' }).first().click(); await page.waitForTimeout(3000); log('DEPOSIT:', await dl()); log('labels', JSON.stringify(await dlg().locator('.q-field__label').allTextContents())); log('buttons', JSON.stringify((await dlg().locator('button:visible').allInnerTexts()).map(T))); await dump('deposit'); await page.keyboard.press('Escape'); });
await r.browser?.close?.(); process.exit(0);
