import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./24b/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dlg = () => page.locator('.q-dialog:visible').last();
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 1200);
const CU = fs.readFileSync(new URL('./10/customer-url.txt', import.meta.url), 'utf8').trim().replace(A, '').replace(/\/work-orders$/, '');
for (const t of ['Invoices', 'Payments']) await step('tab-' + t, async () => { await go(CU + '/work-orders'); await page.waitForTimeout(3000); await page.locator('main .q-tab', { hasText: new RegExp('^\\s*' + t) }).first().click(); await page.waitForTimeout(3000);
  log(`${t} URL`, page.url()); log(`${t}:`, T(await page.locator('main').innerText()).slice(0, 700)); log(`${t} BUTTONS:`, JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))].filter(Boolean))); await dump(t, true); });
await step('issue-credit', async () => { await go(CU + '/work-orders'); await page.waitForTimeout(3000); await page.locator('main .q-tab', { hasText: /^\s*Invoices/ }).first().click(); await page.waitForTimeout(3000); const b = page.locator('main button:visible', { hasText: 'Issue Credit' }).first(); log('Issue Credit btns', await page.locator('main button:visible', { hasText: 'Issue Credit' }).count()); if (await b.count()) { await b.click(); await page.waitForTimeout(3000); log('ISSUE CREDIT:', await dl()); log('labels', JSON.stringify(await dlg().locator('.q-field__label').allTextContents())); await dump('issue-credit'); await page.keyboard.press('Escape'); } });
await step('deposit', async () => { await go('/workorders/0ccea320-2048-47c2-b4c3-3a30d9a1625c/finance'); await page.waitForTimeout(3500); for (let i = 0; i < 2; i++) { const ok = page.locator('.q-dialog:visible button', { hasText: /^Ok$/ }).first(); if (await ok.count()) { await ok.click(); await page.waitForTimeout(1000); } }
  log('finance buttons', JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))].filter(Boolean))); const b = page.locator('main button:visible', { hasText: 'Add Deposit' }).first(); log('Add Deposit', await b.count()); if (await b.count()) { await b.click(); await page.waitForTimeout(3000); log('DEPOSIT DIALOG:', await dl()); log('labels', JSON.stringify(await dlg().locator('.q-field__label').allTextContents())); await dump('deposit'); await page.keyboard.press('Escape'); } });
await r.browser?.close?.(); process.exit(0);
