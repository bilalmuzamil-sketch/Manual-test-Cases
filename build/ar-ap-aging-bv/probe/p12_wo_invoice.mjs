import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./12/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dlg = () => page.locator('.q-dialog:visible').last(); const menu = async () => (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T);
const CU = fs.readFileSync(new URL('./10/customer-url.txt', import.meta.url), 'utf8').trim().replace(A, '').replace(/\/work-orders$/, '');
const pickField = async (lab, text) => { const f = dlg().locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: lab }) }).first(); await f.click(); await page.waitForTimeout(1200); const m = await menu(); const it = text ? page.locator('.q-menu:visible .q-item').filter({ hasText: text }).first() : page.locator('.q-menu:visible .q-item').first(); await it.click(); await page.waitForTimeout(800); return m; };
await step('terms', async () => { await go(CU + '/work-orders'); await page.waitForTimeout(3000); await page.locator('main button:visible', { hasText: 'edit_note' }).first().click(); await page.waitForTimeout(2500);
  log('TAX OPTIONS:', JSON.stringify(await pickField('Taxes', null))); await page.keyboard.press('Escape').catch(() => {});
  log('TERMS picked Net 30 from', JSON.stringify(await pickField('Credit Terms', /^\s*Net 30\s*$/)));
  await dlg().locator('button:visible', { hasText: /^Save$/ }).click(); await page.waitForTimeout(3000); log('after save dialogs:', await page.locator('.q-dialog:visible').count()); });
await step('new-wo', async () => { await page.locator('main button:visible', { hasText: 'New Work Order' }).first().click(); await page.waitForTimeout(3000); log('NEW WO:', T(await dlg().innerText()).slice(0, 300), '| url', page.url());
  const asset = dlg().locator('.q-field', { hasText: /Asset/ }).first(); if (await asset.count()) { await asset.click(); await page.waitForTimeout(1500); log('asset options', JSON.stringify((await menu()).slice(0, 4))); await page.keyboard.press('Escape'); }
  await dlg().locator('button:visible', { hasText: /^Save$/ }).first().click(); await page.waitForTimeout(4000); log('after save url', page.url(), '| dialogs', T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 400)); fs.writeFileSync(OUT + 'wo-url.txt', page.url()); await dump('after-wo', true); });
await r.browser?.close?.(); process.exit(0);
