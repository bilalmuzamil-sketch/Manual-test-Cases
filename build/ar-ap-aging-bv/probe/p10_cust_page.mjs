import { start } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./10/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dlg = () => page.locator('.q-dialog:visible').last();
await step('create', async () => { await go('/customers'); await page.waitForTimeout(2500); await page.getByRole('button', { name: 'New Customer' }).first().click(); await page.waitForTimeout(2500);
  await dlg().locator('.q-field', { hasText: 'Name' }).first().locator('input').fill('ZZAUTOTEST AR Customer A'); await dlg().locator('.q-field', { hasText: 'Phone' }).first().locator('input').fill('4035550101');
  await dlg().locator('button:visible', { hasText: /^Save$/ }).click(); await page.waitForTimeout(4000); log('after save URL', page.url(), '| dialogs', T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' | ')).slice(0, 300)); fs.writeFileSync(OUT + 'customer-url.txt', page.url()); });
await step('page', async () => { log('PAGE:', T(await page.locator('main').innerText()).slice(0, 1200)); log('TABS:', JSON.stringify((await page.locator('main .q-tab').allInnerTexts()).map(T))); log('BUTTONS:', JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))].slice(0, 25))); await dump('customer-page', true); });
await step('edit', async () => { const e = page.locator('main button:visible, main i:visible').filter({ hasText: /^(edit|Edit|Edit Customer)$/ }).first(); log('edit ctl', await e.count()); await e.click(); await page.waitForTimeout(2500); log('EDIT:', T(await dlg().innerText()).slice(0, 1500)); log('EDIT LABELS:', JSON.stringify(await dlg().locator('.q-field__label').allTextContents())); await dump('edit-customer');
  const ct = dlg().locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: /term/i }) }).first(); log('term field', await ct.count()); if (await ct.count()) { await ct.click(); await page.waitForTimeout(1200); log('CREDIT TERM OPTIONS:', JSON.stringify((await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T))); await page.keyboard.press('Escape'); }
  await page.keyboard.press('Escape'); });
await r.browser?.close?.(); process.exit(0);
