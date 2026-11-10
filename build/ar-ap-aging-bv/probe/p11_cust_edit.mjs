import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./11/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dlg = () => page.locator('.q-dialog:visible').last();
const CU = fs.readFileSync(new URL('./10/customer-url.txt', import.meta.url), 'utf8').trim().replace(A, '');
await step('edit', async () => { await go(CU); await page.waitForTimeout(3000); await page.locator('main button:visible', { hasText: 'edit_note' }).first().click(); await page.waitForTimeout(2500);
  log('EDIT:', T(await dlg().innerText()).slice(0, 1800)); log('EDIT LABELS:', JSON.stringify(await dlg().locator('.q-field__label').allTextContents())); log('EDIT TOGGLES:', JSON.stringify((await dlg().locator('.q-toggle, .q-checkbox').allInnerTexts()).map(T))); await dump('edit-customer');
  const ct = dlg().locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: /term/i }) }).first(); log('term field', await ct.count()); if (await ct.count()) { await ct.click(); await page.waitForTimeout(1200); log('CREDIT TERM OPTIONS:', JSON.stringify((await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T))); await page.keyboard.press('Escape'); }
  await page.keyboard.press('Escape'); });
await step('tabs', async () => { for (const t of ['Invoices', 'Payments', 'Deposits']) { await page.locator('main .q-tab', { hasText: new RegExp('^\\s*' + t) }).first().click(); await page.waitForTimeout(2500); log(t, 'TAB:', T(await page.locator('main').innerText()).slice(-500)); log(t, 'BUTTONS:', JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))].slice(0, 20))); } });
await r.browser?.close?.(); process.exit(0);
