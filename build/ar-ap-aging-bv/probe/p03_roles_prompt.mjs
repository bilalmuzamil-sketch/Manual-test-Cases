import { start } from './lib.mjs';
const OUT = new URL('./03/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dlgs = async () => (await page.locator('.q-dialog:visible').allInnerTexts()).map(T).join(' || ');
await step('switch-prompt', async () => { await go('/reports/ar-aging-detail'); await page.waitForTimeout(3000); await page.locator('main button[aria-label="Expand all buckets"]').click(); await page.waitForTimeout(4000);
  const row = page.locator('main tbody tr').filter({ hasText: 'Staging Lethbridge - 4310' }).first(); const a = row.locator('a').first(); log('other-location doc:', T(await a.innerText())); await a.click(); await page.waitForTimeout(2500);
  log('PROMPT:', await dlgs(), '| url', page.url()); await dump('switch-prompt'); log('PROMPT BUTTONS:', JSON.stringify((await page.locator('.q-dialog:visible button').allInnerTexts()).map(T)));
  const c = page.locator('.q-dialog:visible button', { hasText: /^Cancel$/ }).first(); if (await c.count()) { await c.click(); await page.waitForTimeout(1200); } log('after Cancel url', page.url(), '| dialogs', await page.locator('.q-dialog:visible').count()); });
await step('empty', async () => { await go('/reports/ar-aging-summary'); await page.waitForTimeout(3000); await page.locator('main button:visible', { hasText: 'Location:' }).first().click(); await page.waitForTimeout(1000); await page.locator('.q-menu:visible').getByText('Clear selection', { exact: true }).click(); await page.waitForTimeout(1000); await page.keyboard.press('Escape'); await page.waitForTimeout(3000);
  log('LOCATION CHIP:', T(await page.locator('main button:visible', { hasText: 'Location:' }).first().innerText())); log('EMPTY STATE:', T(await page.locator('main').innerText()).slice(-300)); await dump('empty', true);
  const ca = page.locator('main button:visible', { hasText: 'Clear all filters' }).first(); log('Clear all filters btn:', await ca.count()); if (await ca.count()) { await ca.click(); await page.waitForTimeout(2500); log('after clear chip:', T(await page.locator('main button:visible', { hasText: 'Location:' }).first().innerText())); } });
await step('roles', async () => { await go('/administration/roles-permissions'); await page.waitForTimeout(3000); log('ROLE ROWS:', T(await page.locator('main tbody').innerText()).slice(0, 700));
  await page.locator('main button:visible', { hasText: 'Create Custom Role' }).first().click(); await page.waitForTimeout(2000); await page.locator('.q-dialog:visible button', { hasText: 'Skip' }).first().click(); await page.waitForTimeout(3500);
  const b = T(await page.locator('main').innerText()); for (const s of ['Reports', 'Page Access', 'View and Manage AP/AR Data', 'Customers', 'Invoicing & Payments', 'Invoicing & payments', 'See Financial Data', 'Work Orders', 'Work orders', 'Part Sales', 'Part sales', 'Vendor Order Management', 'Vendor order management']) { const i = b.indexOf(s); log(`[${s}]`, i >= 0 ? b.slice(i, i + 170) : 'NOT FOUND'); }
  await dump('role-form', true); });
await r.browser?.close?.(); process.exit(0);
