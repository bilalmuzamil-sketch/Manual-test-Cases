import { start } from './lib.mjs';
const OUT = new URL('./27/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dlg = () => page.locator('.q-dialog:visible').last(); const menu = async () => (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T);
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 1000);
for (const [name, path] of [['Vendors', '/parts/vendors'], ['Vendor Invoices', '/parts/vendor-invoices'], ['Purchase Orders', '/parts/purchase-orders'], ['Returns', '/parts/returns']]) await step(name, async () => {
  await go('/parts/inventory'); await page.waitForTimeout(2000); const l = page.locator('a:visible, .q-item:visible').filter({ hasText: new RegExp('^\\s*\\S*\\s*' + name + '\\s*$') }).first(); await l.click(); await page.waitForTimeout(3000);
  log(`== ${name} URL`, page.url()); log(`${name} BUTTONS:`, JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))].filter(Boolean).slice(0, 15))); log(`${name} TH:`, JSON.stringify((await page.locator('main thead th').allInnerTexts()).map(T).filter(Boolean))); });
await step('new-vendor', async () => { await go('/parts/vendors'); await page.waitForTimeout(3000); const b = page.locator('main button:visible').filter({ hasText: /New Vendor|Add Vendor|Create Vendor/ }).first(); log('vendor btn', T(await b.innerText().catch(() => 'none'))); await b.click(); await page.waitForTimeout(2500); log('NEW VENDOR:', await dl()); log('labels', JSON.stringify(await dlg().locator('.q-field__label').allTextContents()));
  const t = dlg().locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: /term/i }) }).first(); if (await t.count()) { await t.click(); await page.waitForTimeout(1200); log('VENDOR TERMS:', JSON.stringify(await menu())); await page.keyboard.press('Escape'); } await dump('new-vendor'); await page.keyboard.press('Escape'); });
await r.browser?.close?.(); process.exit(0);
