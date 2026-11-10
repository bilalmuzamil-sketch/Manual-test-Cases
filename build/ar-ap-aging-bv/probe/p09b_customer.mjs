import { start } from './lib.mjs';
const OUT = new URL('./09b/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
await step('new', async () => { await go('/customers'); await page.waitForTimeout(2500); await page.getByRole('button', { name: 'New Customer' }).first().click(); await page.waitForTimeout(4000);
  log('URL', page.url(), '| dialogs', await page.locator('.q-dialog').count(), await page.locator('.q-dialog:visible').count());
  const scope = (await page.locator('.q-dialog:visible').count()) ? page.locator('.q-dialog:visible').last() : page.locator('main');
  log('FORM:', T(await scope.innerText()).slice(0, 1600)); log('LABELS:', JSON.stringify(await scope.locator('.q-field__label').allTextContents()));
  log('TOGGLES:', JSON.stringify((await scope.locator('.q-toggle, .q-checkbox').allInnerTexts()).map(T))); await dump('new-customer', true);
  const ct = scope.locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: /term/i }) }).first(); log('term field', await ct.count()); if (await ct.count()) { await ct.click(); await page.waitForTimeout(1200); log('CREDIT TERM OPTIONS:', JSON.stringify((await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T))); await page.keyboard.press('Escape'); }
  const tx = scope.locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: /tax/i }) }).first(); log('tax field', await tx.count(), T(await tx.innerText().catch(() => ''))); });
await r.browser?.close?.(); process.exit(0);
